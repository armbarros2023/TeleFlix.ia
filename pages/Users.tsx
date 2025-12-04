import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { User } from '../types';
import Spinner from '../components/ui/Spinner';

const getStatusBadge = (status: 'Ativo' | 'Inativo') => {
    switch (status) {
        case 'Ativo':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'Inativo':
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const Users: React.FC = () => {
    const { users, isLoading } = useAppContext();
    const navigate = useNavigate();

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Spinner className="w-8 h-8 text-primary" />
                </div>
            );
        }

        if (users.length === 0) {
            return (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
                </div>
            );
        }

        return (
            <div className="border rounded-lg">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nome / Razão Social</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">CPF / CNPJ</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">E-mail</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Telefone</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cargo</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {users.map((user: User) => (
                                <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{user.nomeCompleto || user.razaoSocial}</td>
                                    <td className="p-4 align-middle">{user.cpf || user.cnpj || '---'}</td>
                                    <td className="p-4 align-middle">{user.email}</td>
                                    <td className="p-4 align-middle">{user.phone || '---'}</td>
                                    <td className="p-4 align-middle">{user.role}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Usuários e Técnicos</h1>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Usuários</CardTitle>
                    <CardDescription>Gerencie os usuários, técnicos e empresas parceiras com acesso ao sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                     {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
};

export default Users;
