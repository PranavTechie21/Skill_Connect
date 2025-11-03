import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface FormData {
  title: string;
  content: string;
  tags: string;
}

interface ShareStoryFormProps {
  className?: string;
}

export function ShareStoryForm({ className }: ShareStoryFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    tags: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
          status: 'pending'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit story');
      }

      toast({
        title: "Story submitted successfully!",
        description: "Your story has been sent for review. We'll notify you once it's approved.",
      });

      // Reset form
      setFormData({
        title: '',
        content: '',
        tags: ''
      });

      // Redirect to stories page
      navigate('/stories');

    } catch (error) {
      console.error('Failed to submit story:', error);
      toast({
        title: "Failed to submit story",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                   focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 
                   dark:bg-gray-700 dark:text-white"
          placeholder="Give your story a title"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Story
        </label>
        <textarea
          id="content"
          name="content"
          required
          value={formData.content}
          onChange={handleChange}
          rows={6}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                   focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 
                   dark:bg-gray-700 dark:text-white"
          placeholder="Share your success story..."
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags (Optional)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                   focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 
                   dark:bg-gray-700 dark:text-white"
          placeholder="Add tags separated by commas (e.g. career, success, tips)"
        />
        <p className="mt-1 text-sm text-gray-500">
          Separate tags with commas (e.g. career, success, tips)
        </p>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex justify-center rounded-md border border-gray-300 
                   px-4 py-2 text-sm font-medium text-gray-700 shadow-sm 
                   hover:bg-gray-50 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2
                   dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent 
                   bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 
                   disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Story'
          )}
        </button>
      </div>
    </form>
  );
}