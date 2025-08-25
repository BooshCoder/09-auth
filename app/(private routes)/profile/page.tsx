import type { Metadata } from 'next';
import { getCurrentUserServer } from '../../../lib/api/serverApi';
import css from './Profile.module.css';

export const metadata: Metadata = {
  title: "Профіль користувача | NoteHub",
  description: "Переглядайте та редагуйте свій профіль користувача. Керуйте особистою інформацією та налаштуваннями акаунту.",
  keywords: ["профіль", "користувач", "налаштування", "акаунт"],
  authors: [{ name: "NoteHub Team" }],
  openGraph: {
    title: "Профіль користувача | NoteHub",
    description: "Переглядайте та редагуйте свій профіль користувача. Керуйте особистою інформацією та налаштуваннями акаунту.",
    url: "https://08-zustand-gilt.vercel.app/profile",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Профіль користувача - NoteHub",
      },
    ],
  },
};

export default async function ProfilePage() {
  try {
    const user = await getCurrentUserServer();

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
  } catch (error) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <p>Помилка завантаження профілю. Спробуйте ще раз.</p>
        </div>
      </main>
    );
  }
}
