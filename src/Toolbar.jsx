import { useEffect, useRef } from 'react';
import { CloseIcon, SearchIcon } from './icons.jsx';
import { CATEGORIES, SORT_OPTIONS } from './utils.js';

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

function Toolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  counts,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
}) {
  const searchRef = useRef(null);

  // Press "/" anywhere to jump to search.
  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName;
      const typing =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        document.activeElement?.isContentEditable;

      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="toolbar">
      <div className="search-box">
        <span className="search-icon">
          <SearchIcon size={18} />
        </span>
        <input
          ref={searchRef}
          type="search"
          className="field"
          placeholder="Search tasks…  (press / to focus)"
          aria-label="Search tasks"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onSearchChange('');
          }}
        />
        {search && (
          <button
            type="button"
            className="search-clear"
            onClick={() => {
              onSearchChange('');
              searchRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>

      <div className="toolbar-row">
        <div className="status-tabs" role="group" aria-label="Filter by status">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={statusFilter === tab.value ? 'active' : ''}
              aria-pressed={statusFilter === tab.value}
              onClick={() => onStatusChange(tab.value)}
            >
              {tab.label}
              <span className="tab-count">{counts[tab.value]}</span>
            </button>
          ))}
        </div>

        <div className="toolbar-selects">
          <label className="select-field">
            <span className="visually-hidden">Filter by category</span>
            <select
              className="field"
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className="select-field">
            <span className="visually-hidden">Sort tasks by</span>
            <select
              className="field"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
