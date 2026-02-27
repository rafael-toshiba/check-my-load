import { useState } from 'react';
import { Eye, EyeOff, User, Lock, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';

const TEST_USER = { username: 'admin', password: '1234' };

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = 'Campo obrigatório';
    if (!password.trim()) newErrors.password = 'Campo obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (username === TEST_USER.username && password === TEST_USER.password) {
      toast.success('Login realizado com sucesso!');
      navigate('/cargo');
    } else {
      toast.error('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="items-center space-y-3 pb-2">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center">
            <Package className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Check My Load</h1>
            <p className="text-sm text-muted-foreground mt-1">Faça login para continuar</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setErrors(prev => ({ ...prev, username: undefined })); }}
                  className={`pl-10 ${errors.username ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
              </div>
              {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
                  className={`pl-10 pr-10 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
