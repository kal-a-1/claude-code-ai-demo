import { Link } from '@heroui/react';

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-6">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col items-center gap-3">
        <p className="text-sm text-gray-500">© 2024 ProTrack Systems</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="text-sm text-gray-500">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-gray-500">
            Terms
          </Link>
          <Link href="/support" className="text-sm text-gray-500">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
