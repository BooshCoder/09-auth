'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../lib/store/08-zustand';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    hasCheckedSession,
    checkSession, 
    clearIsAuthenticated,
    resetSessionCheck
  } = useAuthStore();
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

  // Скидаємо стан при першому завантаженні
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authStore = localStorage.getItem('auth-store');
      if (authStore) {
        try {
          const parsed = JSON.parse(authStore);
          if (parsed.state && parsed.state.hasCheckedSession) {
            resetSessionCheck();
          }
        } catch (error) {
          console.error('Помилка парсингу auth-store:', error);
        }
      }
    }
  }, [resetSessionCheck]);

  // Перевірка сесії тільки якщо ще не перевіряли
  useEffect(() => {
    console.log('AuthProvider session check effect:', { hasCheckedSession });
    if (!hasCheckedSession) {
      console.log('Starting session check...');
      const checkAuth = async () => {
        try {
          await checkSession();
        } catch (error) {
          console.error('Помилка перевірки сесії:', error);
          clearIsAuthenticated();
        }
      };

      checkAuth();
    }
  }, [hasCheckedSession, checkSession, clearIsAuthenticated]);

  // Логіка перенаправлення
  useEffect(() => {
    console.log('AuthProvider redirect logic:', {
      isAuthenticated,
      isLoading,
      hasCheckedSession,
      isPrivateRoute,
      isPublicRoute,
      pathname
    });

    // Чекаємо завершення перевірки сесії
    if (isLoading || !hasCheckedSession) {
      console.log('Waiting for session check to complete...');
      return;
    }

    // Якщо користувач неавторизований і намагається зайти на приватну сторінку
    if (!isAuthenticated && isPrivateRoute) {
      console.log('User not authenticated on private route, redirecting to sign-in');
      clearIsAuthenticated();
      router.push('/sign-in');
      return;
    }

    // Якщо користувач авторизований і намагається зайти на публічну сторінку
    if (isAuthenticated && isPublicRoute) {
      console.log('User authenticated on public route, redirecting to profile');
      router.push('/profile');
      return;
    }

    console.log('No redirect needed');
  }, [isAuthenticated, isLoading, hasCheckedSession, isPrivateRoute, isPublicRoute, router, clearIsAuthenticated, pathname]);

  // Показуємо лоадер під час перевірки авторизації
  if (isLoading || !hasCheckedSession) {
    console.log('Showing loading indicator - session check in progress');
    return <LoadingIndicator />;
  }

  // Не показуємо контент якщо користувач неавторизований на приватній сторінці
  if (!isAuthenticated && isPrivateRoute) {
    console.log('User not authenticated on private route, showing loading indicator');
    return <LoadingIndicator />;
  }

  console.log('Rendering children - user is authenticated or on public route');
  return <>{children}</>;
}