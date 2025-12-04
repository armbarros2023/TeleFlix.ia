import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Label from '../components/ui/Label';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import { PlusCircle, Trash2 } from '../components/icons/IconComponents';
import { QuoteItem, QuoteStatus } from '../types';
import Spinner from '../components/ui/Spinner';

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const parseCurrency = (value: string): number => {
    return Number(value.replace(/[^0-9,-]+/g,"").replace(",", ".")) || 0;
};

const CreateQuote: React.FC = () => {
    const { clients, addQuote, quotes, updateQuote } = useAppContext();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);

    const [clientId, setClientId] = useState('');
    const [validUntil, setValidUntil] = useState('');
    const [items, setItems] = useState<QuoteItem[]>([]);
    const [discount, setDiscount] = useState(0);
    const [observations, setObservations] = useState('');
    const [commercialConditions, setCommercialConditions] = useState('Garantia: 12 meses para equipamentos e 90 dias para serviços.\nForma de Pagamento: 50% de sinal e 50% na conclusão.');
    const [status, setStatus] = useState<QuoteStatus>(QuoteStatus.Draft);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0), [items]);
    const total = useMemo(() => subtotal - discount, [subtotal, discount]);
    
    useEffect(() => {
        if (isEditMode && quotes.length > 0) {
            const quoteToEdit = quotes.find(q => q.id === id);
            if (quoteToEdit) {
                setClientId(quoteToEdit.clientId);
                setValidUntil(new Date(quoteToEdit.validUntil).toISOString().split('T')[0]);
                setItems(quoteToEdit.items);
                setDiscount(quoteToEdit.discount);
                setObservations(quoteToEdit.observations);
                setCommercialConditions(quoteToEdit.commercialConditions);
                setStatus(quoteToEdit.status);
            } else {
                alert("Orçamento não encontrado!");
                navigate('/quotes');
            }
        } else {
             // Set default validUntil date for new quotes
            const today = new Date();
            const thirtyDaysFromNow = new Date(today.setDate(today.getDate() + 30)).toISOString().split('T')[0];
            setValidUntil(thirtyDaysFromNow);
        }
    }, [id, isEditMode, quotes, navigate]);
    
    useEffect(() => {
        if (!isEditMode && clients.length > 0 && !clientId) {
            setClientId(clients[0].id);
        }
    }, [clients, clientId, isEditMode]);


    const handleAddItem = () => {
        setItems([...items, { id: `item-${Date.now()}`, description: '', quantity: 1, unitPrice: 0 }]);
    };
    
    const handleRemoveItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientId || !validUntil || items.length === 0) {
            alert("Por favor, selecione um cliente e adicione pelo menos um item ao orçamento.");
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEditMode) {
                const originalQuote = quotes.find(q => q.id === id);
                if (!originalQuote) throw new Error("Orçamento original não encontrado.");

                await updateQuote({
                    ...originalQuote,
                    clientId,
                    validUntil: new Date(validUntil).toISOString(),
                    items,
                    subtotal,
                    discount,
                    total,
                    observations,
                    commercialConditions,
                    status,
                });
                alert('Orçamento atualizado com sucesso!');

            } else {
                 await addQuote({
                    clientId,
                    quoteDate: new Date().toISOString(),
                    validUntil: new Date(validUntil).toISOString(),
                    items,
                    subtotal,
                    discount,
                    total,
                    observations,
                    commercialConditions
                });
                alert('Orçamento criado com sucesso!');
            }
            navigate('/quotes');
        } catch (error) {
            alert(`Falha ao salvar orçamento: ${(error as Error).message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const predefinedServices = [
        'Instalação de Câmeras de Vigilância',
        'Configuração de Central Telefônica',
        'Suporte Técnico Presencial',
        'Implantação de Telefonia em Nuvem',
        'Instalação de Rede de Dados e Telefonia',
    ];

    const addPredefinedService = (service: string) => {
        setItems([...items, { id: `item-${Date.now()}`, description: service, quantity: 1, unitPrice: 0 }]);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            <h1 className="text-3xl font-bold text-white">{isEditMode ? 'Editar Orçamento' : 'Criar Novo Orçamento'}</h1>

            <fieldset disabled={isSubmitting}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informações Gerais</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="client">Cliente *</Label>
                            <Select id="client" value={clientId} onChange={e => setClientId(e.target.value)} required>
                                <option value="" disabled>Selecione um cliente</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.razaoSocial || client.nomeCompleto}</option>
                                ))}
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="validUntil">Válido Até *</Label>
                            <Input id="validUntil" type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} required />
                        </div>
                         {isEditMode && (
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="status">Status do Orçamento *</Label>
                                <Select id="status" value={status} onChange={e => setStatus(e.target.value as QuoteStatus)} required>
                                    {Object.values(QuoteStatus).map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </Select>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Itens do Orçamento</CardTitle>
                        <CardDescription>Adicione serviços e produtos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-sm font-medium mr-2">Adicionar rápido:</span>
                            {predefinedServices.map(service => (
                                <Button key={service} type="button" variant="outline" size="sm" onClick={() => addPredefinedService(service)}>
                                    {service}
                                </Button>
                            ))}
                        </div>
                        <div className="border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="p-3 text-left font-medium w-[45%]">Descrição</th>
                                        <th className="p-3 text-left font-medium w-[10%]">Quantidade</th>
                                        <th className="p-3 text-left font-medium w-[15%]">Preço Unit.</th>
                                        <th className="p-3 text-right font-medium w-[20%]">Subtotal</th>
                                        <th className="p-3 text-center font-medium w-[10%]">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={item.id} className="border-b last:border-0">
                                            <td className="p-2">
                                                <Textarea value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} placeholder="Descrição do serviço ou produto" className="min-h-[40px]" />
                                            </td>
                                            <td className="p-2">
                                                <Input type="number" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} placeholder="Qtde" />
                                            </td>
                                            <td className="p-2">
                                                <Input value={item.unitPrice.toFixed(2).replace('.', ',')} onChange={e => handleItemChange(item.id, 'unitPrice', e.target.value)} placeholder="R$ 0,00" />
                                            </td>
                                            <td className="p-2 text-right font-medium">
                                                {formatCurrency(item.quantity * item.unitPrice)}
                                            </td>
                                            <td className="p-2 text-center">
                                                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                                    <Trash2 className="h-5 w-5 text-destructive" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Button type="button" variant="outline" onClick={handleAddItem} className="mt-4">
                            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Item
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Observações e Condições</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="observations">Observações Gerais</Label>
                                <Textarea id="observations" value={observations} onChange={e => setObservations(e.target.value)} placeholder="Detalhes adicionais, escopo, etc." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="commercialConditions">Condições Comerciais</Label>
                                <Textarea id="commercialConditions" value={commercialConditions} onChange={e => setCommercialConditions(e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumo Financeiro</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-lg">
                                <span>Subtotal</span>
                                <span className="font-semibold">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <Label htmlFor="discount" className="text-lg">Desconto (R$)</Label>
                                <Input id="discount" type="text" value={discount.toFixed(2).replace('.', ',')} onChange={e => setDiscount(parseCurrency(e.target.value))} className="w-32 text-right" />
                            </div>
                            <div className="border-t my-2"></div>
                            <div className="flex justify-between items-center text-2xl font-bold text-primary">
                                <span>TOTAL</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </fieldset>
            
            <div className="fixed bottom-0 right-0 w-full lg:w-[calc(100%-16rem)] bg-card border-t border-border p-4 flex justify-end space-x-4">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={isSubmitting}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Spinner className="w-4 h-4 mr-2" />}
                    {isSubmitting ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Salvar Orçamento')}
                </Button>
            </div>
        </form>
    );
};

export default CreateQuote;
