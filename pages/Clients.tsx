import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusCircle } from '../components/icons/IconComponents';
import Spinner from '../components/ui/Spinner';

const Clients: React.FC = () => {
    const { clients, isLoading } = useAppContext();
    const navigate = useNavigate();

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Spinner className="w-8 h-8 text-primary" />
                </div>
            );
        }

        if (clients.length === 0) {
            return (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
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
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cidade/UF</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Telefone Principal</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">E-mail</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {clients.map(client => (
                                <tr key={client.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{client.razaoSocial || client.nomeCompleto}</td>
                                    <td className="p-4 align-middle">{client.cnpj || client.cpf}</td>
                                    <td className="p-4 align-middle">{`${client.city}/${client.state}`}</td>
                                    <td className="p-4 align-middle">{client.phone || client.telefoneCelular}</td>
                                    <td className="p-4 align-middle">{client.email}</td>
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
                <h1 className="text-3xl font-bold text-white">Clientes</h1>
                 <Button onClick={() => navigate('/clients/new')}>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Novo Cliente
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Clientes</CardTitle>
                    <CardDescription>Gerencie as informações dos seus clientes.</CardDescription>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
};

export default Clients;