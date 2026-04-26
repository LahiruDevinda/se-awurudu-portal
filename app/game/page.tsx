import ImagePuzzle from '@/components/ImagePuzzle';

export default function GamePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">UoK Awurudu Festival</h1>
      </header>
      <main className="p-4 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-muted/30">
        <ImagePuzzle />
      </main>
    </div>
  );
}
