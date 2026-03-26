import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Globe,
  MapPin,
  Target,
  Briefcase,
  ArrowLeftRight,
  GraduationCap,
  Wifi,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
} from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
  { code: "mr", label: "मराठी", flag: "🇮🇳" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", label: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "bn", label: "বাংলা", flag: "🇮🇳" },
  { code: "gu", label: "ગુજરાતી", flag: "🇮🇳" },
];

const GOALS = [
  {
    id: "first-job",
    label: "Land My First Job",
    description: "I'm a fresher looking for my first opportunity",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "switch-career",
    label: "Switch Career",
    description: "I want to transition to a different field",
    icon: ArrowLeftRight,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "internship",
    label: "Find Internship",
    description: "I'm looking for internship opportunities",
    icon: GraduationCap,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "remote",
    label: "Remote Work",
    description: "I prefer working remotely from anywhere",
    icon: Wifi,
    color: "from-orange-500 to-amber-500",
  },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry",
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState("en");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [goal, setGoal] = useState("");
  const [saving, setSaving] = useState(false);

  const totalSteps = 3;

  const handleFinish = async () => {
    setSaving(true);
    try {
      await updateUser({
        location: city && state ? `${city}, ${state}` : state || city || undefined,
      });
      
      toast({
        title: "Welcome aboard! 🎉",
        description: "Your profile is all set. Let's get started!",
        variant: "success",
      });

      // Redirect to dashboard
      const userType = (user as any)?.userType?.toLowerCase();
      if (userType === "employer") {
        navigate("/employer/dashboard", { replace: true });
      } else {
        navigate("/employee/dashboard", { replace: true });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save preferences. You can update them later.",
        variant: "destructive",
      });
      navigate("/", { replace: true });
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    const userType = (user as any)?.userType?.toLowerCase();
    if (userType === "employer") {
      navigate("/employer/dashboard", { replace: true });
    } else {
      navigate("/employee/dashboard", { replace: true });
    }
  };

  const canProceed = () => {
    if (step === 0) return !!language;
    if (step === 1) return !!state;
    if (step === 2) return !!goal;
    return true;
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const goNext = () => {
    if (step < totalSteps - 1) {
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Let's personalize your experience</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to SkillConnect
            {user?.firstName ? `, ${user.firstName}` : ""}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Just a few quick questions to tailor your experience.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex items-center flex-1">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    i < step
                      ? "bg-primary text-primary-foreground"
                      : i === step
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className="flex-1 mx-2">
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: i < step ? "100%" : "0%" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Language</span>
            <span>Location</span>
            <span>Goal</span>
          </div>
        </div>

        {/* Step Content */}
        <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl">
          <div className="p-8 min-h-[350px] flex flex-col">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 0 && (
                <motion.div
                  key="step-0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Choose your language</h2>
                      <p className="text-sm text-muted-foreground">
                        Select your preferred language for the platform
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                          language === lang.code
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border/50 hover:border-primary/30 bg-card"
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.label}</span>
                        {language === lang.code && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Where are you located?</h2>
                      <p className="text-sm text-muted-foreground">
                        This helps us show you relevant job opportunities
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">State</Label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      >
                        <option value="">Select your state</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="mb-2 block">City (Optional)</Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai, Pune, Bangalore"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">What's your goal?</h2>
                      <p className="text-sm text-muted-foreground">
                        Help us understand what you're looking for
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {GOALS.map((g) => {
                      const Icon = g.icon;
                      return (
                        <button
                          key={g.id}
                          onClick={() => setGoal(g.id)}
                          className={`flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] ${
                            goal === g.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-border/50 hover:border-primary/30 bg-card"
                          }`}
                        >
                          <div
                            className={`h-11 w-11 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center text-white flex-shrink-0`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground">
                              {g.label}
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {g.description}
                            </p>
                          </div>
                          {goal === g.id && (
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
              <div>
                {step > 0 ? (
                  <Button variant="ghost" onClick={goBack} className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-muted-foreground"
                  >
                    Skip for now
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {step < totalSteps - 1 ? (
                  <Button
                    onClick={goNext}
                    disabled={!canProceed()}
                    className="gap-2"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleFinish}
                    disabled={!canProceed() || saving}
                    className="gap-2 px-8"
                  >
                    {saving ? "Saving..." : "Get Started"}
                    {!saving && <Sparkles className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Skip link */}
        <div className="text-center mt-6">
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            I'll set this up later →
          </button>
        </div>
      </div>
    </div>
  );
}
