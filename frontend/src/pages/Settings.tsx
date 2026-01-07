import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useStore } from '../store/useStore';
import { tagsApi, prenomsApi } from '../services/api';
import type { Tag, Prenom } from '../types';

export function Settings() {
  const {
    tags,
    prenoms,
    fetchTags,
    fetchPrenoms,
    addTag,
    updateTag,
    removeTag,
    addPrenom,
    updatePrenom,
    setTags,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'prenoms' | 'tags'>('prenoms');

  // Prenoms form state
  const [newPrenomName, setNewPrenomName] = useState('');
  const [editingPrenom, setEditingPrenom] = useState<Prenom | null>(null);

  // Tags form state
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  useEffect(() => {
    fetchTags();
    fetchPrenoms();
  }, [fetchTags, fetchPrenoms]);

  // Prénoms handlers
  const handleAddPrenom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await prenomsApi.create({ name: newPrenomName });
      addPrenom(response.data);
      setNewPrenomName('');
    } catch (error) {
      console.error('Error adding prenom:', error);
    }
  };

  const handleUpdatePrenom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrenom) return;

    try {
      const response = await prenomsApi.update(editingPrenom.id, {
        name: editingPrenom.name,
      });
      updatePrenom(editingPrenom.id, response.data);
      setEditingPrenom(null);
    } catch (error) {
      console.error('Error updating prenom:', error);
    }
  };

  const handleTogglePrenomActive = async (prenom: Prenom) => {
    try {
      const response = await prenomsApi.update(prenom.id, {
        active: !prenom.active,
      });
      updatePrenom(prenom.id, response.data);
    } catch (error) {
      console.error('Error toggling prenom:', error);
    }
  };

  // Tags handlers
  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await tagsApi.create({
        name: newTagName,
        color: newTagColor,
      });
      addTag(response.data);
      setNewTagName('');
      setNewTagColor('#3B82F6');
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;

    try {
      const response = await tagsApi.update(editingTag.id, {
        name: editingTag.name,
        color: editingTag.color,
      });
      updateTag(editingTag.id, response.data);
      setEditingTag(null);
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      await tagsApi.delete(tagId);
      removeTag(tagId);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Paramètres</h1>
          <p className="text-sm text-muted-foreground">
            Gérer les prénoms et les catégories
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('prenoms')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'prenoms'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Prénoms
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'tags'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Catégories
          </button>
        </div>

        {/* Prenoms Tab */}
        {activeTab === 'prenoms' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter un prénom</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPrenom} className="flex gap-2">
                  <Input
                    placeholder="Nom du prénom"
                    value={newPrenomName}
                    onChange={(e) => setNewPrenomName(e.target.value)}
                    required
                  />
                  <Button type="submit">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liste des prénoms ({prenoms.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {prenoms.map((prenom) => (
                    <div
                      key={prenom.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      {editingPrenom?.id === prenom.id ? (
                        <form onSubmit={handleUpdatePrenom} className="flex-1 flex gap-2">
                          <Input
                            value={editingPrenom.name}
                            onChange={(e) =>
                              setEditingPrenom({ ...editingPrenom, name: e.target.value })
                            }
                            required
                          />
                          <Button type="submit" size="sm">
                            Enregistrer
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingPrenom(null)}
                          >
                            Annuler
                          </Button>
                        </form>
                      ) : (
                        <>
                          <span
                            className={`flex-1 ${!prenom.active ? 'text-muted-foreground line-through' : ''}`}
                          >
                            {prenom.name}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              prenom.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {prenom.active ? 'Actif' : 'Inactif'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingPrenom(prenom)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant={prenom.active ? 'outline' : 'default'}
                            size="sm"
                            onClick={() => handleTogglePrenomActive(prenom)}
                          >
                            {prenom.active ? 'Désactiver' : 'Activer'}
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tags Tab */}
        {activeTab === 'tags' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTag} className="flex gap-2">
                  <Input
                    placeholder="Nom de la catégorie"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    required
                  />
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-16 h-10 rounded border cursor-pointer"
                  />
                  <Button type="submit">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liste des catégories ({tags.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tags
                    .sort((a, b) => a.order - b.order)
                    .map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        {editingTag?.id === tag.id ? (
                          <form onSubmit={handleUpdateTag} className="flex-1 flex gap-2">
                            <Input
                              value={editingTag.name}
                              onChange={(e) =>
                                setEditingTag({ ...editingTag, name: e.target.value })
                              }
                              required
                            />
                            <input
                              type="color"
                              value={editingTag.color}
                              onChange={(e) =>
                                setEditingTag({ ...editingTag, color: e.target.value })
                              }
                              className="w-16 h-10 rounded border cursor-pointer"
                            />
                            <Button type="submit" size="sm">
                              Enregistrer
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingTag(null)}
                            >
                              Annuler
                            </Button>
                          </form>
                        ) : (
                          <>
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span className="flex-1">{tag.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingTag(tag)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTag(tag.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
