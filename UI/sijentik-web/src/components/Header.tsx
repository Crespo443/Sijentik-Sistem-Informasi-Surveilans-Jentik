import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  
  // Parse user info from local storage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || 'Pengguna';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-text-muted hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        
        <div className="hidden sm:block">
          <h2 className="font-heading text-base md:text-lg font-bold text-text-main tracking-tight leading-none mb-0.5 truncate max-w-37.5 md:max-w-none">
            Selamat Datang, {userName} 👋
          </h2>
          <div className="flex items-center gap-2 text-text-muted text-[10px] md:text-xs">
            <span className="material-symbols-outlined text-[12px] md:text-[14px]">calendar_today</span>
            <span>{today}</span>
          </div>
        </div>

        {/* Brand for mobile when sidebar is closed */}
        <div className="flex lg:hidden items-center gap-2 sm:hidden">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-[18px]">pest_control</span>
          </div>
          <span className="font-heading font-bold text-base text-text-main">SIJENTIK</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-muted hover:text-text-main hover:bg-slate-100 rounded transition-colors">
          <span className="material-symbols-outlined text-[18px]">help</span>
          Help Guide
        </button>
        <div className="hidden md:block h-8 w-px bg-border-subtle"></div>
        <div className="relative">
          <button aria-label="Notifications" className="relative p-2 text-text-muted hover:bg-slate-100 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[20px] md:text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 md:w-2.5 md:h-2.5 bg-danger rounded-full border-2 border-white"></span>
          </button>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-3 md:px-4 py-1.5 rounded text-sm font-medium hover:bg-red-100 transition-colors shadow-sm ring-1 ring-red-200"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="hidden xs:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
