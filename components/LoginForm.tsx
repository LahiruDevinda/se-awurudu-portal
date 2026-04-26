'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestOTP, verifyOTP } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await requestOTP(email);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('OTP sent to your email!');
      setStep('otp');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await verifyOTP(email, otp);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Login successful!');
      router.push('/');
    }
  };

  return (
    <Card className="w-[350px] shadow-lg border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-primary font-bold">Awurudu Portal</CardTitle>
        <CardDescription>University of Kelaniya Students Only</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'email' ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">University Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="stu.kln.ac.lk or kln.ac.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">6-Digit OTP</Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={loading}
                className="text-center tracking-widest text-lg"
              />
            </div>
            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setStep('email')} disabled={loading}>
              Back
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
