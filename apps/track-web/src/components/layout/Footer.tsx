import { Link } from '@heroui/react';

export function Footer(): JSX.Element {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-3">
        <p className="text-sm text-gray-500">© 2024 ProTrack Systems</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="text-sm text-gray-400">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-gray-400">
            Terms
          </Link>
          <Link href="/support" className="text-sm text-gray-400">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
