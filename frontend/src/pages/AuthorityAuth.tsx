
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AuthorityAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Signup data
  const [signupData, setSignupData] = useState({
    authorityId: "",
    name: "",
    designation: "",
    department: "",
    email: "",
    password: "",
  });

  // Login data
  const [loginData, setLoginData] = useState({
    email: "",
    otp: "",
    captcha: "",
  });

  // OTP sent state
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Send OTP
  const handleSendOtp = () => {
    if (!loginData.email) {
      toast({
        title: "Enter Email",
        description: "Please enter your official email to receive OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsOtpSent(true);
    toast({
      title: "OTP Sent",
      description: `A verification code has been sent to ${loginData.email}.`,
    });
  };

  // Login submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOtpSent) {
      toast({
        title: "Send OTP First",
        description: "Click on 'Send OTP' to proceed.",
        variant: "destructive",
      });
      return;
    }

    // CAPTCHA validation
    if (loginData.captcha !== "X7K9M2") {
      toast({
        title: "Invalid CAPTCHA",
        description: "Please enter the correct CAPTCHA code.",
        variant: "destructive",
      });
      return;
    }

    // OTP validation (simulated)
    if (loginData.otp !== "123456") {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP sent to your email.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Login Successful",
      description: "Welcome back! Redirecting to dashboard...",
    });
    setTimeout(() => navigate("/authority/dashboard"), 1000);
  };

  // Signup submit
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Registration Submitted",
      description: "Your registration is pending verification. You will receive an email confirmation.",
    });
    setTimeout(() => navigate("/authority/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PDS</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <Link to="/select-account" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Account Selection</span>
          </Link>

          <Card className="animate-fade-in">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Authority Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Authority Email ID</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your official email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      />
                    </div>

                    {!isOtpSent ? (
                      <Button type="button" onClick={handleSendOtp} className="w-full">
                        Send OTP
                      </Button>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="login-otp">Enter OTP</Label>
                          <Input
                            id="login-otp"
                            type="text"
                            placeholder="Enter OTP"
                            value={loginData.otp}
                            onChange={(e) => setLoginData({ ...loginData, otp: e.target.value })}
                          />
                        </div>

                        {/* CAPTCHA */}
                        <div className="space-y-2">
                          <Label htmlFor="captcha">CAPTCHA Verification</Label>
                          <div className="flex gap-2">
                            <div className="flex-1 bg-muted rounded-md p-3 text-center font-mono text-lg tracking-widest select-none">
                              X7K9M2
                            </div>
                            <Input
                              id="captcha"
                              type="text"
                              placeholder="Enter code"
                              className="w-28"
                              value={loginData.captcha}
                              onChange={(e) => setLoginData({ ...loginData, captcha: e.target.value })}
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full">Verify & Login</Button>
                      </>
                    )}
                  </form>
                </TabsContent>

                {/* Sign Up Tab (unchanged) */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="authority-id">Authority Email ID</Label>
                      <Input
                        id="authority-id"
                        type="text"
                        placeholder="Enter your Authority ID"
                        value={signupData.authorityId}
                        onChange={(e) => setSignupData({ ...signupData, authorityId: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="authority-name">Full Name</Label>
                      <Input
                        id="authority-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        type="text"
                        placeholder="e.g., Junior Engineer"
                        value={signupData.designation}
                        onChange={(e) => setSignupData({ ...signupData, designation: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select onValueChange={(value) => setSignupData({ ...signupData, department: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pwd">Public Works Department</SelectItem>
                          <SelectItem value="municipal">Municipal Corporation</SelectItem>
                          <SelectItem value="highway">Highway Authority</SelectItem>
                          <SelectItem value="transport">Transport Department</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="authority-password">Create Password</Label>
                      <Input
                        id="authority-password"
                        type="password"
                        placeholder="Create a strong password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full">Submit Registration</Button>
                  </form>
                </TabsContent>
              </Tabs>

              <p className="text-xs text-muted-foreground text-center mt-6">
                Authority accounts require verification. Ensure you use your official credentials.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AuthorityAuth;
