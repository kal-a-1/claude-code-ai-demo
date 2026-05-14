import { Button } from '@heroui/react';
import { Link, useNavigate } from 'react-router-dom';

export function Header(): JSX.Element {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold" style={{ color: '#2563eb' }}>
          ProTrack
        </Link>
        <Button variant="primary" onPress={() => navigate('/login')}>
          Login
        </Button>
      </div>
    </nav>
  );
}
