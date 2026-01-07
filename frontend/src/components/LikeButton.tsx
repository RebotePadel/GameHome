import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useStore } from '../store/useStore';
import { Message } from '../types';
import { likesApi } from '../services/api';

interface LikeButtonProps {
  message: Message;
}

export function LikeButton({ message }: LikeButtonProps) {
  const { getActivePrenoms, getPrenomById, updateMessage } = useStore();
  const [showPrenomSelect, setShowPrenomSelect] = useState(false);
  const activePrenoms = getActivePrenoms();

  const handleLike = async (prenomId: string) => {
    try {
      // Check if already liked
      const alreadyLiked = message.likes.some((l) => l.prenomId === prenomId);

      if (alreadyLiked) {
        // Unlike
        await likesApi.remove(message.id, prenomId);
        const updatedLikes = message.likes.filter((l) => l.prenomId !== prenomId);
        updateMessage(message.id, { likes: updatedLikes });
      } else {
        // Like
        const response = await likesApi.add({ messageId: message.id, prenomId });
        const updatedLikes = [...message.likes, response.data];
        updateMessage(message.id, { likes: updatedLikes });
      }

      setShowPrenomSelect(false);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const likedPrenomNames = message.likes
    .map((like) => getPrenomById(like.prenomId)?.name)
    .filter(Boolean)
    .join(', ');

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowPrenomSelect(!showPrenomSelect)}
        className="gap-2"
      >
        <Heart className={`w-4 h-4 ${message.likes.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
        {message.likes.length > 0 && (
          <span className="text-xs">{message.likes.length}</span>
        )}
      </Button>

      {message.likes.length > 0 && (
        <div className="text-xs text-muted-foreground mt-1 absolute top-full left-0 whitespace-nowrap">
          {likedPrenomNames}
        </div>
      )}

      {showPrenomSelect && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-[150px]">
          {activePrenoms.map((prenom) => {
            const isLiked = message.likes.some((l) => l.prenomId === prenom.id);
            return (
              <button
                key={prenom.id}
                onClick={() => handleLike(prenom.id)}
                className={`block w-full text-left px-3 py-2 rounded hover:bg-accent text-sm ${
                  isLiked ? 'bg-accent font-semibold' : ''
                }`}
              >
                {prenom.name} {isLiked && '❤️'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
