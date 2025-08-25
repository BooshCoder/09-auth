import Profile from '../../../components/Profile/Profile';

export const metadata = {
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

export default function ProfilePage() {
  return <Profile />;
}
