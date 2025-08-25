import { ReactNode } from 'react';
import AuthProvider from '../../components/AuthProvider/AuthProvider';

export default function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}