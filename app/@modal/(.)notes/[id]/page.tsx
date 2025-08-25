import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNoteByIdServer } from "../../../../lib/api/serverApi";
import NotePreview from "./NotePreview.client";

interface NotePreviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePreviewPage({ params }: NotePreviewPageProps) {
  const queryClient = new QueryClient();
  const resolvedParams = await params;
  
  try {
    await queryClient.prefetchQuery({
      queryKey: ["note", resolvedParams.id],
      queryFn: () => fetchNoteByIdServer(resolvedParams.id),
    });
  } catch (error) {
    // Якщо помилка 401 (Unauthorized), не prefetch'имо дані
    // Клієнтський компонент сам обробить цю ситуацію
    console.log('Server prefetch failed, client will handle:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={resolvedParams.id} />
    </HydrationBoundary>
  );
}
