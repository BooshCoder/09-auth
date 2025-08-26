import type { Metadata } from 'next';
import { getCurrentUserServer } from '../../../lib/api/serverApi';

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
      <main className="mainContent">
        <div className="profileCard">
          <div className="header">
            <h1 className="formTitle">Profile Page</h1>
            <a href="/profile/edit" className="editProfileButton">
              Edit Profile
            </a>
          </div>
          <div className="avatarWrapper">
            <div className="avatar">
              <span style={{ fontSize: '48px' }}>👤</span>
            </div>
          </div>
          <div className="profileInfo">
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="mainContent">
        <div className="profileCard">
          <div className="header">
            <h1 className="formTitle">Profile Page</h1>
          </div>
          <div className="profileInfo">
            <p>Error loading profile data</p>
          </div>
        </div>
      </main>
    );
  }
}
