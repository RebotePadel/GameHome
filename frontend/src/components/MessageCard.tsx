import { useState } from 'react';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useStore } from '../store/useStore';
import { Message } from '../types';
import { formatRelativeTime, formatFullDate, getFileIcon, cn } from '../lib/utils';
import { likesApi, commentsApi } from '../services/api';
import { LikeButton } from './LikeButton';
import { CommentSection } from './CommentSection';

interface MessageCardProps {
  message: Message;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export function MessageCard({ message, isSelected, onToggleSelect }: MessageCardProps) {
  const { tags, getPrenomById, updateMessage } = useStore();
  const [showComments, setShowComments] = useState(false);

  const messageTags = message.tags
    .map((tagId) => tags.find((t) => t.id === tagId))
    .filter(Boolean);

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-primary'
      )}
    >
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {onToggleSelect && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={onToggleSelect}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
              )}
              <span className="font-semibold text-sm">{message.author}</span>
              <span className="text-xs text-muted-foreground" title={formatFullDate(message.createdAt)}>
                {formatRelativeTime(message.createdAt)}
              </span>
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {messageTags.map((tag) => (
                <Badge
                  key={tag.id}
                  style={{ backgroundColor: tag.color, color: '#fff' }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none mb-4">
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        </div>

        {/* Attachments */}
        {message.attachments.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {message.attachments.map((att) => (
              <a
                key={att.id}
                href={`/uploads/${att.filepath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block border rounded-lg p-2 hover:bg-accent transition-colors"
              >
                {att.type === 'image' ? (
                  <img
                    src={`/uploads/${att.filepath}`}
                    alt={att.filename}
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-2xl">{getFileIcon(att.type)}</span>
                    <span className="truncate">{att.filename}</span>
                  </div>
                )}
              </a>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-3 border-t">
          <LikeButton message={message} />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            {message.comments.length > 0 && (
              <span className="text-xs">{message.comments.length}</span>
            )}
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && <CommentSection message={message} />}
      </CardContent>
    </Card>
  );
}
