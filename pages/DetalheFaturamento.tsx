import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAppContext } from '../hooks/useAppContext';
import { Invoice, InvoicePaymentStatus, Client } from '../types';
import Input from '../components/ui/Input';

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

const DetalheFaturamento: React.FC = () => {
    const { invoices, clients, updateInvoiceStatus, isLoading } = useAppContext();
    const { invoiceId } = useParams<{ invoiceId: string }>();
    const navigate = useNavigate();

    const invoice = invoices.find(inv => inv.id === invoiceId);
    const client = clients.find(c => c.id === invoice?.clientId);
    
    const handleUpdateStatus = async (status: InvoicePaymentStatus) => {
        if (!invoice) return;
        try {
            await updateInvoiceStatus(invoice.id, status);
            alert(`Status da fatura atualizado para ${status}!`);
        } catch (error) {
            alert(`Falha ao atualizar status: ${(error as Error).message}`);
        }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner className="w-10 h-10 text-primary" /></div>;
    }
    
    if (!invoice || !client) {
        return <div className="text-center py-10"><p className="text-muted-foreground text-lg">Fatura não encontrada.</p><Button onClick={() => navigate('/finance/billing')} className="mt-4">Voltar</Button></div>;
    }

    const companyDetails = {
        name: 'TELFIX', address: 'Rua Exemplo, 123 - Centro, São Paulo/SP', phone: '(11) 5555-1234', email: 'contato@tecnicosemtelefonia.com.br', cnpj: '11.222.333/0001-44'
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Detalhes do Faturamento</h1>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => window.print()}>Imprimir</Button>
                    <Button onClick={() => navigate('/finance/billing')}>Voltar</Button>
                </div>
            </div>
            
            <div id="invoice-print-area">
                <Card>
                    <CardHeader className="p-6 border-b">
                        <div className="flex justify-between items-start">
                             <div>
                                <h2 className="text-2xl font-bold">{companyDetails.name}</h2>
                                <p className="text-muted-foreground text-sm">{companyDetails.address}</p>
                                <p className="text-muted-foreground text-sm">CNPJ: {companyDetails.cnpj}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-bold text-lg">NOTA FISCAL DE SERVIÇO ELETRÔNICA</h3>
                                <p className="font-mono">Nº {invoice.invoiceNumber}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="p-4 border rounded-md">
                               <p className="text-sm text-center text-muted-foreground">CHAVE DE ACESSO</p>
                               <p className="font-mono text-center tracking-wide">{invoice.nfeData.accessKey}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 border rounded-md">
                                    <h4 className="font-semibold mb-2 border-b pb-1">CLIENTE</h4>
                                    <p className="font-bold">{client.razaoSocial || client.nomeCompleto}</p>
                                    <p className="text-sm">{client.cnpj || client.cpf}</p>
                                    <p className="text-sm">{`${client.street}, ${client.number}`}</p>
                                    <p className="text-sm">{`${client.city} - ${client.state}, ${client.zipCode}`}</p>
                                </div>
                                 <div className="p-4 border rounded-md">
                                    <h4 className="font-semibold mb-2 border-b pb-1">INFORMAÇÕES</h4>
                                    <p className="text-sm"><strong>Emissão:</strong> {formatDate(invoice.issueDate)}</p>
                                    <p className="text-sm"><strong>Vencimento:</strong> {formatDate(invoice.dueDate)}</p>
                                    <p className="text-sm flex items-center"><strong>Status:</strong> <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full border ${getPaymentStatusBadge(invoice.paymentStatus)}`}>{invoice.paymentStatus}</span></p>
                                </div>
                            </div>
                            
                            <div>
                               <h4 className="font-semibold mb-2 border-b pb-1">ITENS / SERVIÇOS</h4>
                               <div className="border rounded-lg"><div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="bg-muted/50"><tr>
                                        <th className="h-10 px-4 text-left font-medium">Descrição</th>
                                        <th className="h-10 px-4 text-center font-medium">Qtd.</th>
                                        <th className="h-10 px-4 text-right font-medium">Preço Unit.</th>
                                        <th className="h-10 px-4 text-right font-medium">Subtotal</th>
                                    </tr></thead>
                                    <tbody>
                                        {invoice.items.map(item => (
                                            <tr key={item.id} className="border-b last:border-0">
                                                <td className="p-4 align-top">{item.description}</td>
                                                <td className="p-4 text-center align-top">{item.quantity}</td>
                                                <td className="p-4 text-right align-top">{formatCurrency(item.unitPrice)}</td>
                                                <td className="p-4 text-right align-top font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="font-bold bg-muted/50"><td colSpan={3} className="p-4 text-right">TOTAL</td><td className="p-4 text-right text-lg">{formatCurrency(invoice.total)}</td></tr>
                                    </tfoot>
                                </table>
                               </div></div>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold mb-2 border-b pb-1">COBRANÇA</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 border rounded-md space-y-3">
                                        <h5 className="font-semibold">Boleto Bancário</h5>
                                        <img src={invoice.paymentData.boleto.barcodeUrl} alt="Barcode" className="w-full" />
                                        <Input readOnly value={invoice.paymentData.boleto.linhaDigitavel} className="font-mono text-center text-sm" />
                                        <Button variant="outline" className="w-full" onClick={() => navigator.clipboard.writeText(invoice.paymentData.boleto.linhaDigitavel)}>Copiar Linha Digitável</Button>
                                    </div>
                                    <div className="p-4 border rounded-md space-y-3 text-center">
                                        <h5 className="font-semibold">PIX</h5>
                                        <img src={invoice.paymentData.pix.qrCodeUrl} alt="PIX QR Code" className="mx-auto" />
                                        <Button variant="outline" className="w-full" onClick={() => navigator.clipboard.writeText(invoice.paymentData.pix.copiaECola)}>PIX Copia e Cola</Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </CardContent>
                    <CardFooter className="p-6 border-t flex justify-end items-center space-x-2">
                        <span className="text-sm mr-auto text-muted-foreground">Ações Administrativas:</span>
                        <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(InvoicePaymentStatus.Canceled)}>Cancelar Fatura</Button>
                        <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800" onClick={() => handleUpdateStatus(InvoicePaymentStatus.Paid)}>Marcar como Paga</Button>
                    </CardFooter>
                </Card>
            </div>
            <style>{`
                @media print {
                    body > #root > div.flex, .text-3xl, .flex.justify-between.items-center {
                        display: none !important;
                    }
                     main { padding: 0 !important; margin: 0 !important; overflow: visible !important; }
                     body, #root, main, .bg-card, #invoice-print-area .bg-card, #invoice-print-area .bg-muted\\/50 { background: white !important; color: black !important; }
                     #invoice-print-area .border { border-color: #ccc !important; }
                     #invoice-print-area, #invoice-print-area .bg-card { box-shadow: none !important; border: none !important; padding: 0 !important; margin: 0 !important; }
                }
            `}</style>
        </div>
    );
};

export default DetalheFaturamento;