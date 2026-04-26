import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5 pointer-events-none"></div>
      
      <div className="z-10 text-center space-y-8 max-w-4xl px-4 py-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-primary tracking-tighter drop-shadow-sm">
            UoK Awurudu
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Welcome to the University of Kelaniya Digital Awurudu Festival. Join the celebration!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto mt-12">
          <Link href="/voting" passHref className="w-full">
            <Button size="lg" className="w-full h-48 md:h-56 relative overflow-hidden group text-2xl shadow-xl transition-all border-2 border-primary/20 rounded-xl hover:scale-[1.02]">
              <div className="absolute inset-0 bg-black/60 z-10 transition-opacity group-hover:bg-black/40"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80" alt="Pageant" className="absolute inset-0 w-full h-full object-cover z-0" />
              <span className="relative z-20 text-white font-bold tracking-wider drop-shadow-md">Awurudu Kumara & Kumariya</span>
            </Button>
          </Link>

          <Link href="/game" passHref className="w-full">
            <Button size="lg" className="w-full h-48 md:h-56 relative overflow-hidden group text-2xl shadow-xl transition-all border-2 border-primary/20 rounded-xl hover:scale-[1.02]">
              <div className="absolute inset-0 bg-black/60 z-10 transition-opacity group-hover:bg-black/40"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=800&q=80" alt="Puzzle" className="absolute inset-0 w-full h-full object-cover z-0" />
              <span className="relative z-20 text-white font-bold tracking-wider drop-shadow-md">Image Puzzle Game</span>
            </Button>
          </Link>

          <Link href="/papol" passHref className="w-full">
            <Button size="lg" className="w-full h-48 md:h-56 relative overflow-hidden group text-2xl shadow-xl transition-all border-2 border-primary/20 rounded-xl hover:scale-[1.02]">
              <div className="absolute inset-0 bg-black/60 z-10 transition-opacity group-hover:bg-black/40"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1550605156-42bc32c2d274?w=800&q=80" alt="Papol" className="absolute inset-0 w-full h-full object-cover z-0" />
              <span className="relative z-20 text-white font-bold tracking-wider drop-shadow-md">Papol Gediye Game</span>
            </Button>
          </Link>

          <Link href="/moments" passHref className="w-full">
            <Button size="lg" className="w-full h-48 md:h-56 relative overflow-hidden group text-2xl shadow-xl transition-all border-2 border-primary/20 rounded-xl hover:scale-[1.02]">
              <div className="absolute inset-0 bg-black/60 z-10 transition-opacity group-hover:bg-black/40"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80" alt="Moments" className="absolute inset-0 w-full h-full object-cover z-0" />
              <span className="relative z-20 text-white font-bold tracking-wider drop-shadow-md">Moments Gallery</span>
            </Button>
          </Link>

          <Link href="/secret-stranger" passHref className="w-full">
            <Button size="lg" className="w-full h-48 md:h-56 relative overflow-hidden group text-2xl shadow-xl transition-all border-2 border-primary/20 rounded-xl hover:scale-[1.02]">
              <div className="absolute inset-0 bg-black/60 z-10 transition-opacity group-hover:bg-black/40"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800&q=80" alt="Secret" className="absolute inset-0 w-full h-full object-cover z-0" />
              <span className="relative z-20 text-white font-bold tracking-wider drop-shadow-md">Secret Stranger</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
