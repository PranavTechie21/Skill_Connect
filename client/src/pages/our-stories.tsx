import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

interface Story {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author?: {
    firstName: string;
    lastName: string;
  };
  // Support for stories submitted by non-users
  submitterName?: string;
  submitterEmail?: string;
  tags?: string[];
}

interface PaginatedResponse {
  stories: Story[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// The original three success stories to ensure they are always available for display.
// In a production environment, these would be added to the backend database.
const fallbackStories: Story[] = [
  {
    id: "fallback-1",
    title: "From Unemployed to Full-Stack Developer",
    content: "I was struggling to find a job for months. SkillConnect helped me find a company that valued my skills and now I am a full-stack developer.",
    submitterName: "Ravi Kumar",
    createdAt: "2023-10-26T10:00:00Z", // Fictional date to help with sorting
  },
  {
    id: "fallback-2",
    title: "My First Freelance Gig",
    content: "I was new to freelancing and didn't know where to start. SkillConnect helped me find my first client and now I have a steady stream of work.",
    submitterName: "Aarti Verma",
    createdAt: "2023-10-25T11:00:00Z",
  },
  {
    id: "fallback-3",
    title: "Landed My Dream Job",
    content: "I always wanted to work for a big tech company. SkillConnect helped me get an interview with my dream company and I got the job!",
    submitterName: "Neha Singh",
    createdAt: "2023-10-24T12:00:00Z",
  },
];

const StoryCard = ({ story, index }: { story: Story, index: number }) => {
  // Determine the author's name from different possible data structures
  const authorName = story.author 
    ? `${story.author.firstName} ${story.author.lastName}` 
    : story.submitterName || "Anonymous";

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 + index * 0.2 }}
        className="h-full group"
    >
        <div className="relative h-full flex flex-col rounded-2xl border border-border/60 bg-background/70 dark:bg-zinc-900/55 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-violet-400/45 dark:hover:border-violet-400/40 flex-1">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.08] via-transparent to-cyan-500/[0.06] dark:from-violet-400/[0.10] dark:to-cyan-400/[0.06]" />
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/10" />
              <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/10" />
            </div>
            
            <div className="p-6 pb-4 relative z-10">
                <h3 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-violet-700 via-indigo-700 to-violet-700 dark:from-violet-300 dark:via-indigo-300 dark:to-violet-300 bg-clip-text text-transparent">
                  {story.title}
                </h3>
                {Array.isArray(story.tags) && story.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {story.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-xs text-foreground/80 dark:bg-zinc-950/35 dark:text-zinc-200/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
            </div>
            
            <div className="flex flex-col flex-grow justify-between p-6 pt-0 relative z-10">
                <p className="text-foreground/75 dark:text-zinc-300/75 mb-6 line-clamp-4 leading-relaxed">
                    "{story.content}"
                </p>
                
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-200 dark:border-zinc-800">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-semibold text-xs shadow-md ring-1 ring-white/30 dark:ring-white/10">
                        {authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground dark:text-zinc-100">
                          {authorName}
                      </p>
                      <p className="text-xs text-foreground/60 dark:text-zinc-400">SkillConnect</p>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
  );
};

export default function OurStories() {
  const navigate = useNavigate();
  const { toast } = useToast();
    const { t } = useLanguage();
    const topRef = useRef<HTMLDivElement | null>(null);
  
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const storiesPerPage = 12;

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await apiFetch(`/api/stories?page=${currentPage}&limit=${storiesPerPage}`);
        if (!response.ok) throw new Error("Failed to fetch stories");
        
        const data: PaginatedResponse = await response.json();
        
        // If it's the first page, include fallback stories
        let allStories = data.stories;
        if (currentPage === 1) {
          allStories = [...allStories, ...fallbackStories];
        }

        // Sort stories by date
        allStories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setStories(allStories);
        setTotalPages(data.meta.totalPages);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load success stories.",
          variant: "destructive",
        });
        // On error, show fallback stories
        setStories(fallbackStories);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [currentPage, toast]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  };

  useEffect(() => {
    // Run after page changes too (covers keyboard / programmatic pagination).
    scrollToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleShareClick = () => navigate("/submit-story");



  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div ref={topRef} className="scroll-mt-24" />
      {/* Ambient luxury background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute -bottom-40 right-[-6rem] h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/40 dark:to-zinc-950/40" />
      </div>

      <div className="container mx-auto px-4 pt-4 pb-12 relative">
        {/* Premium Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-center mb-20 relative pt-0"
        >
          {/* Layered ambient depth */}
          <div className="absolute inset-0 -top-24 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] max-w-4xl bg-violet-500/5 dark:bg-violet-500/10 blur-[130px] rounded-full opacity-60" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/5 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
          </div>
          
          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-8">
            {/* Ultra-luxe Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-violet-200/50 dark:border-violet-500/20 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-xl shadow-sm group hover:border-violet-400/40 transition-colors"
            >
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
                SC
              </div>
              <span className="text-[11px] md:text-xs font-bold tracking-[0.14em] uppercase text-violet-800 dark:text-violet-300">
                {t("stories.heroLine")}
              </span>
            </motion.div>

            {/* Cinematic Title */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.035em] leading-[1.05] md:leading-[1.1]">
                <span className="block text-slate-900 dark:text-white mb-2">Our Community</span>
                <span className="block bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-700 dark:from-violet-400 dark:via-fuchsia-300 dark:to-indigo-400 bg-clip-text text-transparent">
                   Success Stories
                </span>
              </h1>
              
              <div className="h-1.5 w-24 bg-gradient-to-r from-violet-500 to-transparent mx-auto rounded-full mt-8 opacity-40" />
            </div>

            {/* Refined Subtitle */}
            <motion.p
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="text-lg md:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Authentic journeys of growth and achievement. Discover how individuals are transforming their careers through the power of SkillConnect's matching ecosystem.
            </motion.p>
          </div>
        </motion.section>

        {/* Stories Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {loading ? (
            Array.from({ length: storiesPerPage }).map((_, index) => (
              <Card key={index} className="h-full overflow-hidden border-border/60 bg-background/70 dark:bg-zinc-900/55 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : stories.map((story, index) => (
              <StoryCard key={story.id} story={story} index={index} />
            ))}
        </section>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <section className="flex justify-center items-center gap-2 mb-20">
            <Button
              variant="outline"
              onClick={() => { scrollToTop(); setCurrentPage(p => Math.max(1, p - 1)); }}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1 mx-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => { scrollToTop(); setCurrentPage(page); }}
                  className="w-10 h-10 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => { scrollToTop(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </section>
        )}

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <div className="relative rounded-3xl overflow-hidden border border-border/60 bg-background/65 dark:bg-zinc-900/55 backdrop-blur-xl p-1">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/25 via-indigo-500/15 to-cyan-500/20 dark:from-violet-500/20 dark:via-indigo-500/10 dark:to-cyan-500/15" />
              <div className="absolute -top-24 right-[-6rem] h-64 w-64 rounded-full bg-violet-500/25 blur-3xl dark:bg-violet-500/20" />
              <div className="absolute -bottom-24 left-[-6rem] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl dark:bg-cyan-500/15" />
            </div>

            <div className="relative rounded-[1.4rem] bg-background/75 dark:bg-zinc-950/35">
              <div className="flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 gap-8 relative z-10">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-2xl bg-background/60 dark:bg-zinc-950/35 flex items-center justify-center flex-shrink-0 hidden sm:flex border border-border/60 shadow-sm">
                    <MessageSquareQuote className="h-8 w-8 text-violet-700 dark:text-violet-300" />
                  </div>
                  <div className="max-w-2xl">
                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-2">
                      Share Your Success Story
                    </h2>
                    <p className="text-base sm:text-lg text-foreground/70 dark:text-zinc-300/70">
                      Has our platform helped you find success? We'd love to hear your story.
                    </p>
                  </div>
                </div>
                <div className="pt-2 md:pt-0 flex-shrink-0">
                  <Button
                    size="lg"
                    onClick={handleShareClick}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-lg hover:shadow-xl font-semibold rounded-xl px-8 py-6 h-auto text-base transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Submit Your Story
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
