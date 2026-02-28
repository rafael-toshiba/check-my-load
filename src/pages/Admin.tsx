import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, LogOut, Activity, Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Carga {
  id: string;
  placa: string;
  status: string;
  atualizado_em: string;
}

interface Usuario {
  id: number;
  nome: string;
  usuario: string;
  matricula: string;
  perfil: string;
  ativo: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const [cargas, setCargas] = useState<Carga[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    usuario: '',
    matricula: '',
    senha: '',
    perfil: 'conferente',
    ativo: true
  });

  const fetchAdminData = async () => {
    try {
      const [resCargas, resUsuarios] = await Promise.all([
        fetch('/api-local/admin/cargas'),
        fetch('/api-local/admin/usuarios')
      ]);

      if (resCargas.ok) setCargas(await resCargas.json());
      if (resUsuarios.ok) setUsuarios(await resUsuarios.json());
    } catch (error) {
      console.error('Erro ao carregar dados do admin:', error);
      toast.error('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario_logado');
    navigate('/');
  };

  const formatarData = (dataIso: string) => {
    if (!dataIso) return '-';
    return new Date(dataIso).toLocaleString('pt-BR');
  };

  // Abre o modal para NOVO usuário
  const handleOpenNewUser = () => {
    setEditingUserId(null);
    setFormData({ nome: '', usuario: '', matricula: '', senha: '', perfil: 'conferente', ativo: true });
    setIsModalOpen(true);
  };

  // Abre o modal para EDITAR usuário
  const handleOpenEditUser = (user: Usuario) => {
    setEditingUserId(user.id);
    setFormData({
      nome: user.nome,
      usuario: user.usuario,
      matricula: user.matricula || '',
      senha: '', // Deixa vazio para não alterar, a menos que digite algo
      perfil: user.perfil,
      ativo: user.ativo
    });
    setIsModalOpen(true);
  };

  // Salva o formulário (Criar ou Editar)
  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEditing = editingUserId !== null;
    const url = isEditing ? `/api-local/admin/usuarios/${editingUserId}` : '/api-local/admin/usuarios';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.sucesso) {
        toast.success(isEditing ? 'Utilizador atualizado!' : 'Utilizador criado com sucesso!');
        setIsModalOpen(false);
        fetchAdminData();
      } else {
        toast.error(data.error || 'Erro ao processar utilizador');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao conectar com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="text-sm text-muted-foreground">Gestão de Cargas e Equipe</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </header>

      <Tabs defaultValue="cargas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cargas" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Visão de Cargas
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Gestão de Utilizadores
          </TabsTrigger>
        </TabsList>

        {/* ---------- ABA DE CARGAS ---------- */}
        <TabsContent value="cargas">
          <Card>
            <CardHeader>
              <CardTitle>Status das Cargas</CardTitle>
              <CardDescription>Acompanhe o progresso das conferências em tempo real.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">A carregar cargas...</p>
              ) : cargas.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma carga sincronizada ou finalizada ainda.</p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ordem</TableHead>
                        <TableHead>Placa</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Última Atualização</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cargas.map((carga) => (
                        <TableRow key={carga.id}>
                          <TableCell className="font-medium">#{carga.id}</TableCell>
                          <TableCell>{carga.placa || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={carga.status === 'finalizada' ? 'default' : 'secondary'}>
                              {carga.status === 'finalizada' ? 'Finalizada' : 'Em Andamento'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{formatarData(carga.atualizado_em)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------- ABA DE UTILIZADORES ---------- */}
        <TabsContent value="usuarios">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Equipa</CardTitle>
                <CardDescription>Faça a gestão dos acessos do sistema.</CardDescription>
              </div>
              <Button onClick={handleOpenNewUser}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Utilizador
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">A carregar equipa...</p>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Utilizador</TableHead>
                        <TableHead>Matrícula</TableHead>
                        <TableHead>Perfil</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usuarios.map((user) => (
                        <TableRow key={user.id} className={!user.ativo ? "opacity-60 bg-muted/30" : ""}>
                          <TableCell className="font-medium">{user.nome}</TableCell>
                          <TableCell>{user.usuario}</TableCell>
                          <TableCell>{user.matricula || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={user.perfil === 'admin' ? 'destructive' : 'outline'}>
                              {user.perfil === 'admin' ? 'Admin' : 'Conferente'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.ativo ? (
                              <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>
                            ) : (
                              <Badge variant="secondary">Inativo</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenEditUser(user)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ---------- MODAL DE UTILIZADOR (CRIAR/EDITAR) ---------- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmitUser}>
            <DialogHeader>
              <DialogTitle>{editingUserId ? 'Editar Utilizador' : 'Adicionar Utilizador'}</DialogTitle>
              <DialogDescription>
                {editingUserId ? 'Altere os dados ou inative este utilizador.' : 'Preencha os dados do novo membro da equipa.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Maria Silva"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usuario">Login *</Label>
                  <Input
                    id="usuario"
                    value={formData.usuario}
                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value.toLowerCase() })}
                    placeholder="Ex: maria.silva"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input
                    id="matricula"
                    value={formData.matricula}
                    onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                    placeholder="Ex: 0003"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">{editingUserId ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha *'}</Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  required={!editingUserId} // Só é obrigatório se for um usuário novo
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="perfil">Perfil de Acesso</Label>
                  <Select
                    value={formData.perfil}
                    onValueChange={(val) => setFormData({ ...formData, perfil: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conferente">Conferente</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingUserId && (
                  <div className="space-y-2">
                    <Label htmlFor="ativo">Status</Label>
                    <Select
                      value={formData.ativo ? 'true' : 'false'}
                      onValueChange={(val) => setFormData({ ...formData, ativo: val === 'true' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Ativo</SelectItem>
                        <SelectItem value="false">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'A guardar...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;