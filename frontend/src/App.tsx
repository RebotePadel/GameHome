import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Wall } from './pages/Wall';
import { Category } from './pages/Category';
import { Settings } from './pages/Settings';
import { useStore } from './store/useStore';

function App() {
  const { fetchTags, fetchPrenoms } = useStore();

  useEffect(() => {
    // Load initial data
    fetchTags();
    fetchPrenoms();
  }, [fetchTags, fetchPrenoms]);

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Hidden on mobile, shown on tablet+ */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Wall />} />
            <Route path="/category/:tagId" element={<Category />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around">
        <a href="/" className="flex flex-col items-center gap-1 px-3 py-2">
          <span className="text-2xl">🏠</span>
          <span className="text-xs">Mur</span>
        </a>
        <a href="/settings" className="flex flex-col items-center gap-1 px-3 py-2">
          <span className="text-2xl">⚙️</span>
          <span className="text-xs">Paramètres</span>
        </a>
      </div>
    </BrowserRouter>
  );
}

export default App;
