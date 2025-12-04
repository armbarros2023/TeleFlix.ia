import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusCircle } from '../components/icons/IconComponents';
import Spinner from '../components/ui/Spinner';
import { MaintenanceStatus, MaintenanceContract } from '../types';

const getStatusBadge = (status: MaintenanceStatus) => {
    switch (status) {
        case MaintenanceStatus.Active:
            return 'bg-green-100 text-green-800 border-green-200';
        case MaintenanceStatus.Expired:
            return 'bg-amber-100 text-amber-800 border-amber-200';
        case MaintenanceStatus.Canceled:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

const Maintenance: React.FC = () => {
    const { maintenanceContracts, isLoading } = useAppContext();
    const navigate = useNavigate();

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Spinner className="w-8 h-8 text-primary" />
                </div>
            );
        }

        if (maintenanceContracts.length === 0) {
            return (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">Nenhum contrato de manutenção encontrado.</p>
                </div>
            );
        }

        return (
            <div className="border rounded-lg">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contrato</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cliente</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tipo</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Vigência</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Valor Mensal</th>
                                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {maintenanceContracts.map((contract: MaintenanceContract) => (
                                <tr key={contract.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{contract.contractNumber}</td>
                                    <td className="p-4 align-middle">{contract.clientName}</td>
                                    <td className="p-4 align-middle">{contract.type}</td>
                                    <td className="p-4 align-middle">{`${formatDate(contract.startDate)} a ${formatDate(contract.endDate)}`}</td>
                                    <td className="p-4 align-middle text-right">{formatCurrency(contract.monthlyValue)}</td>
                                    <td className="p-4 align-middle text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(contract.status)}`}>
                                            {contract.status}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Button variant="outline" size="sm">Ver Detalhes</Button>
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
                <h1 className="text-3xl font-bold text-white">Contratos de Manutenção</h1>
                <Button onClick={() => navigate('/maintenance/new')}>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Novo Contrato
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Contratos</CardTitle>
                    <CardDescription>Gerencie todos os contratos de manutenção recorrente.</CardDescription>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
};

export default Maintenance;
