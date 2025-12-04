import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { OSStatus, ServiceOrder } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from '../components/icons/IconComponents';
import Spinner from '../components/ui/Spinner';

const getStatusBadge = (status: OSStatus) => {
    switch (status) {
        case OSStatus.Pending:
            return 'bg-amber-100 text-amber-800 border-amber-200';
        case OSStatus.InProgress:
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case OSStatus.Completed:
            return 'bg-green-100 text-green-800 border-green-200';
        case OSStatus.Canceled:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const ServiceOrderList: React.FC = () => {
    const { serviceOrders, isLoading } = useAppContext();
    const navigate = useNavigate();

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Spinner className="w-8 h-8 text-primary" />
                </div>
            );
        }

        if (serviceOrders.length === 0) {
            return (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">Nenhuma ordem de serviço encontrada.</p>
                </div>
            );
        }

        return (
            <div className="border rounded-lg">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">OS Nº</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cliente</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Serviço</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data Agendada</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {serviceOrders.map(order => (
                                <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{order.serviceOrderNumber}</td>
                                    <td className="p-4 align-middle">{order.clientName}</td>
                                    <td className="p-4 align-middle">{order.serviceType}</td>
                                    <td className="p-4 align-middle">{new Date(order.scheduledDate).toLocaleString()}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Button variant="outline" size="sm" onClick={() => navigate(`/service-orders/edit/${order.id}`)}>
                                            Editar / Ver
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Ordens de Serviço</h1>
                 <Button onClick={() => navigate('/service-orders/new')}>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Criar Nova OS
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Todas as Ordens</CardTitle>
                    <CardDescription>Visualize e gerencie todas as ordens de serviço.</CardDescription>
                </CardHeader>
                <CardContent>
                   {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
};

export default ServiceOrderList;