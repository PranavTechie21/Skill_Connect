import React, { useState } from 'react';
import { useTheme } from "./theme-provider";
import { X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApplicationSubmit } from '../hooks/useApplicationSubmit';
import { Toaster } from 'sonner';

interface QuickApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
  matchPercentage: number;
}

export function QuickApplyModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  companyName,
  matchPercentage
}: QuickApplyModalProps) {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const [coverLetter, setCoverLetter] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const { submitApplication, isSubmitting } = useApplicationSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await submitApplication({
      jobId,
      coverLetter,
      attachments,
    });

    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Toaster />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0",
          darkMode ? "bg-black/70 backdrop-blur-sm" : "bg-black/50 backdrop-blur-sm"
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-2xl p-8 rounded-3xl shadow-2xl transition-all duration-500",
        "bg-background border border-border/50"
      )}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute right-4 top-4 p-2 rounded-xl transition-all",
            "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className={cn(
            "text-2xl font-black mb-2",
            "text-foreground"
          )}>
            Quick Apply
          </h2>
          <p className="text-muted-foreground">
            Applying for <span className="font-semibold">{jobTitle}</span>
            {companyName && (
              <> at <span className="font-semibold">{companyName}</span></>
            )}
          </p>
          <div className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
            <span className="font-semibold">Match</span>
            <span className="font-bold text-primary">{matchPercentage}%</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Cover Letter */}
          <div className="mb-6">
            <label 
              htmlFor="coverLetter"
              className={cn(
                "block mb-2 font-semibold",
                darkMode ? "text-gray-200" : "text-gray-700"
              )}
            >
              Cover Letter (Optional)
            </label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell us why you're excited about this position..."
              rows={6}
              className={cn(
                "w-full p-4 rounded-xl transition-all resize-none",
                darkMode
                  ? "bg-gray-700 border-2 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500"
              )}
            />
          </div>

          {/* Attachments */}
          <div className="mb-8">
            <label 
              htmlFor="attachments"
              className={cn(
                "block mb-2 font-semibold",
                darkMode ? "text-gray-200" : "text-gray-700"
              )}
            >
              Additional Documents (Optional)
            </label>
            <div 
              className={cn(
                "p-4 rounded-xl border-2 border-dashed transition-all",
                darkMode
                  ? "bg-gray-700 border-gray-600 hover:border-blue-500"
                  : "bg-gray-50 border-gray-200 hover:border-indigo-500"
              )}
            >
              <input
                type="file"
                id="attachments"
                multiple
                onChange={(e) => setAttachments(Array.from(e.target.files || []))}
                className="hidden"
              />
              <label
                htmlFor="attachments"
                className={cn(
                  "flex flex-col items-center justify-center cursor-pointer",
                  darkMode ? "text-gray-400" : "text-gray-500"
                )}
              >
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs mt-1">
                  PDF, DOC, DOCX up to 10MB each
                </span>
              </label>
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-lg",
                        darkMode ? "bg-gray-600" : "bg-white"
                      )}
                    >
                      <span className={darkMode ? "text-gray-200" : "text-gray-700"}>
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                        className={cn(
                          "p-1 rounded-lg transition-all",
                          darkMode
                            ? "text-gray-400 hover:bg-gray-500 hover:text-white"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "px-6 py-3 rounded-xl font-semibold transition-all",
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "px-6 py-3 rounded-xl font-semibold text-white shadow-lg flex items-center gap-2 transition-all",
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                isSubmitting && "opacity-75 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}