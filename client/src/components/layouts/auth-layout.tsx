import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { normalizeUserType } from '@/lib/utils';
import { SkillConnectAssistant } from '@/components/skillconnect-assistant';

const SHOW_SUPPORT_CHATBOT = true;

interface AuthLayoutProps {
  userType: 'Professional' | 'Employer';
}

export default function AuthLayout({ userType }: AuthLayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const normalized = normalizeUserType(user?.userType || '');

  if (user.userType !== userType) {
    const redirectTo =
      normalized === 'professional'
        ? '/employee/dashboard'
        : normalized === 'employer'
        ? '/employer/dashboard'
        : '/';

    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      {SHOW_SUPPORT_CHATBOT ? <SkillConnectAssistant /> : null}
    </div>
  );
}