
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { Train, LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-train-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Train className="h-6 w-6" />
          <h1 className="text-xl font-bold">Train Seat Reservation</h1>
        </div>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>{user.username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout} className="text-white border-white hover:bg-white/20">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <div>
            {/* No actions to show when not logged in */}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
