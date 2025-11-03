import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface FormData {
  title: string;
  content: string;
  tags: string;
}

interface ShareStoryFormProps {
  className?: string;
}

export function ShareStory({ className }: ShareStoryFormProps) {
  const navigate = useNavigate();
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
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          status: 'pending'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit story');
      }

      alert('Thank you for sharing your story! It will be reviewed by our team.');
      setFormData({ title: '', content: '', tags: '' });
      navigate('/stories');

    } catch (error) {
      console.error('Failed to submit story:', error);
      alert('Failed to submit story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Share Your Success Story
      </h1>
      
      <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
        <div>
          <label 
            htmlFor="title" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 
                     text-sm focus:border-blue-500 focus:ring-blue-500 
                     dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Give your story a title"
          />
        </div>

        <div>
          <label 
            htmlFor="content" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Your Story
          </label>
          <textarea
            id="content"
            name="content"
            required
            value={formData.content}
            onChange={handleChange}
            rows={6}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 
                     text-sm focus:border-blue-500 focus:ring-blue-500 
                     dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Share your success story..."
          />
        </div>

        <div>
          <label 
            htmlFor="tags" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tags (Optional)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 
                     text-sm focus:border-blue-500 focus:ring-blue-500 
                     dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
            className="px-4 py-2 text-sm font-medium rounded-md border 
                     border-gray-300 text-gray-700 bg-white shadow-sm 
                     hover:bg-gray-50 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                     dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded-md border 
                     border-transparent bg-blue-600 text-white shadow-sm 
                     hover:bg-blue-700 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                Submitting...
              </>
            ) : (
              'Submit Story'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}