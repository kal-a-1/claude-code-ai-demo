import { Button } from '@heroui/react';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-full px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-[#2563eb] no-underline">
          ProTrack
        </Link>
        <Button variant="primary" onPress={() => navigate('/login')}>
          Login
        </Button>
      </div>
    </header>
  );
}

export default Header;
