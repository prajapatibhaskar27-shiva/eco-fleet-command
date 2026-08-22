import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, UserX, Leaf } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface AuthProps { redirectAfterAuth?: string; }

function resolveRedirectAfterAuth(returnTo: string | null, fallback = "/dashboard") {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) return returnTo;
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(searchParams.get("returnTo"), redirectAfterAuth);
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (!authLoading && isAuthenticated) navigate(redirect); }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setIsLoading(true); setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send verification code. Please try again.");
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setIsLoading(true); setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect);
    } catch (error) {
      setError("The verification code you entered is incorrect.");
      setIsLoading(false); setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true); setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (error) {
      setError(`Failed to sign in as guest: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-100/20 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="flex items-center justify-center h-full flex-col">
          <Card className="min-w-[380px] pb-0 border border-gray-200 bg-white shadow-xl shadow-gray-100/50 rounded-2xl">
            {step === "signIn" ? (
              <>
                <CardHeader className="text-center">
                  <div className="flex justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-4 shadow-md shadow-emerald-200 cursor-pointer" onClick={() => navigate("/")}>
                      <Leaf className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-[18px] text-gray-900">Get Started</CardTitle>
                  <CardDescription className="text-gray-500">Enter your email to log in or sign up</CardDescription>
                </CardHeader>
                <form onSubmit={handleEmailSubmit}>
                  <CardContent>
                    <div className="relative flex items-center gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input name="email" placeholder="name@example.com" type="email" className="pl-9 border-gray-200 bg-gray-50 focus:border-emerald-400 focus:ring-emerald-500/20 rounded-xl" disabled={isLoading} required />
                      </div>
                      <Button type="submit" variant="outline" size="icon" className="border-gray-200 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 rounded-xl" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                      </Button>
                    </div>
                    {error && <p className="mt-2 text-[12px] text-red-500">{error}</p>}
                    <div className="mt-4">
                      <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200" /></div><div className="relative flex justify-center text-[11px] uppercase"><span className="bg-white px-2 text-gray-400">Or</span></div></div>
                      <Button type="button" variant="outline" className="w-full mt-4 border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-xl" onClick={handleGuestLogin} disabled={isLoading}>
                        <UserX className="mr-2 h-4 w-4" />Continue as Guest
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </>
            ) : (
              <>
                <CardHeader className="text-center mt-4">
                  <CardTitle className="text-gray-900">Check your email</CardTitle>
                  <CardDescription className="text-gray-500">We've sent a code to {step.email}</CardDescription>
                </CardHeader>
                <form onSubmit={handleOtpSubmit}>
                  <CardContent className="pb-4">
                    <input type="hidden" name="email" value={step.email} />
                    <input type="hidden" name="code" value={otp} />
                    <div className="flex justify-center">
                      <InputOTP value={otp} onChange={setOtp} maxLength={6} disabled={isLoading} onKeyDown={(e) => { if (e.key === "Enter" && otp.length === 6 && !isLoading) { const form = (e.target as HTMLElement).closest("form"); if (form) form.requestSubmit(); } }}>
                        <InputOTPGroup>{Array.from({ length: 6 }).map((_, index) => <InputOTPSlot key={index} index={index} />)}</InputOTPGroup>
                      </InputOTP>
                    </div>
                    {error && <p className="mt-2 text-[12px] text-red-500 text-center">{error}</p>}
                    <p className="text-[12px] text-gray-500 text-center mt-4">Didn't receive a code? <Button variant="link" className="p-0 h-auto text-emerald-600" onClick={() => setStep("signIn")}>Try again</Button></p>
                  </CardContent>
                  <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm shadow-emerald-200" disabled={isLoading || otp.length !== 6}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : <>Verify code<ArrowRight className="ml-2 h-4 w-4" /></>}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setStep("signIn")} disabled={isLoading} className="w-full text-gray-500 hover:text-gray-700">Use different email</Button>
                  </CardFooter>
                </form>
              </>
            )}
            <div className="py-4 px-6 text-[11px] text-center text-gray-400 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
              Secured by <a href="https://freebuff.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-600 transition-colors">freebuff.com</a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return <Suspense><Auth {...props} /></Suspense>;
}
