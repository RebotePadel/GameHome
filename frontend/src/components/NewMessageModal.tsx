import { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useStore } from '../store/useStore';
import { messagesApi } from '../services/api';

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewMessageModal({ isOpen, onClose }: NewMessageModalProps) {
  const { tags, getActivePrenoms, addMessage } = useStore();
  const activePrenoms = getActivePrenoms();

  const [step, setStep] = useState<'password' | 'form'>('password');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedPrenomId, setSelectedPrenomId] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'MainCourante') {
      setStep('form');
      setError('');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const handleToggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const prenom = activePrenoms.find((p) => p.id === selectedPrenomId);
      if (!prenom) throw new Error('Prénom non trouvé');

      const response = await messagesApi.create(
        {
          content,
          tagIds: selectedTagIds,
          author: prenom.name,
          files,
        },
        password
      );

      addMessage(response.data);
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('password');
    setPassword('');
    setContent('');
    setSelectedTagIds([]);
    setSelectedPrenomId('');
    setFiles([]);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold">Nouvelle main courante</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {step === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mot de passe</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrer le mot de passe"
                  autoFocus
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Continuer
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium mb-2">Auteur</label>
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
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Écrire le message de la main courante..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Catégories (au moins 1)
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags
                    .sort((a, b) => a.order - b.order)
                    .map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleToggleTag(tag.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          selectedTagIds.includes(tag.id)
                            ? 'ring-2 ring-offset-2'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: tag.color,
                          color: '#fff',
                          ringColor: tag.color,
                        }}
                      >
                        {tag.name}
                      </button>
                    ))}
                </div>
              </div>

              {/* Files */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Pièces jointes (optionnel)
                </label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Cliquer pour sélectionner des fichiers
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Images, vidéos, PDF (max 10 fichiers)
                    </span>
                  </label>
                </div>
                {files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {files.map((file, index) => (
                      <div key={index} className="text-sm flex items-center gap-2">
                        <span>📎</span>
                        <span className="flex-1 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setFiles(files.filter((_, i) => i !== index))}
                          className="text-destructive hover:underline"
                        >
                          Retirer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting || selectedTagIds.length === 0}
                >
                  {isSubmitting ? 'Publication...' : 'Publier'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
