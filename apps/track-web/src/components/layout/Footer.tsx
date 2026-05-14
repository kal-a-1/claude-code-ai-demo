import { Link } from '@heroui/react';

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-6">
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-gray-500">© 2024 ProTrack Systems</p>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-sm text-gray-400 hover:text-gray-600">
            Privacy
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="#" className="text-sm text-gray-400 hover:text-gray-600">
            Terms
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="#" className="text-sm text-gray-400 hover:text-gray-600">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
