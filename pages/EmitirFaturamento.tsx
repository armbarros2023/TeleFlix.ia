import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAppContext } from '../hooks/useAppContext';
import { ServiceOrder, Quote, QuoteItem, Client } from '../types';
import { User, Phone, Mail, Building2 } from '../components/icons/IconComponents';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import Textarea from '../components/ui/Textarea';
import { Trash2 } from '../components/icons/IconComponents';

const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const parseCurrency = (value: string): number => Number(value.replace(/[^0-9,-]+/g,"").replace(",", ".")) || 0;

const EmitirFaturamento: React.FC = () => {
    const { serviceOrders, quotes, clients, addInvoice, isLoading } = useAppContext();
    const navigate = useNavigate();
    const { originType, originId } = useParams<{ originType: 'serviceOrder' | 'quote', originId: string }>();

    const [sourceDoc, setSourceDoc] = useState<ServiceOrder | Quote | null>(null);
    const [client, setClient] = useState<Client | null>(null);
    const [items, setItems] = useState<QuoteItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        if (isLoading) return;
        let doc: ServiceOrder | Quote | undefined;
        if (originType === 'serviceOrder') {
            doc = serviceOrders.find(os => os.id === originId);
        } else {
            doc = quotes.find(q => q.id === originId);
        }

        if (!doc) {
            alert("Documento de origem não encontrado.");
            navigate('/finance/billing');
            return;
        }

        setSourceDoc(doc);
        const docClient = clients.find(c => c.id === doc!.clientId);
        setClient(docClient || null);

        if (originType === 'quote') {
            setItems((doc as Quote).items);
        } else {
            const serviceOrderDoc = doc as ServiceOrder;
            setItems([{
                id: `item-${Date.now()}`,
                description: `Serviço referente à OS #${serviceOrderDoc.serviceOrderNumber}: ${serviceOrderDoc.serviceType}`,
                quantity: 1,
                unitPrice: 0,
            }]);
        }
    }, [originType, originId, serviceOrders, quotes, clients, isLoading, navigate]);

    const total = useMemo(() => items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0), [items]);

    const handleItemChange = (id: string, field: keyof Omit<QuoteItem, 'id'>, value: string) => {
        const newItems = items.map(item => {
            if (item.id === id) {
                const updatedValue = (field === 'quantity' || field === 'unitPrice') ? parseCurrency(value) : value;
                return { ...item, [field]: updatedValue };
            }
            return item;
        });
        setItems(newItems);
    };

    const handleRemoveItem = (id: string) => setItems(items.filter(item => item.id !== id));
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sourceDoc || items.some(item => !item.description || item.unitPrice <= 0)) {
            alert("Preencha a descrição e o valor de todos os itens antes de faturar.");
            return;
        }
        setIsSubmitting(true);
        try {
            const newInvoice = await addInvoice({
                originId: sourceDoc.id,
                originType: originType!,
                items,
                total,
            });
            alert('Faturamento gerado com sucesso!');
            navigate(`/finance/billing/view/${newInvoice.id}`);
        } catch (error) {
            alert(`Falha ao gerar faturamento: ${(error as Error).message}`);
            setIsSubmitting(false);
        }
    };
    
    if (isLoading || !sourceDoc || !client) {
        return <div className="flex justify-center items-center h-64"><Spinner className="w-10 h-10 text-primary" /></div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            <h1 className="text-3xl font-bold text-white">Emitir Faturamento e Cobrança</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Origem do Faturamento</CardTitle>
                    <CardDescription>
                        Faturamento gerado a partir d{originType === 'quote' ? 'o Orçamento' : 'a Ordem de Serviço'} nº 
                        <strong> {originType === 'quote' ? (sourceDoc as Quote).quoteNumber : (sourceDoc as ServiceOrder).serviceOrderNumber}</strong>.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 border rounded-lg bg-secondary/50 dark:bg-slate-800/60">
                         <h3 className="font-bold text-lg mb-2">{client.razaoSocial || client.nomeCompleto}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            <p className="flex items-center"><Building2 className="w-4 h-4 mr-2" />{client.cnpj || client.cpf}</p>
                            <p className="flex items-center"><User className="w-4 h-4 mr-2" />Contato: {client.contatoPrincipal || client.nomeCompleto}</p>
                            <p className="flex items-center"><Mail className="w-4 h-4 mr-2" />{client.email}</p>
                            <p className="flex items-center"><Phone className="w-4 h-4 mr-2" />{client.phone || client.telefoneCelular}</p>
                         </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Itens da Nota Fiscal</CardTitle>
                    <CardDescription>Confira, edite ou adicione os itens que serão faturados.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <table className="w-full text-sm">
                             <thead className="bg-muted/50"><tr>
                                <th className="p-3 text-left font-medium w-2/4">Descrição *</th>
                                <th className="p-3 text-left font-medium w-1/6">Quantidade *</th>
                                <th className="p-3 text-left font-medium w-1/6">Preço Unit. *</th>
                                <th className="p-3 text-right font-medium w-1/6">Subtotal</th>
                                <th className="p-3 text-center font-medium">Ação</th>
                            </tr></thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id} className="border-b last:border-0">
                                        <td className="p-2"><Textarea value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} className="min-h-[40px]" /></td>
                                        <td className="p-2"><Input type="number" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} /></td>
                                        <td className="p-2"><Input value={item.unitPrice.toFixed(2).replace('.', ',')} onChange={e => handleItemChange(item.id, 'unitPrice', e.target.value)} /></td>
                                        <td className="p-2 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                                        <td className="p-2 text-center"><Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}><Trash2 className="h-5 w-5 text-destructive" /></Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Resumo Financeiro</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center text-2xl font-bold text-primary">
                            <span>TOTAL A FATURAR</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="fixed bottom-0 right-0 w-full lg:w-[calc(100%-16rem)] bg-card border-t border-border p-4 flex justify-end space-x-4">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={isSubmitting}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Spinner className="w-4 h-4 mr-2" /> : null}
                    {isSubmitting ? 'Gerando...' : 'Gerar NF-e e Cobrança'}
                </Button>
            </div>
        </form>
    );
};

export default EmitirFaturamento;