import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Label from '../components/ui/Label';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { MaintenanceContract } from '../types';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Spinner from '../components/ui/Spinner';

const parseCurrency = (value: string): number => {
    return Number(value.replace(/[^0-9,-]+/g,"").replace(",", ".")) || 0;
};

const formatToCurrencyInput = (value: number): string => {
    if (isNaN(value)) return '0,00';
    return value.toFixed(2).replace('.', ',');
};

const initialFormState: Omit<MaintenanceContract, 'id' | 'clientName' | 'status' | 'contractNumber'> = {
    clientId: '',
    type: 'Suporte Remoto',
    startDate: '',
    endDate: '',
    monthlyValue: 0,
    scope: '',
    observations: '',
};

const CreateMaintenance: React.FC = () => {
    const { clients, addMaintenanceContract } = useAppContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (clients.length > 0 && !formData.clientId) {
            setFormData(prev => ({ ...prev, clientId: clients[0].id }));
        }
    }, [clients, formData.clientId]);
    
     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: parseCurrency(value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.clientId || !formData.startDate || !formData.endDate || !formData.monthlyValue || !formData.scope) {
            return alert('Por favor, preencha todos os campos obrigatórios (*).');
        }
        
        setIsSubmitting(true);
        try {
            await addMaintenanceContract({
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
            });
            alert('Contrato de manutenção cadastrado com sucesso!');
            navigate('/maintenance');
        } catch(error) {
            alert(`Falha ao cadastrar contrato: ${(error as Error).message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            <h1 className="text-3xl font-bold text-white">Novo Contrato de Manutenção</h1>

            <fieldset disabled={isSubmitting}>
                <Card>
                    <CardHeader>
                        <CardTitle>Detalhes do Contrato</CardTitle>
                        <CardDescription>Informações principais do contrato de manutenção recorrente.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="clientId">Cliente *</Label>
                             <Select id="clientId" value={formData.clientId} onChange={handleChange} required>
                                {clients.length === 0 && <option>Carregando clientes...</option>}
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.razaoSocial || client.nomeCompleto}</option>
                                ))}
                            </Select>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo de Contrato *</Label>
                                <Select id="type" value={formData.type} onChange={handleChange}>
                                    <option value="Suporte Remoto">Suporte Remoto</option>
                                    <option value="Suporte Presencial">Suporte Presencial</option>
                                    <option value="Misto">Misto (Remoto e Presencial)</option>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="monthlyValue">Valor Mensal (R$) *</Label>
                                <Input id="monthlyValue" value={formatToCurrencyInput(formData.monthlyValue)} onChange={handlePriceChange} required placeholder="R$ 0,00" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Data de Início *</Label>
                                <Input id="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">Data de Fim *</Label>
                                <Input id="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="scope">Escopo do Contrato *</Label>
                            <Textarea id="scope" value={formData.scope} onChange={handleChange} required placeholder="Descreva os serviços inclusos. Ex: Suporte para até 10 ramais, 1 visita preventiva mensal..." />
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="observations">Observações</Label>
                            <Textarea id="observations" value={formData.observations} onChange={handleChange} placeholder="Adicione qualquer informação relevante sobre o contrato aqui."/>
                        </div>

                    </CardContent>
                </Card>
            </fieldset>

            <div className="fixed bottom-0 right-0 w-full lg:w-[calc(100%-16rem)] bg-card border-t border-border p-4 flex justify-end space-x-4">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={isSubmitting}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Spinner className="w-4 h-4 mr-2" />}
                    {isSubmitting ? 'Salvando...' : 'Salvar Contrato'}
                </Button>
            </div>
        </form>
    );
};

export default CreateMaintenance;
