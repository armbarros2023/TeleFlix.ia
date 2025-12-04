import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Label from '../components/ui/Label';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, UserType } from '../types';
import Select from '../components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

const formatters = {
    phone: (value: string) => value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{4})/, '$1-$2').slice(0, 15),
    cpf: (value: string) => value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').slice(0, 14),
    cnpj: (value: string) => value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2').slice(0, 18),
};

const initialFormState: Partial<User> & { password?: string } = {
    type: 'pessoaFisica',
    username: '',
    email: '',
    role: 'Técnico',
    phone: '',
    razaoSocial: '',
    cnpj: '',
    nomeCompleto: '',
    technicianIdNumber: '',
    cpf: '',
    rg: '',
    password: '',
};

const CreateUser: React.FC = () => {
    const { addUser } = useAppContext();
    const navigate = useNavigate();
    const [userType, setUserType] = useState<UserType>('pessoaFisica');
    const [formData, setFormData] = useState<Partial<User> & { password?: string }>(initialFormState);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUserTypeChange = (type: UserType) => {
        setUserType(type);
        setFormData({ ...initialFormState, type });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        const formatter = formatters[id as keyof typeof formatters];
        const formattedValue = formatter ? formatter(value) : value;

        setFormData(prev => ({ ...prev, [id]: formattedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (userType === 'pessoaJuridica' && (!formData.razaoSocial || !formData.cnpj)) {
            return alert('Razão Social e CNPJ são obrigatórios.');
        }
        if (userType === 'pessoaFisica' && (!formData.nomeCompleto || !formData.cpf)) {
            return alert('Nome Completo e CPF são obrigatórios.');
        }
        if (!formData.username || !formData.email || !formData.password) {
            return alert('Nome de usuário, e-mail e Senha são obrigatórios.');
        }
        if (formData.password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }
        
        setIsSubmitting(true);
        try {
            // A senha é enviada para a API simulada, mas não é armazenada no estado global.
            await addUser(formData as Omit<User, 'id' | 'status'>);
            alert('Usuário cadastrado com sucesso!');
            navigate('/users');
        } catch (error) {
            alert(`Falha ao cadastrar usuário: ${(error as Error).message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            <h1 className="text-3xl font-bold text-white">Cadastro de Usuário</h1>
            
            <fieldset disabled={isSubmitting}>
                <div className="flex items-center p-1 rounded-lg bg-muted w-max">
                    <Button type="button" onClick={() => handleUserTypeChange('pessoaFisica')} variant={userType === 'pessoaFisica' ? 'default' : 'ghost'} className="w-40">Pessoa Física</Button>
                    <Button type="button" onClick={() => handleUserTypeChange('pessoaJuridica')} variant={userType === 'pessoaJuridica' ? 'default' : 'ghost'} className="w-40">Pessoa Jurídica</Button>
                </div>

                <div className="space-y-6">
                    {userType === 'pessoaFisica' ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Dados Pessoais do Técnico</CardTitle>
                                <CardDescription>Informações de identificação e documentos.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                                    <Input id="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} required placeholder="Digite o nome completo" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cpf">CPF *</Label>
                                    <Input id="cpf" value={formData.cpf} onChange={handleChange} required placeholder="000.000.000-00"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rg">RG</Label>
                                    <Input id="rg" value={formData.rg} onChange={handleChange} placeholder="00.000.000-0"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="technicianIdNumber">Nº de Cadastro (Opcional)</Label>
                                    <Input id="technicianIdNumber" value={formData.technicianIdNumber} onChange={handleChange} placeholder="Ex: TEC-12345" />
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Dados da Empresa</CardTitle>
                                <CardDescription>Informações da empresa parceira ou terceirizada.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="razaoSocial">Razão Social *</Label>
                                    <Input id="razaoSocial" value={formData.razaoSocial} onChange={handleChange} required placeholder="Nome legal da empresa" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cnpj">CNPJ *</Label>
                                    <Input id="cnpj" value={formData.cnpj} onChange={handleChange} required placeholder="00.000.000/0000-00" />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Contato e Acesso ao Sistema</CardTitle>
                            <CardDescription>Defina o cargo e as credenciais de acesso do usuário.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="username">Nome de Usuário *</Label>
                                <Input id="username" value={formData.username} onChange={handleChange} required placeholder="ex: joao.silva" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail *</Label>
                                <Input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="exemplo@dominio.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefone de Contato</Label>
                                <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="(99) 99999-9999"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Cargo *</Label>
                                <Select id="role" value={formData.role} onChange={handleChange} required>
                                    <option value="Técnico">Técnico</option>
                                    <option value="Administrador">Administrador</option>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha *</Label>
                                <Input id="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Crie uma senha segura" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Digite a senha novamente" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </fieldset>

            <div className="fixed bottom-0 right-0 w-full lg:w-[calc(100%-16rem)] bg-card border-t border-border p-4 flex justify-end space-x-4">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={isSubmitting}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Spinner className="w-4 h-4 mr-2"/>}
                    {isSubmitting ? 'Salvando...' : 'Salvar Usuário'}
                </Button>
            </div>
        </form>
    );
};

export default CreateUser;