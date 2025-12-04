

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import { Bell, LogOut, Sun, Moon } from '../icons/IconComponents';

const Header: React.FC = () => {
    const { logout, theme, toggleTheme } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-20 bg-card border-b border-border flex items-center justify-end px-6">
            <div className="flex items-center space-x-4">
                <Button onClick={toggleTheme} variant="ghost" size="icon">
                    <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
                <button className="relative text-muted-foreground hover:text-card-foreground">
                    <Bell className="h-6 w-6"/>
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </button>
                <div className="w-px h-8 bg-border"></div>
                <Button onClick={handleLogout} variant="ghost" size="sm">
                    <LogOut className="w-5 h-5 mr-2" />
                    Sair
                </Button>
            </div>
        </header>
    );
};

export default Header;