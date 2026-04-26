'use client';

import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { saveGameScore } from '@/app/actions/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const GRID_SIZE = 3;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

export default function ImagePuzzle() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolving, setIsSolving] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);

  // Initialize sorted array [0, 1, ..., 8]
  const solvedState = Array.from({ length: TOTAL_TILES }, (_, i) => i);

  const initGame = useCallback(() => {
    let newTiles = [...solvedState];
    // Shuffle the array
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }
    
    // Prevent starting with a solved puzzle
    if (newTiles.every((val, index) => val === index)) {
      [newTiles[0], newTiles[1]] = [newTiles[1], newTiles[0]];
    }

    setTiles(newTiles);
    setMoves(0);
    setTime(0);
    setIsPlaying(true);
    setSelectedTileIndex(null);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !isSolving) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isSolving]);

  const handleTileClick = (index: number) => {
    if (!isPlaying) return;

    if (selectedTileIndex === null) {
      setSelectedTileIndex(index);
    } else {
      if (selectedTileIndex !== index) {
        const newTiles = [...tiles];
        // Swap
        [newTiles[selectedTileIndex], newTiles[index]] = [newTiles[index], newTiles[selectedTileIndex]];
        setTiles(newTiles);
        setMoves((m) => m + 1);
        checkWinCondition(newTiles);
      }
      setSelectedTileIndex(null);
    }
  };

  const checkWinCondition = async (currentTiles: number[]) => {
    const isWin = currentTiles.every((val, index) => val === index);
    if (isWin) {
      setIsPlaying(false);
      setIsSolving(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#800000', '#FFD700', '#ffffff'] // Maroon and Gold
      });
      toast.success(`Puzzle Solved in ${time} seconds with ${moves + 1} moves!`);
      
      const res = await saveGameScore(moves + 1, time);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success('Score saved to leaderboard!');
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 shadow-xl border-primary/20 bg-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-primary font-bold">Awurudu Image Puzzle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4 text-sm font-semibold text-muted-foreground">
          <div>Moves: {moves}</div>
          <div>Time: {time}s</div>
        </div>

        <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden grid grid-cols-3 grid-rows-3 gap-1 p-1">
          {tiles.map((tile, index) => {
            const x = (tile % GRID_SIZE) * 100;
            const y = Math.floor(tile / GRID_SIZE) * 100;

            return (
              <div
                key={tile}
                onClick={() => handleTileClick(index)}
                className={`relative w-full h-full cursor-pointer overflow-hidden rounded-md transition-all duration-200 hover:opacity-90 ${selectedTileIndex === index ? 'ring-4 ring-secondary ring-inset scale-95' : ''}`}
              >
                <div
                  className="absolute w-[300%] h-[300%]"
                  style={{
                    backgroundImage: 'url(/lamp.png)',
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${x}% ${y}%`,
                  }}
                />
                {/* Optional: Add numbers for accessibility or ease */}
                {/* <div className="absolute inset-0 flex items-center justify-center text-white/50 text-2xl font-bold font-mono pointer-events-none drop-shadow-md">
                  {tile + 1}
                </div> */}
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={initGame} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          {isSolving ? 'Play Again' : 'Shuffle & Restart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
