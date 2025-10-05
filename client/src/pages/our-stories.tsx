import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const stories = [
  {
    id: 1,
    title: "From Unemployed to Full-Stack Developer",
    content: "I was struggling to find a job for months. SkillConnect helped me find a company that valued my skills and now I am a full-stack developer.",
    name: "Ravi Kumar"
  },
  {
    id: 2,
    title: "My First Freelance Gig",
    content: "I was new to freelancing and didn't know where to start. SkillConnect helped me find my first client and now I have a steady stream of work.",
    name: "Aarti Verma"
  },
  {
    id: 3,
    title: "Landed My Dream Job",
    content: "I always wanted to work for a big tech company. SkillConnect helped me get an interview with my dream company and I got the job!",
    name: "Neha Singh"
  }
];

export default function OurStories() {
  const navigate = useNavigate();

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-4">
            Our Success Stories
          </h1>
          <p className="light:texttext-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Real experiences from people who found success through SkillConnect.
          </p>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {stories.map((story) => (
            <Card
              key={story.id}
              className="text-gray-900 dark:text-gray-100 hover:shadow-lg hover:shadow-purple-500/20 transition-shadow rounded-2xl"
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {story.title}
                </h3>
                <p className="text-gray-900 mb-4">
                  {story.content}
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  - {story.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="text-center"
        >
          <h2 className="text-3xl text-pink-600 dark:text-pink-400 font-bold mb-6">
            Share Your Success
          </h2>
          <p className="text-xl text-gray-800 dark:text-gray-300 mb-8">
            Has SkillConnect helped you find success? We'd love to hear your
            story!
          </p>

          <Button
            size="lg"
            onClick={() => navigate("/submit-story")}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/30"
          >
            Submit Your Story
          </Button>
        </motion.section>
      </div>
    </div>
  );
}
