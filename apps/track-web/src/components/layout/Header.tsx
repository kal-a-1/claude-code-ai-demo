import { Button, Header } from '@heroui/react';
import { Link, useNavigate } from 'react-router-dom';

export function AppHeader() {
  const navigate = useNavigate();

  return (
    <Header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 w-full">
      <Link to="/" className="text-xl font-bold" style={{ color: '#2563eb' }}>
        ProTrack
      </Link>
      <Button variant="primary" onPress={() => navigate('/login')}>
        Login
      </Button>
    </Header>
  );
}
