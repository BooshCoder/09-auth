'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/08-zustand';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const { user, isAuthenticated, logout, isLoading } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/sign-in');
    } catch (error) {
      console.error('Помилка виходу:', error);
    }
  };

  // Показуємо заглушку до монтування компонента
  if (!isMounted) {
    return (
      <>
        <li className={css.navigationItem}>
          <a href="/sign-in" className={css.navigationLink}>
            Login
          </a>
        </li>
        <li className={css.navigationItem}>
          <a href="/sign-up" className={css.navigationLink}>
            Register
          </a>
        </li>
      </>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <a href="/profile" className={css.navigationLink}>
            Profile
          </a>
        </li>

        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user?.email}</p>
          <button 
            onClick={handleLogout}
            disabled={isLoading}
            className={css.logoutButton}
          >
            {isLoading ? 'Logout...' : 'Logout'}
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <a href="/sign-in" className={css.navigationLink}>
          Login
        </a>
      </li>

      <li className={css.navigationItem}>
        <a href="/sign-up" className={css.navigationLink}>
          Register
        </a>
      </li>
    </>
  );
}