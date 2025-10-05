import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth"; // Add this import

export default function SubmitStory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: ""
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to share your story",
        variant: "destructive"
      });
      navigate("/login?redirect=/submit-story");
    }
  }, [user, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean)
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit story");
      }

      toast({
        title: "Success!",
        description: "Your story has been submitted successfully.",
      });

      navigate("/stories");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit story. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Prevent form render while redirecting
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Share Your Story</h1>
            <p className="text-muted-foreground">Share your success story with our community</p>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a title for your story"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Story</label>
                  <Textarea
                    required
                    value={formData.content}
                    onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your experience..."
                    rows={8}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <Input
                    value={formData.tags}
                    onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Add tags separated by commas (e.g. career, success, tips)"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Story"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/stories")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}