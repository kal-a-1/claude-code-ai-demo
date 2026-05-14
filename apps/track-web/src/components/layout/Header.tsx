import { Button } from '@heroui/react';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <header className="mx-auto flex h-16 w-full items-center justify-between px-6">
        <Link to="/" className="text-xl font-bold" style={{ color: '#2563eb' }}>
          ProTrack
        </Link>
        <Button variant="primary" onPress={() => navigate('/login')}>
          Login
        </Button>
      </header>
    </nav>
  );
}
