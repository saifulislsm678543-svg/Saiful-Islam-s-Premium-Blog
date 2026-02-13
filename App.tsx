
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu as MenuIcon, 
  Settings as SettingsIcon, 
  Sun, Moon, X, Search as SearchIcon, 
  ChevronLeft, ArrowRight, Facebook, Send, Mail, Phone, Trash2, Edit 
} from 'lucide-react';
import { 
  Language, SettingsState, Post, TRANSLATIONS, ENGLISH_FONTS, BENGALI_FONTS, Collection, PostType 
} from './types';

// --- Global Context/Hooks logic inside App ---

export default function App() {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('blogSettings');
    return saved ? JSON.parse(saved) : {
      theme: 'dark',
      language: 'bn',
      enFont: 'Roboto',
      bnFont: 'Hind Siliguri',
      fontSize: 1.2
    };
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('blogPosts');
    return saved ? JSON.parse(saved) : [];
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('adminPassword') || 'sir678543';
  });

  useEffect(() => {
    localStorage.setItem('blogSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
  }, [posts]);

  const toggleTheme = () => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const setLanguage = (lang: Language) => {
    setSettings(prev => ({ ...prev, language: lang }));
  };

  const t = TRANSLATIONS[settings.language];

  // Global styles based on theme and settings
  const containerClass = `min-h-screen smooth-transition ${
    settings.theme === 'dark' ? 'bg-[#0f1115] text-white' : 'bg-[#f8fafc] text-black'
  }`;

  const activeFontFamily = settings.language === 'en' ? settings.enFont : settings.bnFont;

  return (
    <HashRouter>
      <div className={containerClass} style={{ fontFamily: activeFontFamily }}>
        <Header settings={settings} toggleTheme={toggleTheme} setSettings={setSettings} />
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<Home settings={settings} posts={posts} setPosts={setPosts} adminPassword={adminPassword} setAdminPassword={setAdminPassword} />} />
            <Route path="/written" element={<MyBlogs settings={settings} posts={posts} setPosts={setPosts} adminPassword={adminPassword} setAdminPassword={setAdminPassword} />} />
            <Route path="/series" element={<SeriesBlogs settings={settings} posts={posts} setPosts={setPosts} adminPassword={adminPassword} setAdminPassword={setAdminPassword} />} />
            <Route path="/all" element={<AllBlogs settings={settings} posts={posts} setPosts={setPosts} />} />
            <Route path="/contact" element={<Contact settings={settings} />} />
            <Route path="/about" element={<About settings={settings} />} />
            <Route path="/post/:id" element={<PostDetail settings={settings} posts={posts} setSettings={setSettings} />} />
            <Route path="/series/:name" element={<SeriesDetail settings={settings} posts={posts} setSettings={setSettings} />} />
          </Routes>
        </main>
        <Footer settings={settings} adminPassword={adminPassword} setAdminPassword={setAdminPassword} />
      </div>
    </HashRouter>
  );
}

// --- Components ---

function Header({ settings, toggleTheme, setSettings }: { 
  settings: SettingsState; 
  toggleTheme: () => void;
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const t = TRANSLATIONS[settings.language];

  return (
    <>
      <header className={`sticky top-0 z-50 w-full px-4 md:px-8 py-4 flex items-center justify-between smooth-transition border-b ${
        settings.theme === 'dark' ? 'bg-[#0f1115]/80 border-white/10' : 'bg-white/80 border-black/5'
      } backdrop-blur-md`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
            <MenuIcon size={24} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
              S
            </div>
            <span className="text-xl font-bold tracking-tight">Saiful Islam</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            {settings.theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <SettingsIcon size={22} />
          </button>
        </div>
      </header>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className={`relative w-full max-w-md p-8 rounded-3xl shadow-2xl animate-in slide-in-from-left-4 duration-300 ${
            settings.theme === 'dark' ? 'bg-[#1a1c22] text-white' : 'bg-white text-black'
          }`}>
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
              <X size={24} />
            </button>
            <nav className="flex flex-col gap-4 mt-8">
              {[
                { to: '/', label: t.home },
                { to: '/written', label: t.writtenBlogs },
                { to: '/series', label: t.seriesBlogs },
                { to: '/all', label: t.allBlogs },
                { to: '/about', label: t.about },
                { to: '/contact', label: t.contact }
              ].map(link => (
                <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className="text-2xl font-medium hover:text-indigo-500 transition-colors py-2">
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5">
                <p className="text-sm opacity-60 mb-4">{t.changeLang}</p>
                <div className="flex gap-2">
                  <button onClick={() => setSettings(s => ({ ...s, language: 'en' }))} 
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${settings.language === 'en' ? 'bg-indigo-600 text-white' : 'bg-black/5 dark:bg-white/5'}`}>
                    English
                  </button>
                  <button onClick={() => setSettings(s => ({ ...s, language: 'bn' }))} 
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${settings.language === 'bn' ? 'bg-indigo-600 text-white' : 'bg-black/5 dark:bg-white/5'}`}>
                    বাংলা
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Settings Overlay */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsSettingsOpen(false)} />
          <div className={`relative w-full max-w-sm h-fit p-6 rounded-2xl shadow-xl animate-in slide-in-from-right-4 duration-300 ${
            settings.theme === 'dark' ? 'bg-[#1a1c22] text-white border border-white/5' : 'bg-white text-black border border-black/5'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{t.fontSettings}</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-indigo-500 font-medium hover:underline">
                {t.close}
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex gap-2 mb-4 p-1 bg-black/5 dark:bg-white/5 rounded-lg">
                  <button 
                    onClick={() => setSettings(s => ({ ...s, language: 'en' }))}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${settings.language === 'en' ? 'bg-white dark:bg-[#2d3039] shadow-sm' : ''}`}>
                    English
                  </button>
                  <button 
                    onClick={() => setSettings(s => ({ ...s, language: 'bn' }))}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${settings.language === 'bn' ? 'bg-white dark:bg-[#2d3039] shadow-sm' : ''}`}>
                    বাংলা
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {(settings.language === 'en' ? ENGLISH_FONTS : BENGALI_FONTS).map(font => (
                    <button 
                      key={font} 
                      onClick={() => setSettings(s => settings.language === 'en' ? ({ ...s, enFont: font }) : ({ ...s, bnFont: font }))}
                      style={{ fontFamily: font }}
                      className={`px-4 py-2.5 text-left rounded-xl transition-all border ${
                        (settings.language === 'en' ? settings.enFont : settings.bnFont) === font 
                        ? 'border-indigo-500 bg-indigo-500/10' 
                        : 'border-transparent bg-black/5 dark:bg-white/5 hover:border-black/10 dark:hover:border-white/10'
                      }`}>
                      {font}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Home({ settings, posts, setPosts, adminPassword, setAdminPassword }: {
  settings: SettingsState;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  adminPassword: string;
  setAdminPassword: (p: string) => void;
}) {
  const t = TRANSLATIONS[settings.language];
  const [searchQuery, setSearchQuery] = useState('');
  
  const homePosts = posts.filter(p => p.collection === 'home');
  const writtenPosts = posts.filter(p => p.collection === 'written');
  const seriesPosts = Array.from(new Set(posts.filter(p => p.collection === 'series').map(p => p.seriesName)))
    .map(name => posts.find(p => p.seriesName === name)!);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto space-y-16 mt-8">
      <section className="text-center space-y-8 animate-in fade-in duration-1000">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{t.welcome}</h1>
        
        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-4 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all outline-none ${
                settings.theme === 'dark' ? 'bg-[#1a1c22] border-white/5 focus:border-indigo-500' : 'bg-white border-black/5 focus:border-indigo-500'
              }`}
            />
          </div>
          {searchQuery && (
            <div className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-xl shadow-2xl z-40 border ${
              settings.theme === 'dark' ? 'bg-[#1a1c22] border-white/5' : 'bg-white border-black/5'
            }`}>
              {filteredPosts.length > 0 ? filteredPosts.map(p => (
                <Link 
                  key={p.id} 
                  to={p.collection === 'series' ? `/series/${p.seriesName}` : `/post/${p.id}`}
                  className="flex items-center gap-4 p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <img src={p.image} className="w-12 h-12 object-cover rounded-lg" alt="" />
                  <div className="text-left">
                    <p className="font-medium line-clamp-1">{p.title}</p>
                    <p className="text-xs opacity-50">{p.category}</p>
                  </div>
                </Link>
              )) : (
                <p className="p-4 text-center opacity-50">No results found</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Admin Control for Home (Add New Article) */}
      <AdminBoard 
        settings={settings} 
        collection="home" 
        onPublish={(p) => setPosts(prev => [p, ...prev])} 
        adminPassword={adminPassword} 
        setAdminPassword={setAdminPassword} 
      />

      <section className="space-y-8">
        {homePosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homePosts.map(p => <BlogCard key={p.id} post={p} settings={settings} setPosts={setPosts} />)}
          </div>
        )}

        {writtenPosts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.writtenBlogs}</h2>
              <Link to="/written" className="text-indigo-500 flex items-center gap-1 hover:underline">
                {t.seeAll} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {writtenPosts.map(p => (
                <div key={p.id} className="min-w-[300px] md:min-w-[350px]">
                  <BlogCard post={p} settings={settings} setPosts={setPosts} />
                </div>
              ))}
            </div>
          </div>
        )}

        {seriesPosts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.seriesBlogs}</h2>
              <Link to="/series" className="text-indigo-500 flex items-center gap-1 hover:underline">
                {t.seeAll} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {seriesPosts.map(p => (
                <div key={p.id} className="min-w-[300px] md:min-w-[350px]">
                  <SeriesCard post={p} settings={settings} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function MyBlogs({ settings, posts, setPosts, adminPassword, setAdminPassword }: {
  settings: SettingsState;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  adminPassword: string;
  setAdminPassword: (p: string) => void;
}) {
  const t = TRANSLATIONS[settings.language];
  const writtenPosts = posts.filter((p: Post) => p.collection === 'written');
  
  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto mt-8 space-y-12">
      <h1 className="text-3xl font-bold">{t.writtenBlogs}</h1>
      <AdminBoard settings={settings} collection="written" onPublish={(p: Post) => setPosts((prev: Post[]) => [p, ...prev])} adminPassword={adminPassword} setAdminPassword={setAdminPassword} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {writtenPosts.map((p: Post) => <BlogCard key={p.id} post={p} settings={settings} setPosts={setPosts} />)}
      </div>
    </div>
  );
}

function SeriesBlogs({ settings, posts, setPosts, adminPassword, setAdminPassword }: {
  settings: SettingsState;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  adminPassword: string;
  setAdminPassword: (p: string) => void;
  existingPosts?: Post[];
}) {
  const t = TRANSLATIONS[settings.language];
  const seriesNames = Array.from(new Set(posts.filter((p: Post) => p.collection === 'series').map((p: Post) => p.seriesName)));
  const uniqueSeries = seriesNames.map(name => posts.find((p: Post) => p.seriesName === name)!);

  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto mt-8 space-y-12">
      <h1 className="text-3xl font-bold">{t.seriesBlogs}</h1>
      <AdminBoard 
        settings={settings} 
        collection="series" 
        onPublish={(p: Post) => setPosts((prev: Post[]) => [p, ...prev])} 
        adminPassword={adminPassword} 
        setAdminPassword={setAdminPassword} 
        existingPosts={posts}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {uniqueSeries.map((p: Post) => <SeriesCard key={p.id} post={p} settings={settings} />)}
      </div>
    </div>
  );
}

function AllBlogs({ settings, posts, setPosts }: {
  settings: SettingsState;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}) {
  const t = TRANSLATIONS[settings.language];
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(posts.map((p: Post) => p.category))];
    return cats;
  }, [posts]);

  const filtered = posts.filter((p: Post) => activeCategory === 'All' || p.category === activeCategory);

  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto mt-8 space-y-12">
      <h1 className="text-3xl font-bold">{t.allBlogs}</h1>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full transition-all border ${
              activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-black/5 dark:bg-white/5 border-transparent'
            }`}>
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((p: Post) => p.collection === 'series' ? <SeriesCard key={p.id} post={p} settings={settings} /> : <BlogCard key={p.id} post={p} settings={settings} setPosts={setPosts} />)}
      </div>
    </div>
  );
}

interface BlogCardProps {
  post: Post;
  settings: SettingsState;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

/* Updated component to use explicit prop interface to resolve 'key' prop error */
function BlogCard({ post, settings, setPosts }: BlogCardProps) {
  const t = TRANSLATIONS[settings.language];
  const isFeatured = post.type === 'featured';

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if(window.confirm('Delete this post?')) {
      setPosts((prev: Post[]) => prev.filter(p => p.id !== post.id));
    }
  };

  return (
    <Link to={`/post/${post.id}`} className={`group relative block overflow-hidden rounded-3xl smooth-transition border ${
      settings.theme === 'dark' ? 'bg-[#1a1c22] border-white/5' : 'bg-white border-black/5'
    } ${isFeatured ? 'h-[420px]' : ''}`}>
      <div className={`relative ${isFeatured ? 'h-full w-full' : 'aspect-video'}`}>
        <img src={post.image} className="w-full h-full object-cover smooth-transition group-hover:scale-110" alt="" />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent ${isFeatured ? 'flex flex-col justify-end p-8' : 'hidden opacity-0 group-hover:flex group-hover:opacity-100 items-center justify-center'}`}>
          {isFeatured && (
            <div className="space-y-2 text-white">
              <p className="text-xs uppercase tracking-widest opacity-80">{post.date}</p>
              <h3 className="text-2xl font-bold line-clamp-2">{post.title}</h3>
              <div className="flex items-center gap-2 text-sm text-indigo-400 font-medium">
                {t.clickToRead} <ArrowRight size={16} />
              </div>
            </div>
          )}
        </div>
      </div>

      {!isFeatured && (
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs opacity-60">
            <span>{post.date}</span>
            <span>•</span>
            <span className="bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full font-medium">{post.category}</span>
          </div>
          <h3 className="text-xl font-bold line-clamp-1 group-hover:text-indigo-500 transition-colors">{post.title}</h3>
          <p className="text-sm opacity-60 line-clamp-3 leading-relaxed">{post.content}</p>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-sm text-indigo-500 font-medium">
              {t.clickToRead} <ArrowRight size={16} className="smooth-transition group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      )}

      {/* Admin Action Overlay (Only if logged in / visible on hover) */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600">
          <Trash2 size={16} />
        </button>
      </div>
    </Link>
  );
}

interface SeriesCardProps {
  post: Post;
  settings: SettingsState;
}

/* Updated component to use explicit prop interface to resolve 'key' prop error */
function SeriesCard({ post, settings }: SeriesCardProps) {
  const t = TRANSLATIONS[settings.language];
  return (
    <Link to={`/series/${post.seriesName}`} className={`group block overflow-hidden rounded-3xl smooth-transition border ${
      settings.theme === 'dark' ? 'bg-[#1a1c22] border-white/5' : 'bg-white border-black/5'
    }`}>
      <div className="aspect-video relative overflow-hidden">
        <img src={post.image} className="w-full h-full object-cover smooth-transition group-hover:scale-110" alt="" />
        <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-4 left-4">
          <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">SERIES</span>
        </div>
      </div>
      <div className="p-6 space-y-2">
        <h3 className="text-xl font-bold group-hover:text-indigo-500 transition-colors">{post.seriesName}</h3>
        <p className="text-sm opacity-60">{t.clickToRead}</p>
      </div>
    </Link>
  );
}

function PostDetail({ settings, posts, setSettings }: {
  settings: SettingsState;
  posts: Post[];
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  const location = useLocation();
  const match = location.pathname.match(/\/post\/(.+)/);
  const id = match ? match[1] : null;
  const navigate = useNavigate();
  const post = posts.find((p: Post) => p.id === id);
  const t = TRANSLATIONS[settings.language];
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!post) return <div className="p-8">Post not found</div>;

  const updateFontSize = (delta: number) => {
    setSettings((s: SettingsState) => ({ ...s, fontSize: Math.max(1.1, Math.min(3.1, Number((s.fontSize + delta).toFixed(1)))) }));
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className={`sticky top-[73px] z-40 px-4 md:px-8 py-3 flex items-center justify-between border-b ${
        settings.theme === 'dark' ? 'bg-[#0f1115]/90 border-white/10' : 'bg-white/90 border-black/5'
      } backdrop-blur-md`}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 hover:text-indigo-500 transition-colors">
          <ChevronLeft size={20} /> {t.back}
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 px-4 py-1.5 rounded-full">
            <button onClick={() => updateFontSize(-0.1)} className="hover:text-indigo-500 font-bold text-lg">-</button>
            <span className="font-mono font-medium">{settings.fontSize.toFixed(1)}</span>
            <button onClick={() => updateFontSize(0.1)} className="hover:text-indigo-500 font-bold text-lg">+</button>
          </div>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <SettingsIcon size={20} />
          </button>
        </div>
      </div>

      <article className="px-4 md:px-8 max-w-4xl mx-auto py-12 space-y-8">
        <img src={post.image} className="w-full aspect-[2/1] object-cover rounded-[2rem] shadow-2xl" alt="" />
        <div className="space-y-4">
          <div className="flex gap-2">
            <span className="bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full text-sm font-bold uppercase">{post.category}</span>
            <span className="text-sm opacity-40">{post.date}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{post.title}</h1>
          <p className="font-medium opacity-60">By {post.author}</p>
        </div>
        <div className="prose dark:prose-invert max-w-none leading-relaxed" style={{ fontSize: `${settings.fontSize}rem` }}>
          {post.content.split('\n').map((para: string, i: number) => <p key={i}>{para}</p>)}
        </div>
      </article>

      {/* Post-Specific Font Settings Modal (Same as global) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsSettingsOpen(false)} />
          <div className={`relative w-full max-w-sm h-fit p-6 rounded-2xl shadow-xl animate-in slide-in-from-right-4 duration-300 ${
            settings.theme === 'dark' ? 'bg-[#1a1c22] text-white border border-white/5' : 'bg-white text-black border border-black/5'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{t.fontSettings}</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-indigo-500 font-medium hover:underline">
                {t.close}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(settings.language === 'en' ? ENGLISH_FONTS : BENGALI_FONTS).map(font => (
                <button 
                  key={font} 
                  onClick={() => setSettings((s: SettingsState) => settings.language === 'en' ? ({ ...s, enFont: font }) : ({ ...s, bnFont: font }))}
                  style={{ fontFamily: font }}
                  className={`px-4 py-2.5 text-left rounded-xl transition-all border ${
                    (settings.language === 'en' ? settings.enFont : settings.bnFont) === font 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-transparent bg-black/5 dark:bg-white/5 hover:border-black/10 dark:hover:border-white/10'
                  }`}>
                  {font}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SeriesDetail({ settings, posts, setSettings }: {
  settings: SettingsState;
  posts: Post[];
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  const location = useLocation();
  const match = location.pathname.match(/\/series\/(.+)/);
  const name = match ? decodeURIComponent(match[1]) : '';
  const navigate = useNavigate();
  const seriesPosts = posts.filter((p: Post) => p.seriesName === name).sort((a: Post, b: Post) => (a.episodeNumber || 0) - (b.episodeNumber || 0));
  const firstPost = seriesPosts[0];
  const t = TRANSLATIONS[settings.language];

  if (seriesPosts.length === 0) return <div className="p-8">Series not found</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className={`sticky top-[73px] z-40 px-4 md:px-8 py-3 flex items-center border-b ${
        settings.theme === 'dark' ? 'bg-[#0f1115]/90 border-white/10' : 'bg-white/90 border-black/5'
      } backdrop-blur-md`}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 hover:text-indigo-500 transition-colors">
          <ChevronLeft size={20} /> {t.back}
        </button>
      </div>

      <div className="px-4 md:px-8 max-w-5xl mx-auto py-12 space-y-12">
        <div className="relative h-64 md:h-80 rounded-[2rem] overflow-hidden shadow-2xl">
          <img src={firstPost.image} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex flex-col justify-end p-8 text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold">{firstPost.seriesName}</h1>
            <p className="opacity-60">{seriesPosts.length} Episodes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {seriesPosts.map((ep: Post) => (
            <Link key={ep.id} to={`/post/${ep.id}`} className={`flex items-center gap-6 p-6 rounded-2xl smooth-transition border ${
              settings.theme === 'dark' ? 'bg-[#1a1c22] border-white/5 hover:bg-white/5' : 'bg-white border-black/5 hover:bg-black/5'
            }`}>
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {ep.episodeNumber}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{ep.title}</h3>
                <p className="text-sm opacity-60 line-clamp-1">{ep.content}</p>
              </div>
              <ArrowRight size={20} className="text-indigo-500 opacity-0 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Contact({ settings }: { settings: SettingsState }) {
  const t = TRANSLATIONS[settings.language];
  return (
    <div className="px-4 md:px-8 max-w-4xl mx-auto py-20 space-y-12 text-center animate-in zoom-in-95 duration-500">
      <h1 className="text-4xl font-extrabold">{t.contact}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="https://www.facebook.com/share/18CjyzG7bD/" target="_blank" className={`flex items-center gap-4 p-6 rounded-3xl smooth-transition border ${
          settings.theme === 'dark' ? 'bg-[#1a1c22] border-white/5 hover:bg-indigo-500/10' : 'bg-white border-black/5 hover:bg-indigo-500/10'
        }`}>
          <div className="p-4 bg-blue-600 rounded-2xl text-white"><Facebook /></div>
          <div className="text-left">
            <p className="font-bold">Facebook</p>
            <p className="text-xs opacity-50">Follow me on Facebook</p>
          </div>
        </a>
        <a href="https://t.me/saifulislamrifat55" target="_blank" className={`flex items-center gap-4 p-6 rounded-3xl smooth-transition border ${
          settings.theme === 'dark' ? 'bg-[#1a1c22] border-white/5 hover:bg-indigo-500/10' : 'bg-white border-black/5 hover:bg-indigo-500/10'
        }`}>
          <div className="p-4 bg-sky-500 rounded-2xl text-white"><Send /></div>
          <div className="text-left">
            <p className="font-bold">Telegram</p>
            <p className="text-xs opacity-50">@saifulislamrifat55</p>
          </div>
        </a>
        <a href="mailto:saifulislamrifat83@gmail.com" className={`flex items-center gap-4 p-6 rounded-3xl smooth-transition border ${
          settings.theme === 'dark' ? 'bg-[#1a1c22] border-white/5 hover:bg-indigo-500/10' : 'bg-white border-black/5 hover:bg-indigo-500/10'
        }`}>
          <div className="p-4 bg-rose-500 rounded-2xl text-white"><Mail /></div>
          <div className="text-left">
            <p className="font-bold">Gmail</p>
            <p className="text-xs opacity-50">saifulislamrifat83@gmail.com</p>
          </div>
        </a>
        <a href="tel:+8801943149343" className={`flex items-center gap-4 p-6 rounded-3xl smooth-transition border ${
          settings.theme === 'dark' ? 'bg-[#1a1c22] border-white/5 hover:bg-indigo-500/10' : 'bg-white border-black/5 hover:bg-indigo-500/10'
        }`}>
          <div className="p-4 bg-emerald-500 rounded-2xl text-white"><Phone /></div>
          <div className="text-left">
            <p className="font-bold">WhatsApp</p>
            <p className="text-xs opacity-50">+8801943149343</p>
          </div>
        </a>
      </div>
    </div>
  );
}

function About({ settings }: { settings: SettingsState }) {
  const t = TRANSLATIONS[settings.language];
  return (
    <div className="px-4 md:px-8 max-w-3xl mx-auto py-20 space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <h1 className="text-4xl font-extrabold text-center">{t.about}</h1>
      <div className={`p-8 rounded-[2rem] border leading-relaxed space-y-6 ${
        settings.theme === 'dark' ? 'bg-[#1a1c22] border-white/5' : 'bg-white border-black/5'
      }`}>
        <p>Welcome to my personal blog. This platform is dedicated to sharing thoughts, experiences, and specialized series of articles that bring depth and knowledge.</p>
        <p>I aim to provide a peaceful reading experience with a premium interface. Your comfort is my priority, which is why I've implemented customizable fonts and themes.</p>
        <div className="pt-4 flex justify-center">
          <div className="w-20 h-2 bg-indigo-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function Footer({ settings, adminPassword, setAdminPassword }: {
  settings: SettingsState;
  adminPassword: string;
  setAdminPassword: (p: string) => void;
}) {
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [isChangeMode, setIsChangeMode] = useState(false);
  const [newPass, setNewPass] = useState('');
  const t = TRANSLATIONS[settings.language];

  const handleAdminAuth = () => {
    if (passInput === adminPassword) {
      window.dispatchEvent(new CustomEvent('ADMIN_ACCESS_GRANTED'));
      setIsAdminAuthOpen(false);
      setPassInput('');
    } else if (passInput === 'Iam Saiful678') {
      setIsChangeMode(true);
      setPassInput('');
    } else {
      alert(t.incorrectPassword);
    }
  };

  const handleChangePassword = () => {
    if (newPass.trim()) {
      setAdminPassword(newPass);
      localStorage.setItem('adminPassword', newPass);
      alert('Password changed successfully');
      setIsChangeMode(false);
      setIsAdminAuthOpen(false);
      setNewPass('');
    }
  };

  return (
    <footer className="mt-20 border-t border-black/5 dark:border-white/5 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
        <p className="text-sm opacity-40">Copyright ©Saiful Islam</p>
        {/* Invisible Admin Trigger */}
        <button 
          onClick={() => setIsAdminAuthOpen(true)}
          className="w-12 h-4 opacity-0 cursor-default"
        >
          Saiful Islam Rifat
        </button>
      </div>

      {isAdminAuthOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAdminAuthOpen(false)} />
          <div className={`relative w-full max-w-sm p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300 ${
            settings.theme === 'dark' ? 'bg-[#1a1c22] text-white border border-white/10' : 'bg-white text-black border border-black/10'
          }`}>
            <h3 className="text-xl font-bold mb-6">{isChangeMode ? t.newPassword : t.passwordPrompt}</h3>
            {isChangeMode ? (
              <div className="space-y-4">
                <input 
                  type="password" 
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full p-4 bg-black/5 dark:bg-white/5 rounded-xl border-none outline-none"
                  placeholder="Enter new password"
                />
                <button 
                  onClick={handleChangePassword}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold">
                  {t.confirm}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input 
                  type="password" 
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  className="w-full p-4 bg-black/5 dark:bg-white/5 rounded-xl border-none outline-none"
                  placeholder="••••••••"
                />
                <button 
                  onClick={handleAdminAuth}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold">
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}

function AdminBoard({ settings, collection, onPublish, adminPassword, setAdminPassword, existingPosts }: {
  settings: SettingsState;
  collection: Collection;
  onPublish: (p: Post) => void;
  adminPassword: string;
  setAdminPassword: (p: string) => void;
  existingPosts?: Post[];
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    seoTitle: '',
    image: '',
    type: 'postcard' as PostType,
    author: 'Saiful Islam',
    seriesName: ''
  });
  const t = TRANSLATIONS[settings.language];

  useEffect(() => {
    const handler = () => setIsVisible(true);
    window.addEventListener('ADMIN_ACCESS_GRANTED', handler);
    return () => window.removeEventListener('ADMIN_ACCESS_GRANTED', handler);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.image) {
      alert("Please fill all required fields");
      return;
    }

    const episodeNumber = collection === 'series' && existingPosts 
      ? existingPosts.filter((p: Post) => p.seriesName === formData.seriesName).length + 1
      : undefined;

    const newPost: Post = {
      id: Date.now().toString(),
      ...formData,
      collection,
      episodeNumber,
      date: new Date().toLocaleDateString(settings.language === 'en' ? 'en-US' : 'bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    onPublish(newPost);
    setIsVisible(false);
    setFormData({
      title: '',
      content: '',
      category: '',
      seoTitle: '',
      image: '',
      type: 'postcard',
      author: 'Saiful Islam',
      seriesName: ''
    });
  };

  if (!isVisible) return null;

  return (
    <div className={`p-8 rounded-[2rem] border animate-in slide-in-from-top-8 duration-500 mb-12 ${
      settings.theme === 'dark' ? 'bg-[#1a1c22] border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl'
    }`}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">New Post ({collection})</h2>
        <button onClick={() => setIsVisible(false)} className="text-rose-500 font-bold">{t.cancel}</button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collection === 'series' ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium opacity-60">{t.seriesName}</label>
              <input value={formData.seriesName} onChange={e => setFormData({ ...formData, seriesName: e.target.value })} className="w-full p-4 bg-black/5 dark:bg-white/5 rounded-xl border-none outline-none focus:ring-2 ring-indigo-500/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium opacity-60">{t.episodeName}</label>
              <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-4 bg-black/5 dark:bg-white/5 rounded-xl border-none outline-none focus:ring-2 ring-indigo-500/50" />
            </div>
          </>
        ) : (
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium opacity-60">{t.title}</label>
            <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-4 bg-black/5 dark:bg-white/5 rounded-xl border-none outline-none focus:ring-2 ring-indigo-500/50" />
          </div>
        )}

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium opacity-60">{t.content}</label>
          <textarea rows={6} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full p-4 bg-black/5 dark:bg-white/5 rounded-xl border-none outline-none focus:ring-2 ring-indigo-500/50" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium opacity-60">{t.category}</label>
          <input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-4 bg-black/5 dark:bg-white/5 rounded-xl border-none outline-none focus:ring-2 ring-indigo-500/50" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium opacity-60">{t.seoTitle}</label>
          <input value={formData.seoTitle} onChange={e => setFormData({ ...formData, seoTitle: e.target.value })} className="w-full p-4 bg-black/5 dark:bg-white/5 rounded-xl border-none outline-none focus:ring-2 ring-indigo-500/50" />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium opacity-60 block">{t.postType}</label>
          <div className="flex gap-4">
            <button type="button" onClick={() => setFormData({ ...formData, type: 'featured' })} className={`flex-1 py-3 rounded-xl font-bold transition-all border ${formData.type === 'featured' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-black/5 dark:bg-white/5 border-transparent'}`}>
              {t.featured}
            </button>
            <button type="button" onClick={() => setFormData({ ...formData, type: 'postcard' })} className={`flex-1 py-3 rounded-xl font-bold transition-all border ${formData.type === 'postcard' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-black/5 dark:bg-white/5 border-transparent'}`}>
              {t.postcard}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium opacity-60 block">{t.imageUpload}</label>
          <div className="flex gap-4 items-center">
            <input type="file" onChange={handleImageUpload} className="hidden" id="admin-file-upload" />
            <label htmlFor="admin-file-upload" className="px-6 py-3 bg-indigo-600/10 text-indigo-500 rounded-xl font-bold cursor-pointer hover:bg-indigo-600/20 transition-colors">Choose File</label>
            {formData.image && <img src={formData.image} className="w-16 h-16 rounded-lg object-cover" alt="Preview" />}
          </div>
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-600/20">
            {t.publish}
          </button>
        </div>
      </form>
    </div>
  );
}
