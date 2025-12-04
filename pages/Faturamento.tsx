import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAppContext } from '../hooks/useAppContext';
import { ServiceOrder, Quote, Invoice, OSStatus, QuoteStatus, InvoicePaymentStatus } from '../types';

type Tab = 'pending' | 'issued';

const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

const getPaymentStatusBadge = (status: InvoicePaymentStatus) => {
    switch (status) {
        case InvoicePaymentStatus.Pending: return 'bg-amber-100 text-amber-800 border-amber-200';
        case InvoicePaymentStatus.Paid: return 'bg-green-100 text-green-800 border-green-200';
        case InvoicePaymentStatus.Overdue: return 'bg-red-100 text-red-800 border-red-200';
        case InvoicePaymentStatus.Canceled: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const Faturamento: React.FC = () => {
    const { serviceOrders, quotes, invoices, isLoading } = useAppContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('pending');

    const pendingItems = useMemo(() => {
        const billableOS = serviceOrders.filter(os => os.status === OSStatus.Completed && !os.invoiceId);
        const billableQuotes = quotes.filter(q => q.status === QuoteStatus.Accepted && !q.invoiceId);
        
        return [
            ...billableOS.map(os => ({
                type: 'serviceOrder',
                id: os.id,
                number: os.serviceOrderNumber,
                clientName: os.clientName,
                date: os.completedAt || os.scheduledDate,
                value: 0, // In a real scenario, you'd calculate this. For now, it will be taken from quote items or manually entered.
                origin: os,
            })),
            ...billableQuotes.map(q => ({
                type: 'quote',
                id: q.id,
                number: q.quoteNumber,
                clientName: q.clientName,
                date: q.quoteDate,
                value: q.total,
                origin: q,
            })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [serviceOrders, quotes]);

    const renderPendingTable = () => {
        if (pendingItems.length === 0) {
            return <div className="text-center py-10"><p className="text-muted-foreground">Nenhum item pendente de faturamento.</p></div>;
        }
        return (
            <div className="border rounded-lg"><div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b"><tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left">Origem</th>
                        <th className="h-12 px-4 text-left">Número</th>
                        <th className="h-12 px-4 text-left">Cliente</th>
                        <th className="h-12 px-4 text-left">Data</th>
                        <th className="h-12 px-4 text-right">Valor</th>
                        <th className="h-12 px-4 text-center">Ações</th>
                    </tr></thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {pendingItems.map(item => (
                            <tr key={`${item.type}-${item.id}`} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4">{item.type === 'serviceOrder' ? 'Ordem de Serviço' : 'Orçamento'}</td>
                                <td className="p-4 font-medium">{item.number}</td>
                                <td className="p-4">{item.clientName}</td>
                                <td className="p-4">{formatDate(item.date)}</td>
                                <td className="p-4 text-right">{item.type === 'quote' ? formatCurrency(item.value) : 'A faturar'}</td>
                                <td className="p-4 text-center">
                                    <Button size="sm" onClick={() => navigate(`/finance/billing/new/${item.type}/${item.id}`)}>
                                        Faturar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div></div>
        );
    };
    
    const renderIssuedTable = () => {
        if (invoices.length === 0) {
            return <div className="text-center py-10"><p className="text-muted-foreground">Nenhuma fatura emitida.</p></div>;
        }
        return (
            <div className="border rounded-lg"><div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                     <thead className="[&_tr]:border-b"><tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left">NF-e Nº</th>
                        <th className="h-12 px-4 text-left">Cliente</th>
                        <th className="h-12 px-4 text-left">Emissão</th>
                        <th className="h-12 px-4 text-left">Vencimento</th>
                        <th className="h-12 px-4 text-right">Valor Total</th>
                        <th className="h-12 px-4 text-center">Status Pag.</th>
                        <th className="h-12 px-4 text-center">Ações</th>
                    </tr></thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {invoices.map(invoice => (
                            <tr key={invoice.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 font-medium">{invoice.invoiceNumber}</td>
                                <td className="p-4">{invoice.clientName}</td>
                                <td className="p-4">{formatDate(invoice.issueDate)}</td>
                                <td className="p-4">{formatDate(invoice.dueDate)}</td>
                                <td className="p-4 text-right">{formatCurrency(invoice.total)}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPaymentStatusBadge(invoice.paymentStatus)}`}>
                                        {invoice.paymentStatus}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <Button variant="outline" size="sm" onClick={() => navigate(`/finance/billing/view/${invoice.id}`)}>
                                        Ver Detalhes
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div></div>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Faturamento e Cobrança</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Gerenciar Faturamento</CardTitle>
                    <CardDescription>Emita notas fiscais e cobranças a partir de serviços finalizados e orçamentos aceitos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex border-b">
                        <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'pending' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>
                            Pendentes de Faturamento ({pendingItems.length})
                        </button>
                        <button onClick={() => setActiveTab('issued')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'issued' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>
                            Faturamentos Emitidos ({invoices.length})
                        </button>
                    </div>
                    <div className="pt-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64"><Spinner className="w-8 h-8 text-primary" /></div>
                        ) : (
                            activeTab === 'pending' ? renderPendingTable() : renderIssuedTable()
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Faturamento;