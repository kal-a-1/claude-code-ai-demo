import { Link } from '@heroui/react';

export function Footer() {
  return (
    <footer className="w-full py-6 border-t border-gray-200 bg-white">
      <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
        <p>© 2024 ProTrack Systems</p>
        <div className="flex gap-4">
          <Link
            href="/privacy"
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Terms
          </Link>
          <Link
            href="/support"
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
