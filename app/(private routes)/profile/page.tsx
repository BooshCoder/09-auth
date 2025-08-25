'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/authStore';
import css from './Profile.module.css';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Якщо користувач неавторизований, перенаправляємо на sign-in
    if (!isAuthenticated) {
      router.push('/sign-in');
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

  // Показуємо лоадер під час перевірки авторизації
  if (isLoading) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <p>Завантаження...</p>
        </div>
      </main>
    );
  }

  // Якщо користувач неавторизований, не показуємо контент
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>
        <div className={css.avatarWrapper}>
          <img 
            src={user.avatar || "https://ac.goit.global/fullstack/react/default-avatar.jpg"} 
            alt="User Avatar" 
            width={120} 
            height={120} 
            className={css.avatar} 
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username || 'Not specified'}</p>
          <p>Email: {user.email || 'Not specified'}</p>
        </div>
      </div>
    </main>
  );
}
