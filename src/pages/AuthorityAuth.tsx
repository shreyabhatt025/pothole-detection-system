import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { authService } from '@/services/authService';

// Check which toast system you're using
import { toast } from 'sonner';
// Or if using shadcn toast:
// import { useToast } from '@/hooks/use-toast';

export default function AuthorityAuth() {
  const navigate = useNavigate();
  // If using toast from shadcn, uncomment:
  // const { toast } = useToast();
  
  const [step, setStep] = useState<'email' | 'authid' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [authID, setAuthID] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [authorityName, setAuthorityName] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your official email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.checkAuthorityEmail(email);
      
      if (result.exists) {
        setAuthorityName(result.authorityName || '');
        setStep('authid');
        toast.success('Authority email verified');
      } else {
        toast.error('This email is not registered as an authority. Please contact admin.');
      }
    } catch (error) {
      toast.error('Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthIDSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authID.trim()) {
      toast.error('Please enter your Auth ID');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.validateAuthID(authID);
      
      if (result.valid) {
        const otpResult = await authService.sendOTP({
          identifier: email,
          type: 'authority'
        });

        if (otpResult.success) {
          toast.success(otpResult.message);
          setStep('otp');
          startResendTimer();
        } else {
          toast.error(otpResult.message);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.verifyOTP({
        identifier: email,
        otp,
        type: 'authority'
      });

      if (result.success && result.token) {
        toast.success('Login successful!');
        localStorage.setItem('authority_token', result.token);
        localStorage.setItem('authority_email', email);
        localStorage.setItem('authority_authid', authID);
        localStorage.setItem('authority_name', authorityName);
        navigate('/authority-dashboard');
      } else {
        toast.error(result.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    setCanResend(false);
    setResendTimer(30);
    
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const result = await authService.sendOTP({
        identifier: email,
        type: 'authority'
      });

      if (result.success) {
        toast.success('New OTP sent to your email!');
        startResendTimer();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {step === 'email' && 'Authority Login'}
            {step === 'authid' && 'Verify Auth ID'}
            {step === 'otp' && 'Verify OTP'}
          </CardTitle>
          <CardDescription>
            {step === 'email' && 'Enter your official authority email'}
            {step === 'authid' && `Enter Auth ID for ${authorityName}`}
            {step === 'otp' && `Enter OTP sent to ${email}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Official Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter official email"
                  required
                />
                <p className="text-sm text-gray-500">
                  Must be a registered authority email
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>
          )}

          {step === 'authid' && (
            <form onSubmit={handleAuthIDSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="authid">Auth ID</Label>
                <Input
                  id="authid"
                  type="text"
                  value={authID}
                  onChange={(e) => setAuthID(e.target.value.toUpperCase())}
                  placeholder="Enter your Auth ID"
                  className="uppercase"
                  required
                />
                <p className="text-sm text-gray-500">
                  Provided by your department administrator
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Verifying...' : 'Verify & Send OTP'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setStep('email');
                    setAuthID('');
                  }}
                  disabled={loading}
                  className="w-full"
                >
                  ← Change email
                </Button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label className="text-center block">Enter 6-digit verification code</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={loading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOTP}
                    disabled={!canResend || loading}
                    className="text-sm"
                  >
                    {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setStep('authid');
                    setOtp('');
                  }}
                  disabled={loading}
                  className="w-full"
                >
                  ← Back to Auth ID
                </Button>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-gray-600">
            Not an authority?{' '}
            <Link to="/select-account" className="font-medium text-blue-600 hover:text-blue-800">
              Switch to Citizen Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
