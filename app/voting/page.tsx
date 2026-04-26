import VotingDashboard from '@/components/VotingDashboard';

export default function VotingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">UoK Awurudu Festival</h1>
      </header>
      <main>
        <VotingDashboard />
      </main>
    </div>
  );
}
