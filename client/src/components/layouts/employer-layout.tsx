import { Outlet } from 'react-router-dom';
import { SkillConnectAssistant } from '@/components/skillconnect-assistant';

const SHOW_SUPPORT_CHATBOT = true;

export default function EmployerLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
      {SHOW_SUPPORT_CHATBOT ? <SkillConnectAssistant /> : null}
    </div>
  );
}