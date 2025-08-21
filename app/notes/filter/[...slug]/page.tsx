import type { Metadata } from 'next'
import NotesClient from "./Notes.client";
import { fetchNotesServer } from "../../../../lib/api";

export async function generateMetadata({ 
  params
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = resolvedParams.slug[0] || "All";

  const title = tag === "All" 
    ? "Всі нотатки | NoteHub"
    : `${tag} нотатки | NoteHub`;
    
  const description = tag === "All"
    ? "Переглядайте всі ваші нотатки з можливістю пошуку та фільтрації"
    : `Переглядайте нотатки з категорії "${tag}" з можливістю пошуку та фільтрації`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-gilt.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function NotesPage({ params, searchParams }: NotesPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const tag = resolvedParams.slug[0] || "All";
  const page = parseInt(resolvedSearchParams.page || "1");
  const search = resolvedSearchParams.search || "";

  // Завантажуємо дані на сервері
  const initialData = await fetchNotesServer(page, 12, search, tag === "All" ? undefined : tag);

  return <NotesClient tag={tag} initialData={initialData} />;
} 