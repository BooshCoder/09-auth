'use client';

import { useEffect } from 'react';
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
      router.push('/sign-in');
      return;
    }

    // Якщо користувач авторизований і намагається зайти на публічну сторінку
    if (isAuthenticated && isPublicRoute) {
      router.push('/profile');
      return;
    }
  }, [isAuthenticated, isPrivateRoute, isPublicRoute, router, pathname]);

  // Не показуємо контент якщо користувач неавторизований на приватній сторінці
  if (!isAuthenticated && isPrivateRoute) {
    return <LoadingIndicator />;
  }

  return <>{children}</>;
}