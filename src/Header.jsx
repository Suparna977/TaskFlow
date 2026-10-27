import { CheckIcon, MoonIcon, SunIcon } from './icons.jsx';

function Header({ theme, onToggleTheme }) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <CheckIcon size={24} />
        </span>
        <div>
          <h1>Taskflow</h1>
          <p>Your Personal Productivity Space</p>
        </div>
      </div>

      <div className="header-actions">
        <span className="header-date">{today}</span>
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${nextTheme} mode`}
          title={`Switch to ${nextTheme} mode`}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}

export default Header;
