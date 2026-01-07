import { useEffect, useState } from 'react';
import { Plus, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useStore } from '../store/useStore';
import { MessageCard } from '../components/MessageCard';
import { NewMessageModal } from '../components/NewMessageModal';
import { likesApi } from '../services/api';

export function Wall() {
  const {
    messages,
    selectedMessages,
    fetchMessages,
    isLoadingMessages,
    toggleSelectMessage,
    clearSelection,
    getActivePrenoms,
    updateMessage,
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBulkLike, setShowBulkLike] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleBulkLike = async (prenomId: string) => {
    try {
      const messageIds = Array.from(selectedMessages);
      await likesApi.bulkAdd(messageIds, prenomId);

      // Refresh messages to get updated likes
      await fetchMessages();
      clearSelection();
      setShowBulkLike(false);
    } catch (error) {
      console.error('Error bulk liking:', error);
    }
  };

  const activePrenoms = getActivePrenoms();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mur</h1>
            <p className="text-sm text-muted-foreground">
              Tous les messages ({messages.length})
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedMessages.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedMessages.size} sélectionné(s)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkLike(!showBulkLike)}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Liker
                </Button>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Annuler
                </Button>
              </div>
            )}

            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouvelle main courante</span>
              <span className="sm:hidden">Nouveau</span>
            </Button>
          </div>
        </div>

        {/* Bulk like selector */}
        {showBulkLike && selectedMessages.size > 0 && (
          <div className="border-t bg-muted/50 p-4">
            <p className="text-sm font-medium mb-2">Sélectionner un prénom :</p>
            <div className="flex flex-wrap gap-2">
              {activePrenoms.map((prenom) => (
                <Button
                  key={prenom.id}
                  size="sm"
                  onClick={() => handleBulkLike(prenom.id)}
                >
                  {prenom.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Messages */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {isLoadingMessages ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun message pour le moment</p>
            <Button onClick={() => setIsModalOpen(true)} className="mt-4">
              Créer le premier message
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                isSelected={selectedMessages.has(message.id)}
                onToggleSelect={() => toggleSelectMessage(message.id)}
              />
            ))}
          </div>
        )}
      </main>

      <NewMessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
