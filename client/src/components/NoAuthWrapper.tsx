import React, { ReactNode } from 'react';

interface NoAuthWrapperProps {
  children: ReactNode;
}

/**
 * A component wrapper that allows content to be displayed without requiring authentication.
 * Use this for public pages like story submission, public story list, etc.
 */
export function NoAuthWrapper({ children }: NoAuthWrapperProps) {
  return <>{children}</>;
}