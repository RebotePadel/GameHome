import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useStore } from '../store/useStore';
import { Message } from '../types';
import { commentsApi } from '../services/api';
import { formatRelativeTime, formatFullDate } from '../lib/utils';

interface CommentSectionProps {
  message: Message;
}

export function CommentSection({ message }: CommentSectionProps) {
  const { getActivePrenoms, getPrenomById, updateMessage } = useStore();
  const [newComment, setNewComment] = useState('');
  const [selectedPrenomId, setSelectedPrenomId] = useState('');
  const activePrenoms = getActivePrenoms();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !selectedPrenomId) return;

    try {
      const response = await commentsApi.add({
        messageId: message.id,
        prenomId: selectedPrenomId,
        content: newComment.trim(),
      });

      const updatedComments = [...message.comments, response.data];
      updateMessage(message.id, { comments: updatedComments });

      setNewComment('');
      setSelectedPrenomId('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t space-y-3">
      <h4 className="font-semibold text-sm flex items-center gap-2">
        💬 Commentaires ({message.comments.length})
      </h4>

      {/* Comments list */}
      <div className="space-y-3">
        {message.comments.map((comment) => {
          const prenom = getPrenomById(comment.prenomId);
          return (
            <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">👤 {prenom?.name}</span>
                <span className="text-xs text-muted-foreground" title={formatFullDate(comment.createdAt)}>
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
          );
        })}
      </div>

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <select
          value={selectedPrenomId}
          onChange={(e) => setSelectedPrenomId(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          required
        >
          <option value="">Sélectionner un prénom...</option>
          {activePrenoms.map((prenom) => (
            <option key={prenom.id} value={prenom.id}>
              {prenom.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <Textarea
            placeholder="Ajouter un commentaire..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 min-h-[60px]"
            required
          />
          <Button type="submit" size="icon" disabled={!newComment.trim() || !selectedPrenomId}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
