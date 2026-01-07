import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useStore } from '../store/useStore';
import { MessageCard } from '../components/MessageCard';
import { NewMessageModal } from '../components/NewMessageModal';

export function Category() {
  const { tagId } = useParams<{ tagId: string }>();
  const {
    messages,
    fetchMessagesByTag,
    isLoadingMessages,
    getTagById,
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const tag = tagId ? getTagById(tagId) : null;

  useEffect(() => {
    if (tagId) {
      fetchMessagesByTag(tagId);
    }
  }, [tagId, fetchMessagesByTag]);

  if (!tag) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Catégorie non trouvée</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            <div>
              <h1 className="text-2xl font-bold">{tag.name}</h1>
              <p className="text-sm text-muted-foreground">
                {messages.length} message(s)
              </p>
            </div>
          </div>

          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle main courante</span>
            <span className="sm:hidden">Nouveau</span>
          </Button>
        </div>
      </header>

      {/* Messages */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {isLoadingMessages ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun message dans cette catégorie</p>
            <Button onClick={() => setIsModalOpen(true)} className="mt-4">
              Créer le premier message
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))}
          </div>
        )}
      </main>

      <NewMessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
