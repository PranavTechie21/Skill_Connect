import { motion } from "framer-motion";
import { MapPin, Clock, IndianRupee, Heart, Code, Megaphone, Users, Building, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    jobType?: string;
    salaryMin?: number;
    salaryMax?: number;
    skills: string[];
    company?: {
      name: string;
    };
    employer?: {
      firstName: string;
      lastName: string;
    };
    createdAt?: string;
  };
  setSelectedJob?: (job: any) => void;
  setShowQuickApply?: (show: boolean) => void;
  onCardClick?: () => void;
}

export default function JobCard({ job, setSelectedJob, setShowQuickApply, onCardClick }: JobCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getJobIcon = () => {
    const iconCls = "w-5 h-5 text-indigo-400";
    if (job.skills.some(s => /react|javascript|typescript|node|web|frontend|backend|code|dev|engineer/i.test(s))) {
      return <Code className={iconCls} />;
    }
    if (job.skills.some(s => /marketing|social|ad|seo|growth|sale/i.test(s))) {
      return <Megaphone className={iconCls} />;
    }
    return <Users className={iconCls} />;
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && max) return `₹${(min / 1000).toFixed(0)}k - ₹${(max / 1000).toFixed(0)}k`;
    if (min) return `₹${(min / 1000).toFixed(0)}k+`;
    return `Up to ₹${(max! / 1000).toFixed(0)}k`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative h-full"
      onClick={onCardClick}
    >
      <div className="relative h-full bg-background/70 dark:bg-zinc-900/55 backdrop-blur-xl border border-border/60 rounded-[22px] p-6 cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-400/45 dark:hover:border-indigo-500/40 shadow-sm">
        
        {/* Ambient background highlight */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/20 transition-colors" />

        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex-1 space-y-4">
            
            {/* Header: Icon + Title + Company */}
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="absolute -inset-2 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden group-hover:scale-110 transition-transform">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {getJobIcon()}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-indigo-400 transition-colors leading-tight">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-sm">
                  {job.company ? (
                    <>
                      <Building className="h-3.5 w-3.5 text-indigo-400/80" />
                      <span>{job.company.name}</span>
                    </>
                  ) : (
                    <>
                      <Users className="h-3.5 w-3.5 text-indigo-400/80" />
                      <span>{job.employer ? `${job.employer.firstName} ${job.employer.lastName}` : "Direct Post"}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Meta tags: Location, Type, Salary */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold text-slate-500/80 dark:text-slate-400/80">
              <div className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
                <MapPin className="h-3.5 w-3.5" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
                <Clock className="h-3.5 w-3.5" />
                <span className="capitalize">{job.jobType?.replace('_', ' ') || 'Full-time'}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
                <IndianRupee className="h-3.5 w-3.5" />
                <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
              </div>
            </div>

            {/* Skills Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {job.skills.slice(0, 4).map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-slate-200/50 dark:bg-white/5 border border-slate-300/10 dark:border-white/5 rounded-full text-[12px] font-bold text-slate-600 dark:text-slate-300 backdrop-blur-sm hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="px-3 py-1 bg-indigo-500/10 dark:bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[11px] font-extrabold text-indigo-400 tracking-wider uppercase">
                  +{job.skills.length - 4} more
                </span>
              )}
            </div>

            {/* Preview Description */}
            <p className="text-[14px] leading-relaxed text-slate-500 dark:text-slate-400/90 line-clamp-2 max-w-[90%] font-medium">
              {job.description}
            </p>
          </div>

          {/* Action Area */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 w-full sm:w-auto self-stretch">
            <div className="flex flex-col items-end gap-1.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!user) {
                    navigate('/signup', { state: { message: 'Register yourself on the portal to apply for this job.' } });
                    return;
                  }
                  if (user.userType !== 'Professional') {
                    toast({ title: "Access denied", description: "Only job seekers can apply.", variant: "destructive" });
                    return;
                  }
                  setSelectedJob?.(job);
                  setShowQuickApply?.(true);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-[14px] font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
              >
                <span>Quick Apply</span>
                <Sparkles className="w-3.5 h-3.5 fill-white/20" />
              </motion.button>
              
              <div className="flex items-center gap-3 pr-1">
                <button 
                  className="p-2 hover:bg-indigo-500/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
                  onClick={(e) => { e.stopPropagation(); /* Handle save */ }}
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="sm:mt-auto flex flex-col items-end">
               <span className="text-[11px] font-black uppercase tracking-widest text-slate-400/60 dark:text-slate-500/50">
                {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : "Recent"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}