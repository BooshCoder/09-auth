'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../lib/store/authStore';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Приватні маршрути
  const privateRoutes = [
    '/notes',
    '/profile',
    '/notes/action/create'
  ];

  // Публічні маршрути
  const publicRoutes = [
    '/sign-in',
    '/sign-up'
  ];

  const isPrivateRoute = privateRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(route => 
    pathname === route
  );

  // Логіка перенаправлення
  useEffect(() => {
    // Якщо користувач неавторизований і намагається зайти на приватну сторінку
    if (!isAuthenticated && isPrivateRoute) {
      setIsRedirecting(true);
      router.push('/sign-in');
      return;
    }

    // Якщо користувач авторизований і намагається зайти на публічну сторінку
    if (isAuthenticated && isPublicRoute) {
      setIsRedirecting(true);
      router.push('/profile');
      return;
    }

    setIsRedirecting(false);
  }, [isAuthenticated, isPrivateRoute, isPublicRoute, router, pathname]);

  // Показуємо лоадер під час перенаправлення
  if (isRedirecting) {
    return <LoadingIndicator />;
  }

  return <>{children}</>;
}