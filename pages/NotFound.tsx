
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold text-card-foreground mt-4">Página não encontrada</h2>
      <p className="text-muted-foreground mt-2">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link to="/dashboard">
        <Button className="mt-6">Voltar para o Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFound;
