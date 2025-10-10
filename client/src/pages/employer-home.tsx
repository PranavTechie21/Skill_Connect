import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function EmployerHome() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiRequest("GET", "/api/auth/me");
        const user = (res && (res as any).user) ? (res as any).user : res;
        if (!mounted) return;
        if (!user) {
          toast({ title: "Not authenticated", description: "Please sign in.", variant: "destructive" });
          navigate("/login", { replace: true });
          return;
        }
        setProfile(user);
      } catch (err: any) {
        toast({ title: "Error", description: err?.message || "Unable to fetch profile", variant: "destructive" });
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [navigate, toast]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome, {profile?.firstName || profile?.name || 'Employer'}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">Post a Job</h3>
            <p className="text-sm text-muted-foreground">Create new job listings to attract professionals.</p>
            <div className="mt-4">
              <button className="btn btn-primary" onClick={() => navigate('/employers')}>Post Job</button>
            </div>
          </div>

          <div className="p-6 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">Manage Applicants</h3>
            <p className="text-sm text-muted-foreground">Review applications and contact candidates.</p>
            <div className="mt-4">
              <button className="btn btn-outline" onClick={() => navigate('/employer')}>Review Applicants</button>
            </div>
          </div>

          <div className="p-6 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">Company Profile</h3>
            <p className="text-sm text-muted-foreground">Edit your company page and branding.</p>
            <div className="mt-4">
              <button className="btn btn-ghost" onClick={() => navigate('/profile')}>Company Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
