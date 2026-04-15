import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  User, Mail, Phone, MapPin, Edit2, Save, X,
  Briefcase, GraduationCap, FileText, Calendar,
  Linkedin, Github, Globe, Plus, Award, Star,
  Download, Upload, Camera, LucideIcon, Trash2, Sparkles
} from 'lucide-react';
import { useTheme } from "@/components/theme-provider";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/api';
import { type UpdateProfile } from '@shared/schema';

interface Education {
  id: number;
  degree: string;
  school: string;
  year: string;
  gpa: string;
}

interface FormattedExperience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

interface ProfileData {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    avatar: string | null;
  };
  professional: {
    title: string; // Changed from headline to title to match our usage
    department?: string;
    company?: string;
    startDate?: string;
    employeeId?: string;
    skills: string[];
    level?: string;
  };
  education: Education[];
  experience: FormattedExperience[];
}

interface SmartSuggestion {
  section: string;
  title: string;
  detail: string;
}

interface ProfileProps {
  embedded?: boolean;
}

const Profile = ({ embedded = false }: ProfileProps) => {
  const { theme } = useTheme();
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const darkMode = theme === 'dark';
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [imageHover, setImageHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [isPhotoPreviewOpen, setIsPhotoPreviewOpen] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  type IncompleteItem = { section: string; label: string };
  
  // Initialize profile with user data and professional profile data
  const [profile, setProfile] = useState<ProfileData>({
    personal: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.telephoneNumber || '',
      location: user?.location || '',
      bio: user?.profile?.bio || '',
      avatar: user?.profilePhoto || null
    },
    professional: {
      title: user?.profile?.headline || '',
      department: 'Engineering', // Default value as it's not in User or Profile types
      company: user?.company?.name || 'Not specified',
      startDate: '2020-03-01', // Default value as it's not in User type
      employeeId: 'TC-8472', // Default value as it's not in User type
      skills: user?.profile?.skills || ['React', 'TypeScript', 'Node.js'],
      level: 'L5 Senior' // Default value as it's not in User type
    },
    education: [
      {
        id: 1,
        degree: 'Master of Computer Science',
        school: 'Tech University',
        year: '2016',
        gpa: '3.8'
      },
      {
        id: 2,
        degree: 'Bachelor of Engineering',
        school: 'Engineering College',
        year: '2014',
        gpa: '3.9'
      }
    ],
    experience: [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        period: '2020 - Present',
        description: 'Leading frontend development team and architecting scalable solutions.',
        achievements: ['Improved performance by 40%', 'Led team of 8 developers', 'Mentored junior engineers']
      },
      {
        id: 2,
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        period: '2016 - 2020',
        description: 'Built responsive web applications using React and Redux.',
        achievements: ['Shipped 10+ major features', 'Reduced bundle size by 60%']
      }
    ]
  });

  // Update profile when user data changes
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        personal: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.telephoneNumber || '',
          location: user.location || '',
          // Do not overwrite local edits when /api/auth/me omits profile payload.
          bio: user.profile?.bio ?? prev.personal.bio,
          avatar: user.profilePhoto ?? prev.personal.avatar
        },
        professional: {
          title: user.profile?.headline ?? prev.professional.title,
          department: 'Engineering',
          company: user.company?.name || 'Not specified',
          startDate: '2020-03-01',
          employeeId: 'TC-8472',
          skills: user.profile?.skills?.length ? user.profile.skills : prev.professional.skills,
          level: 'L5 Senior'
        },
        education: prev.education,
        experience: prev.experience
      }));
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (section: keyof ProfileData, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Add new skill
  const addSkill = () => {
    if (newSkill.trim()) {
      setProfile(prev => ({
        ...prev,
        professional: {
          ...prev.professional,
          skills: [...prev.professional.skills, newSkill.trim()]
        }
      }));
      setNewSkill('');
    }
  };

  // Remove skill
  const removeSkill = (index: number) => {
    setProfile(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        skills: prev.professional.skills.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update professional profile
      const response = await apiFetch('/api/me/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          headline: profile.professional.title, // Send as headline for server compatibility
          bio: profile.personal.bio,
          skills: profile.professional.skills
        } as UpdateProfile)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const payload = await response.json();
      const savedProfile = payload?.profile;

      // Keep auth state in sync without depending on /api/auth/me shape.
      if (user && savedProfile) {
        setUser({
          ...user,
          profile: {
            ...(user.profile || {}),
            ...savedProfile,
          },
        });
      }

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file?: File) => {
    if (!file) return;
    const isValidType = ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type);
    if (!isValidType) {
      toast({
        title: "Invalid image",
        description: "Please upload JPG, PNG, or WEBP image.",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }
    setPhotoUploading(true);
    try {
      // Use the dedicated authenticated upload endpoint to avoid ID/session mismatches.
      const formData = new FormData();
      formData.append("photo", file);

      const response = await apiFetch("/api/me/profile-photo", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Upload failed";
        try {
          const parsed = errorText ? JSON.parse(errorText) : null;
          errorMessage = parsed?.message || errorMessage;
        } catch {
          if (errorText) errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }
      const payloadText = await response.text();
      let payload: any = null;
      try {
        payload = payloadText ? JSON.parse(payloadText) : null;
      } catch {
        throw new Error("Upload failed: invalid server response");
      }
      const updatedUser = payload?.user ?? null;
      const nextPhoto = payload?.profilePhoto || updatedUser?.profilePhoto || null;
      if (!nextPhoto) {
        throw new Error("Upload failed: image URL missing in response");
      }

      setProfile((prev) => ({
        ...prev,
        personal: { ...prev.personal, avatar: nextPhoto },
      }));

      if (updatedUser) setUser(updatedUser);

      toast({
        title: "Photo updated",
        description: "Your profile photo is now visible across the platform.",
        variant: "default",
      });
    } catch (error) {
      console.error("Photo upload failed:", error);
      const message = error instanceof Error ? error.message : "Could not upload profile photo. Please try again.";
      toast({
        title: "Upload failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setPhotoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    if (!profile.personal.avatar) return;
    setPhotoUploading(true);
    try {
      const response = await apiFetch("/api/me/profile-photo", {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to remove profile photo");
      }

      setProfile((prev) => ({
        ...prev,
        personal: { ...prev.personal, avatar: null },
      }));

      if (user) {
        setUser({ ...user, profilePhoto: null });
      }

      toast({
        title: "Photo removed",
        description: "Your profile photo has been removed successfully.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not remove profile photo.";
      toast({
        title: "Remove failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      setProfile({
        personal: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.telephoneNumber || '',
          location: user.location || '',
          bio: user.profile?.bio || '',
          avatar: user.profilePhoto || null
        },
        professional: {
          title: user.profile?.headline || '',
          skills: user.profile?.skills || ['React', 'TypeScript', 'Node.js']
        },
        education: profile.education, // Keep existing education data
        experience: profile.experience // Keep existing experience data
      });
    }
    setIsEditing(false);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User, count: 7 },
    { id: 'professional', label: 'Professional', icon: Briefcase, count: 8 },
    { id: 'education', label: 'Education', icon: GraduationCap, count: profile.education.length },
    { id: 'experience', label: 'Experience', icon: FileText, count: profile.experience.length }
  ];
  const tabOrder = tabs.map((tab) => tab.id);
  const activeTabIndex = tabOrder.indexOf(activeTab);
  const canGoPrev = activeTabIndex > 0;
  const canGoNext = activeTabIndex < tabOrder.length - 1;
  const nextTabLabel = canGoNext ? tabs[activeTabIndex + 1].label : "";
  const prevTabLabel = canGoPrev ? tabs[activeTabIndex - 1].label : "";

  const smartSuggestions = useMemo<SmartSuggestion[]>(() => {
    const suggestions: SmartSuggestion[] = [];
    const title = profile.professional.title?.trim() || "";
    const skills = profile.professional.skills || [];
    const location = profile.personal.location?.trim() || "";
    const bio = profile.personal.bio?.trim() || "";
    const firstName = profile.personal.firstName?.trim() || "you";

    const roleSkillSuggestions: Record<string, string[]> = {
      frontend: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      backend: ["Node.js", "Express", "PostgreSQL", "REST APIs"],
      full: ["React", "Node.js", "TypeScript", "System Design"],
      data: ["Python", "SQL", "Machine Learning", "Pandas"],
      devops: ["Docker", "Kubernetes", "CI/CD", "AWS"],
      ui: ["Figma", "UX Research", "Design Systems", "Accessibility"],
      default: ["Communication", "Problem Solving", "Team Collaboration", "Git"],
    };

    const roleKey = title.toLowerCase();
    const matchedRole =
      roleKey.includes("frontend") ? "frontend" :
      roleKey.includes("backend") ? "backend" :
      roleKey.includes("full") ? "full" :
      roleKey.includes("data") ? "data" :
      roleKey.includes("devops") ? "devops" :
      roleKey.includes("ui") || roleKey.includes("ux") ? "ui" :
      "default";

    if (!title || title === "No title provided") {
      suggestions.push({
        section: "professional",
        title: "Set a strong headline",
        detail: `Try: "${skills[0] ? `${skills[0]} Specialist` : "Professional"} | Open to impactful opportunities".`,
      });
    }

    if (skills.length < 5) {
      const recommended = roleSkillSuggestions[matchedRole]
        .filter((s) => !skills.some((x) => x.toLowerCase() === s.toLowerCase()))
        .slice(0, 3);
      suggestions.push({
        section: "professional",
        title: "Add high-value skills",
        detail: `For your profile, add: ${recommended.join(", ") || "domain-relevant technical + soft skills"}.`,
      });
    }

    if (!location) {
      suggestions.push({
        section: "personal",
        title: "Add your location",
        detail: "Location improves local + hybrid job matching and recruiter discovery.",
      });
    }

    if (bio.length < 80 || bio === "No bio provided.") {
      suggestions.push({
        section: "personal",
        title: "Improve your bio for better conversion",
        detail: `Write 2-3 lines: role, years of experience, top skills, and one measurable result (e.g., reduced load time by 35%).`,
      });
    }

    if (!profile.education.length) {
      suggestions.push({
        section: "education",
        title: "Add education details",
        detail: "Profiles with education history are trusted more by recruiters.",
      });
    }

    if (!profile.experience.length) {
      suggestions.push({
        section: "experience",
        title: "Add at least one experience entry",
        detail: "Even internships/freelance work can boost shortlist chances.",
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        section: "professional",
        title: `Great profile, ${firstName}!`,
        detail: "Next step: tailor skills for target roles and keep your profile updated weekly.",
      });
    }

    return suggestions.slice(0, 4);
  }, [profile]);

  const completionChecks: IncompleteItem[] = [];
  if (!profile.personal.firstName?.trim()) completionChecks.push({ section: 'personal', label: 'Add first name' });
  if (!profile.personal.lastName?.trim()) completionChecks.push({ section: 'personal', label: 'Add last name' });
  if (!profile.personal.email?.trim()) completionChecks.push({ section: 'personal', label: 'Add email address' });
  if (!profile.personal.phone?.trim()) completionChecks.push({ section: 'personal', label: 'Add phone number' });
  if (!profile.personal.location?.trim()) completionChecks.push({ section: 'personal', label: 'Add current location' });
  if (!profile.personal.bio || profile.personal.bio === 'No bio provided.' || profile.personal.bio.trim().length < 40) {
    completionChecks.push({ section: 'personal', label: 'Write a short bio (40+ chars)' });
  }
  if (!profile.professional.title || profile.professional.title === 'No title provided') {
    completionChecks.push({ section: 'professional', label: 'Add professional title' });
  }
  if (!profile.professional.skills?.length) completionChecks.push({ section: 'professional', label: 'Add at least one skill' });
  if (!profile.education?.length) completionChecks.push({ section: 'education', label: 'Add education details' });
  if (!profile.experience?.length) completionChecks.push({ section: 'experience', label: 'Add work experience' });

  const totalChecklistItems = 10;
  const completedItems = totalChecklistItems - completionChecks.length;
  const profileCompletion = Math.max(0, Math.min(100, Math.round((completedItems / totalChecklistItems) * 100)));
  const nextMissing = completionChecks[0];

  const jumpToIncomplete = () => {
    if (!nextMissing) return;
    setActiveTab(nextMissing.section);
    setIsEditing(true);
  };

  const StatsCard = ({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: string; color: string }) => (
    <div className={`p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('text-', '')}`} />
        </div>
        <div>
          <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${embedded ? 'min-h-full' : 'min-h-screen w-screen fixed inset-0'} transition-colors duration-300 overflow-y-auto ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-blue-600' : 'bg-blue-400'
        } animate-pulse`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-purple-600' : 'bg-purple-400'
        } animate-pulse delay-1000`} />
      </div>

      <div className={`max-w-7xl mx-auto relative z-10 ${embedded ? 'px-2 py-3' : 'px-6 py-8'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {!embedded && (
              <button
                onClick={() => window.history.back()}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white shadow-lg'
                    : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 shadow-lg'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <div>
              <h1 className={`text-4xl font-black mb-2 bg-gradient-to-r ${
                darkMode 
                  ? 'from-blue-400 to-purple-400' 
                  : 'from-indigo-600 to-purple-600'
              } bg-clip-text text-transparent`}>
                My Profile
              </h1>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage your personal and professional information
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
                  darkMode
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                }`}
              >
                <Edit2 className="w-5 h-5" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
                    darkMode
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Completion Banner */}
        <div className={`rounded-3xl p-5 mb-8 border shadow-xl ${
          darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/95 border-gray-100'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-blue-300' : 'text-indigo-600'}`}>
                Profile Completion
              </p>
              <h3 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {profileCompletion}% complete
              </h3>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {completionChecks.length === 0
                  ? 'Great work! Your profile is fully complete and recruiter-ready.'
                  : `${completionChecks.length} detail${completionChecks.length > 1 ? 's' : ''} left to complete.`}
              </p>
            </div>

            <div className="flex-1 max-w-xl">
              <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              {nextMissing && (
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Next step: <span className="font-semibold">{nextMissing.label}</span>
                </p>
              )}
            </div>

            {completionChecks.length > 0 && (
              <button
                onClick={jumpToIncomplete}
                className={`px-5 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                }`}
              >
                Complete Now
              </button>
            )}
          </div>
        </div>

        {/* AI Smart Coach */}
        <div className={`rounded-3xl p-5 mb-8 border shadow-xl ${
          darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/95 border-gray-100'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className={`w-5 h-5 ${darkMode ? 'text-purple-300' : 'text-indigo-600'}`} />
            <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Smart Coach
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
              darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-indigo-100 text-indigo-700'
            }`}>
              Personalized
            </span>
          </div>

          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Recommendations update automatically based on what you enter in your profile.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {smartSuggestions.map((tip, index) => (
              <button
                key={`${tip.title}-${index}`}
                onClick={() => {
                  setActiveTab(tip.section);
                  setIsEditing(true);
                }}
                className={`text-left rounded-2xl p-4 border transition-all duration-300 hover:scale-[1.01] ${
                  darkMode
                    ? 'bg-gray-900/40 border-gray-700 hover:border-blue-500'
                    : 'bg-indigo-50/50 border-indigo-100 hover:border-indigo-300'
                }`}
              >
                <p className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tip.title}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tip.detail}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            {/* Profile Card */}
            <div className={`rounded-3xl shadow-2xl overflow-hidden mb-6 transform transition-all duration-300 hover:shadow-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`h-32 relative ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700' 
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600'
              }`}>
                <div className="absolute inset-0 bg-black bg-opacity-20" />
              </div>
              
              <div className="px-6 pb-6 -mt-16 relative">
                <div 
                  className="relative group"
                  onMouseEnter={() => setImageHover(true)}
                  onMouseLeave={() => setImageHover(false)}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                  />
                  <div className={`w-32 h-32 rounded-3xl border-4 mx-auto mb-4 transition-all duration-300 ${
                    darkMode ? 'border-gray-800 bg-gray-700' : 'border-white bg-gray-200'
                  } ${imageHover ? 'scale-110' : ''} flex items-center justify-center overflow-hidden`}>
                    {profile.personal.avatar ? (
                      <button
                        type="button"
                        onClick={() => !isEditing && setIsPhotoPreviewOpen(true)}
                        className="w-full h-full"
                        aria-label="Open profile photo preview"
                      >
                        <img 
                          src={profile.personal.avatar} 
                          alt="Profile" 
                          className="w-full h-full rounded-3xl object-cover"
                        />
                      </button>
                    ) : (
                      <User className={`w-12 h-12 transition-all duration-300 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      } ${imageHover ? 'scale-110' : ''}`} />
                    )}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={photoUploading}
                        className={`absolute inset-0 bg-black bg-opacity-50 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                        imageHover ? 'opacity-100' : 'opacity-0'
                      } disabled:cursor-not-allowed`}
                      >
                        {photoUploading ? (
                          <span className="text-white text-sm font-semibold">Uploading...</span>
                        ) : (
                          <Camera className="w-8 h-8 text-white" />
                        )}
                      </button>
                    )}
                  </div>
                  {isEditing && profile.personal.avatar && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      disabled={photoUploading}
                      className={`mx-auto -mt-1 mb-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        darkMode
                          ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove Photo
                    </button>
                  )}
                </div>
                
                <div className="text-center mb-6">
                  <h2 className={`text-2xl font-black mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {profile.personal.firstName} {profile.personal.lastName}
                  </h2>
                  
                  <p className={`text-lg font-semibold mb-4 ${
                    darkMode ? 'text-blue-400' : 'text-indigo-600'
                  }`}>
                    {profile.professional.title || 'Add your professional title'}
                  </p>
                  
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <Star className={`w-4 h-4 ${
                      darkMode ? 'text-yellow-400' : 'text-yellow-500'
                    }`} />
                    <span className={`text-sm font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Premium Member
                    </span>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <StatsCard 
                    icon={Briefcase} 
                    label="Experience" 
                    value="8 yrs" 
                    color="text-blue-500"
                  />
                  <StatsCard 
                    icon={Award} 
                    label="Projects" 
                    value="24" 
                    color="text-purple-500"
                  />
                </div>

                {/* Completion Checklist */}
                <div className={`mb-6 p-4 rounded-2xl border ${
                  darkMode ? 'border-gray-700 bg-gray-900/40' : 'border-gray-100 bg-indigo-50/50'
                }`}>
                  <p className={`text-sm font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Quick Checklist
                  </p>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {(completionChecks.length ? completionChecks : [{ section: 'done', label: 'Profile complete - ready to apply faster' }]).map((item, idx) => (
                      <button
                        key={`${item.label}-${idx}`}
                        onClick={() => {
                          if (item.section === 'done') return;
                          setActiveTab(item.section);
                          setIsEditing(true);
                        }}
                        className={`w-full text-left flex items-center gap-2 text-xs px-2 py-2 rounded-lg transition-colors ${
                          darkMode ? 'hover:bg-gray-700/60 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                      >
                        <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full ${
                          item.section === 'done'
                            ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                            : (darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600')
                        }`}>
                          {item.section === 'done' ? '✓' : '!'}
                        </span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Social Links */}
                <div className="flex justify-center gap-3 mb-6">
                  {[
                    { icon: Linkedin, color: 'hover:bg-blue-500', label: 'LinkedIn' },
                    { icon: Github, color: 'hover:bg-gray-700', label: 'GitHub' },
                    { icon: Globe, color: 'hover:bg-green-500', label: 'Portfolio' }
                  ].map((social, index) => (
                    <button
                      key={index}
                      className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-400 hover:text-white' 
                          : 'bg-gray-100 text-gray-600 hover:text-white'
                      } ${social.color}`}
                      title={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}>
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}>
                    <Upload className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className={`rounded-3xl shadow-2xl p-8 transform transition-all duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className={`text-2xl font-black ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Personal Information
                    </h3>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Keep contact details accurate so recruiters can reach you quickly.
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    darkMode 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {isEditing ? 'Editing Mode' : 'View Mode'}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: 'First Name', field: 'firstName', value: profile.personal.firstName, icon: User },
                    { label: 'Last Name', field: 'lastName', value: profile.personal.lastName, icon: User },
                    { label: 'Email', field: 'email', value: profile.personal.email, icon: Mail, fullWidth: true },
                    { label: 'Phone', field: 'phone', value: profile.personal.phone, icon: Phone },
                    { label: 'Location', field: 'location', value: profile.personal.location, icon: MapPin }
                  ].map((field, index) => (
                    <div key={index} className={field.fullWidth ? 'col-span-2' : ''}>
                      <label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <field.icon className="w-4 h-4" />
                        {field.label}
                      </label>
                      {isEditing ? (
                        <input
                          type={field.field === 'birthday' ? 'date' : 'text'}
                          value={field.value}
                          onChange={(e) => handleInputChange('personal', field.field, e.target.value)}
                          className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:scale-105'
                              : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:scale-105'
                          }`}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      ) : (
                        <p className={`px-4 py-4 rounded-xl ${
                          darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                        }`}>
                          {field.value || 'Not provided'}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  <div className="col-span-2">
                    <label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <FileText className="w-4 h-4" />
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profile.personal.bio}
                        onChange={(e) => handleInputChange('personal', 'bio', e.target.value)}
                        rows={4}
                        className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:scale-105'
                            : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:scale-105'
                        }`}
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className={`px-4 py-4 rounded-xl leading-relaxed ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'
                      }`}>
                        {profile.personal.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Professional Tab */}
            {activeTab === 'professional' && (
              <div className={`rounded-3xl shadow-2xl p-8 transform transition-all duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="mb-8">
                  <h3 className={`text-2xl font-black ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Professional Information
                  </h3>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Add a clear title and skills so your profile appears in more relevant searches.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  {[
                    { label: 'Professional Title', field: 'title', value: profile.professional.title }
                  ].map((field, index) => (
                    <div key={index}>
                      <label className={`block text-sm font-semibold mb-3 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {field.label}
                      </label>
                      {isEditing ? (
                        <input
                          type={field.field === 'startDate' ? 'date' : 'text'}
                          value={field.value}
                          onChange={(e) => handleInputChange('professional', field.field, e.target.value)}
                          className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                            darkMode
                              ? 'bg-gray-800/40 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:bg-gray-800/60'
                              : 'bg-gray-50/70 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white'
                          }`}
                          placeholder={field.field === 'title' ? 'Enter your professional title' : ''}
                        />
                      ) : (
                        <p className={`px-4 py-4 rounded-xl ${
                          darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                        }`}>
                          {field.value || 'Not provided'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                
                <div>
                  <label className={`block text-sm font-semibold mb-4 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Skills & Technologies
                  </label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {profile.professional.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span
                          className={`px-4 py-3 rounded-xl font-semibold border transition-all duration-300 hover:scale-105 ${
                            darkMode
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'
                              : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-200 hover:from-indigo-100 hover:to-purple-100'
                          }`}
                        >
                          {skill}
                        </span>
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(index)}
                            className={`p-1 rounded-lg transition-all duration-300 hover:scale-110 ${
                              darkMode
                                ? 'text-red-400 hover:bg-red-500/20'
                                : 'text-red-600 hover:bg-red-100'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        placeholder="Add a new skill..."
                        className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                            : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500'
                        }`}
                      />
                      <button
                        onClick={addSkill}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                          darkMode
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className={`rounded-3xl shadow-2xl p-8 transform transition-all duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="mb-8">
                  <h3 className={`text-2xl font-black ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Education
                  </h3>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your strongest education details build trust with employers.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {profile.education.map((edu) => (
                    <div
                      key={edu.id}
                      className={`p-6 rounded-2xl border transition-all duration-300 ${
                        darkMode ? 'border-gray-700 hover:border-blue-500/70' : 'border-gray-100 hover:border-indigo-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className={`text-2xl p-3 rounded-xl ${
                            darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                          }`}>
                            🎓
                          </div>
                          <div>
                            <h4 className={`text-lg font-black mb-1 ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {edu.degree}
                            </h4>
                            <p className={`font-semibold mb-2 ${
                              darkMode ? 'text-blue-400' : 'text-indigo-600'
                            }`}>
                              {edu.school}
                            </p>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl font-semibold ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {edu.year}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          GPA: <strong>{edu.gpa}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className={`rounded-3xl shadow-2xl p-8 transform transition-all duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="mb-8">
                  <h3 className={`text-2xl font-black ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Work Experience
                  </h3>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Focus on impact and outcomes to increase interview chances.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {profile.experience.map((exp) => (
                    <div
                      key={exp.id}
                      className={`p-6 rounded-2xl border transition-all duration-300 ${
                        darkMode ? 'border-gray-700 hover:border-blue-500/70' : 'border-gray-100 hover:border-indigo-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className={`text-2xl p-3 rounded-xl ${
                            darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                          }`}>
                            💼
                          </div>
                          <div>
                            <h4 className={`text-lg font-black mb-1 ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {exp.title}
                            </h4>
                            <p className={`font-semibold mb-2 ${
                              darkMode ? 'text-purple-400' : 'text-purple-600'
                            }`}>
                              {exp.company}
                            </p>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl font-semibold ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {exp.period}
                        </div>
                      </div>
                      
                      <p className={`mb-4 leading-relaxed ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {exp.description}
                      </p>
                      
                      <div className="space-y-2">
                        {exp.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              darkMode ? 'bg-green-400' : 'bg-green-500'
                            }`} />
                            <span className={`text-sm ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {achievement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={`mt-5 rounded-2xl border px-4 py-3 flex items-center justify-between ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <button
                type="button"
                onClick={() => canGoPrev && setActiveTab(tabOrder[activeTabIndex - 1])}
                disabled={!canGoPrev}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  canGoPrev
                    ? (darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                    : (darkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-50 text-gray-400')
                }`}
              >
                {canGoPrev ? `Previous: ${prevTabLabel}` : "Previous"}
              </button>

              <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Step {activeTabIndex + 1} of {tabs.length}
              </p>

              <button
                type="button"
                onClick={() => canGoNext && setActiveTab(tabOrder[activeTabIndex + 1])}
                disabled={!canGoNext}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  canGoNext
                    ? (darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-indigo-600 text-white hover:bg-indigo-700')
                    : (darkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-50 text-gray-400')
                }`}
              >
                {canGoNext ? `Next: ${nextTabLabel}` : "Completed"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isPhotoPreviewOpen && profile.personal.avatar && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={() => setIsPhotoPreviewOpen(false)}
        >
          <div
            className="relative max-h-[85vh] max-w-[85vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsPhotoPreviewOpen(false)}
              className="absolute -right-3 -top-3 rounded-full bg-white/95 p-1.5 text-gray-800 shadow-lg"
              aria-label="Close image preview"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={profile.personal.avatar}
              alt="Profile preview"
              className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );  
};

export default Profile;