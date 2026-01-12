import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Tag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export function Sidebar() {
  const location = useLocation();
  const { tags } = useStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 border-r bg-card h-screen flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b flex flex-col items-center">
        <img
          src="https://www.gameparc86.fr/wp-content/uploads/2018/10/Game-Parc-bords-arrondis.png"
          alt="Game Parc"
          className="w-32 h-auto mb-3"
        />
        <h1 className="text-2xl font-bold text-center">GameHome</h1>
        <p className="text-sm text-muted-foreground text-center">Main Courante</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Mur */}
        <Link
          to="/"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
            isActive('/') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
          )}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Mur</span>
        </Link>

        {/* Separator */}
        <div className="pt-4 pb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase px-3">Catégories</p>
        </div>

        {/* Categories */}
        {tags
          .sort((a, b) => a.order - b.order)
          .map((tag) => (
            <Link
              key={tag.id}
              to={`/category/${tag.id}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                isActive(`/category/${tag.id}`)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              )}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <span>{tag.name}</span>
            </Link>
          ))}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t">
        <Link
          to="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
            isActive('/settings') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Paramètres</span>
        </Link>
      </div>
    </aside>
  );
}
