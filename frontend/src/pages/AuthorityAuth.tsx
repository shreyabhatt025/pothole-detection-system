import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, Building2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


   // APPROVED AUTHORITY EMAIL DOMAINS
const ALLOWED_AUTHORITY_DOMAINS = [
  "banasthali.in",
  "gov.in",
  "pwd.gov.in",
  "transport.gov.in",
  "roads.gov.in",
  "nagarnigam.in",
  "municipal.in",
];


   //EMAIL DOMAIN VALIDATION
   
const isValidAuthorityEmail = (email: string): boolean => {
  if (!email.includes("@")) return false;

  const parts = email.toLowerCase().split("@");
  if (parts.length !== 2) return false;

  const domain = parts[1];

  for (let i = 0; i < ALLOWED_AUTHORITY_DOMAINS.length; i++) {
    if (domain === ALLOWED_AUTHORITY_DOMAINS[i]) {
      return true;
    }
  }
  return false;
};

  // CAPTCHA GENERATOR
   
const generateCaptcha = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)];
  }
  return captcha;
};


   //4-DIGIT OTP GENERATOR
   
const generateOtp = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const AuthorityAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  
     //SIGNUP STATE
     
  const [signupData, setSignupData] = useState({
    authorityEmail: "",
    name: "",
    designation: "",
    department: "",
    password: "",
  });

  //  LOGIN STATE 
  const [loginData, setLoginData] = useState({
    email: "",
    otp: "",
    captcha: "",
  });

  const [isOtpSent, setIsOtpSent] = useState(false);


    // CAPTCHA STATE
     
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaTimer, setCaptchaTimer] = useState(60);

    // OTP STATE
    
  const [generatedOtp, setGeneratedOtp] = useState("");

  
     // CAPTCHA AUTO REFRESH (60s)
     
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setCaptcha(generateCaptcha());
      setCaptchaTimer(60);
    }, 60000);

    const countdown = setInterval(() => {
      setCaptchaTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(countdown);
    };
  }, []);

  
     //SEND OTP 
  const handleSendOtp = () => {
    if (!loginData.email) {
      toast({
        title: "Enter Email",
        description: "Please enter your official authority email.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidAuthorityEmail(loginData.email)) {
      toast({
        title: "Invalid Authority Email",
        description: "Only official authority emails are allowed.",
        variant: "destructive",
      });
      return;
    }

    const otp = generateOtp();
    setGeneratedOtp(otp);
    setIsOtpSent(true);

    setCaptcha(generateCaptcha());
    setCaptchaTimer(60);

    // (Simulation only — backend should send OTP)
    console.log("Generated OTP:", otp);

    toast({
      title: "OTP Sent",
      description: "A 4-digit OTP has been sent to your email.",
    });
  };

  // LOGIN SUBMIT
    
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (loginData.captcha !== captcha) {
      toast({
        title: "Invalid CAPTCHA",
        description: "CAPTCHA does not match.",
        variant: "destructive",
      });
      setCaptcha(generateCaptcha());
      setCaptchaTimer(60);
      return;
    }

    if (loginData.otp !== generatedOtp) {
      toast({
        title: "Invalid OTP",
        description: "Incorrect 4-digit OTP.",
        variant: "destructive",
      });
      setCaptcha(generateCaptcha());
      setCaptchaTimer(60);
      return;
    }

    toast({
      title: "Login Successful",
      description: "Redirecting to dashboard...",
    });

    setTimeout(() => navigate("/authority/dashboard"), 1000);
  };

     //SIGNUP SUBMIT
    
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidAuthorityEmail(signupData.authorityEmail)) {
      toast({
        title: "Invalid Authority Email",
        description: "Use your official authority email only.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Registration Submitted",
      description: "Your account is pending verification.",
    });

    setTimeout(() => navigate("/authority/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen gradient-hero">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            <span className="text-xl font-bold">PDS</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Link to="/select-account" className="flex gap-2 mb-6 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <Card>
            <CardHeader className="text-center">
              <Building2 className="mx-auto w-8 h-8 mb-2" />
              <CardTitle>Authority Portal</CardTitle>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* LOGIN */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <Label>Authority Email ID</Label>
                    <Input
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                    />

                    {!isOtpSent ? (
                      <Button type="button" onClick={handleSendOtp} className="w-full">
                        Send OTP
                      </Button>
                    ) : (
                      <>
                        <Input
                          placeholder="Enter 4-digit OTP"
                          maxLength={4}
                          value={loginData.otp}
                          onChange={(e) =>
                            setLoginData({ ...loginData, otp: e.target.value })
                          }
                        />

                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted p-3 text-center font-mono tracking-widest">
                            {captcha}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setCaptcha(generateCaptcha());
                              setCaptchaTimer(60);
                            }}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          CAPTCHA expires in {captchaTimer}s
                        </p>

                        <Input
                          placeholder="Enter CAPTCHA"
                          value={loginData.captcha}
                          onChange={(e) =>
                            setLoginData({ ...loginData, captcha: e.target.value })
                          }
                        />

                        <Button type="submit" className="w-full">
                          Verify & Login
                        </Button>
                      </>
                    )}
                  </form>
                </TabsContent>

                {/* SIGNUP */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <Input
                      placeholder="Authority Email ID"
                      value={signupData.authorityEmail}
                      onChange={(e) =>
                        setSignupData({ ...signupData, authorityEmail: e.target.value })
                      }
                    />
                    <Input placeholder="Full Name" />
                    <Input placeholder="Designation" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pwd">PWD</SelectItem>
                        <SelectItem value="municipal">Municipal</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="password" placeholder="Create Password" />
                    <Button type="submit" className="w-full">
                      Submit Registration
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AuthorityAuth;
