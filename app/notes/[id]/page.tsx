import type { Metadata } from 'next'
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";
import NotePreview from "../../@modal/(.)notes/[id]/NotePreview.client";

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  
  try {
    const note = await fetchNoteById(resolvedParams.id);
    
    const title = `${note.title} | NoteHub`;
    const description = note.content.length > 150
      ? `${note.content.substring(0, 150)}...`
      : note.content;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://08-zustand-gilt.vercel.app/notes/${resolvedParams.id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: note.title,
          },
        ],
      },
    };
  } catch {
    return {
      title: "Нотатку не знайдено | NoteHub",
      description: "Вибачте, запитувана нотатка не існує або була видалена.",
      openGraph: {
        title: "Нотатку не знайдено | NoteHub",
        description: "Вибачте, запитувана нотатка не існує або була видалена.",
        url: `https://08-zustand-gilt.vercel.app/notes/${resolvedParams.id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "Нотатку не знайдено",
          },
        ],
      },
    };
  }
}

interface NotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const queryClient = new QueryClient();
  const resolvedParams = await params;

  await queryClient.prefetchQuery({
    queryKey: ["note", resolvedParams.id],
    queryFn: () => fetchNoteById(resolvedParams.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={resolvedParams.id} />
    </HydrationBoundary>
  );
}