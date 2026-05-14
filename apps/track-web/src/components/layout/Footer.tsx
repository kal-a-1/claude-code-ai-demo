import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-gray-500">© 2024 ProTrack Systems</p>
        <nav className="flex gap-4">
          <Link
            to="/privacy"
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Terms
          </Link>
          <Link
            to="/support"
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Support
          </Link>
        </nav>
      </div>
    </footer>
  );
}
