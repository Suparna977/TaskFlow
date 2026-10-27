import { useRef } from 'react';
import { DownloadIcon, UploadIcon } from './icons.jsx';
import { parseImport } from './utils.js';

function Footer({ taskCount, onExport, onImport, onNotify }) {
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow choosing the same file again later
    if (!file) return;

    try {
      onImport(parseImport(await file.text()));
    } catch {
      onNotify("That file isn't a valid Taskflow export.");
    }
  }

  return (
    <footer className="app-footer">
      <span>Tasks are saved automatically in this browser.</span>

      <div className="footer-actions">
        <button
          type="button"
          className="btn btn-sm"
          onClick={onExport}
          disabled={taskCount === 0}
        >
          <DownloadIcon size={16} />
          Export
        </button>

        <button
          type="button"
          className="btn btn-sm"
          onClick={() => fileRef.current?.click()}
        >
          <UploadIcon size={16} />
          Import
        </button>

        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="visually-hidden"
          tabIndex={-1}
          aria-hidden="true"
          onChange={handleFile}
        />
      </div>
    </footer>
  );
}

export default Footer;
