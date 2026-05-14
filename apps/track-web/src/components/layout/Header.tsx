import { Button } from '@heroui/react';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <nav className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-blue-600 no-underline">
          ProTrack
        </Link>
        <Button variant="primary" onPress={() => navigate('/login')}>
          Login
        </Button>
      </nav>
    </header>
  );
}

export default Header;
