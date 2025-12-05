import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Phone, Lock, User, Google } from '../components/icons/IconComponents';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Falha no login. Verifique suas credenciais.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      // Simulate login with the admin user for demo purposes
      await login('admin@teleflix.com.br', '123456');
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Falha no login com Google.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 to-blue-800 dark:from-slate-900 dark:to-blue-900 font-sans p-4">
      <div className="flex items-center mb-6 text-white">
        <Phone className="w-10 h-10" />
        <div className="ml-3">
          <span className="text-lg font-medium text-orange-500 block leading-tight">SISTEMA</span>
          <h1 className="text-2xl font-bold leading-tight">TELFIX</h1>
        </div>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Acesso ao Sistema</CardTitle>
          <CardDescription>Use suas credenciais para entrar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="ex: admin@teleflix.com.br"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="ex: 123456"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
              {isLoading ? <Spinner className="w-5 h-5 mr-2" /> : null}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                OU
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading}>
            {isGoogleLoading ? (
              <Spinner className="w-5 h-5 mr-2" />
            ) : (
              <Google className="w-5 h-5 mr-2" />
            )}
            {isGoogleLoading ? 'Entrando...' : 'Entrar com Google'}
          </Button>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <p className="text-xs text-muted-foreground text-center w-full">Para teste, use usuário `admin@teleflix.com.br` e senha `123456`.</p>
        </CardFooter>
      </Card>
      <div className="mt-8 text-center">
        <Button
          variant="ghost"
          className="text-white/50 hover:text-white hover:bg-white/10"
          onClick={() => {
            setUsername('admin@teleflix.com.br');
            setPassword('123456');
            // Optional: Auto-submit
            // setTimeout(() => document.querySelector('form')?.requestSubmit(), 100);
          }}
        >
          Preencher Credenciais de Teste
        </Button>
      </div>
    </div>
  );
};

export default Login;