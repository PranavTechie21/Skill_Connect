import { toast } from 'sonner';

interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export function useToast() {
  const showToast = ({ title, description, variant = 'default' }: ToastProps) => {
    switch (variant) {
      case 'success':
        toast.success(title, {
          description,
        });
        break;
      case 'warning':
        toast.warning(title, {
          description,
        });
        break;
      case 'destructive':
        toast.error(title, {
          description,
        });
        break;
      default:
        toast(title, {
          description,
        });
    }
  };

  return {
    toast: showToast,
  };
}