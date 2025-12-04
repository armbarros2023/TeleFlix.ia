import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Label from '../components/ui/Label';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import { parseServiceRequest } from '../services/geminiService';
import { Sparkles, User, Phone, Mail, MapPin } from '../components/icons/IconComponents';
import Spinner from '../components/ui/Spinner';
import { Client, OSStatus } from '../types';

const CreateServiceOrder: React.FC = () => {
    const { clients, addServiceOrder, serviceOrders, updateServiceOrder } = useAppContext();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);

    const [clientId, setClientId] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [serviceType, setServiceType] = useState('');
    const [location, setLocation] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [notes, setNotes] = useState('');
    const [requestDescription, setRequestDescription] = useState('');
    const [status, setStatus] = useState<OSStatus>(OSStatus.Pending);
    const [isParsing, setIsParsing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        if (isEditMode && serviceOrders.length > 0) {
            const orderToEdit = serviceOrders.find(order => order.id === id);
            if (orderToEdit) {
                setClientId(orderToEdit.clientId);
                setServiceType(orderToEdit.serviceType);
                setLocation(orderToEdit.location);
                // Format date for datetime-local input, considering timezone offset
                const localDate = new Date(orderToEdit.scheduledDate);
                const offset = localDate.getTimezoneOffset();
                const adjustedDate = new Date(localDate.getTime() - (offset*60*1000));
                setScheduledDate(adjustedDate.toISOString().slice(0, 16));
                
                setNotes(orderToEdit.notes);
                setRequestDescription(orderToEdit.requestDescription || '');
                setStatus(orderToEdit.status);
            } else {
                alert("Ordem de serviço não encontrada!");
                navigate('/service-orders');
            }
        }
    }, [id, isEditMode, serviceOrders, navigate]);


    const handleGeminiParse = async () => {
        if (!requestDescription) {
            alert("Por favor, descreva a solicitação primeiro.");
            return;
        }
        setIsParsing(true);
        const result = await parseServiceRequest(requestDescription);
        if (result) {
            setServiceType(result.serviceType);
            setNotes(result.notes);
        }
        setIsParsing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientId || !serviceType || !location || !scheduledDate) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                const originalOrder = serviceOrders.find(o => o.id === id);
                if (!originalOrder) throw new Error("Ordem de serviço original não encontrada.");
                
                await updateServiceOrder({
                    ...originalOrder,
                    clientId,
                    requestDescription,
                    serviceType,
                    location,
                    scheduledDate: new Date(scheduledDate).toISOString(),
                    notes,
                    status,
                });
                alert('Ordem de Serviço atualizada com sucesso!');

            } else {
                 await addServiceOrder({
                    clientId,
                    requestDescription,
                    serviceType,
                    location,
                    scheduledDate: new Date(scheduledDate).toISOString(),
                    notes,
                });
                alert('Ordem de Serviço criada com sucesso!');
            }
            navigate('/service-orders');
        } catch (error) {
            alert(`Falha ao salvar Ordem de Serviço: ${(error as Error).message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Auto-select first client when component mounts in create mode
    useEffect(() => {
        if (!isEditMode && clients.length > 0 && !clientId) {
            setClientId(clients[0].id);
        }
    }, [clients, clientId, isEditMode]);

    // Update selected client and location when clientId changes
    useEffect(() => {
        if (clientId) {
            const client = clients.find(c => c.id === clientId);
            if (client) {
                setSelectedClient(client);
                // Only auto-update location if not in edit mode, to avoid overwriting user changes
                if(!isEditMode) {
                    const fullAddress = `${client.street}, ${client.number}, ${client.neighborhood}, ${client.city} - ${client.state}, ${client.zipCode}`;
                    setLocation(fullAddress);
                }
            }
        } else {
            setSelectedClient(null);
            if(!isEditMode) setLocation('');
        }
    }, [clientId, clients, isEditMode]);

    const formDisabled = isParsing || isSubmitting;

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{isEditMode ? 'Editar Ordem de Serviço' : 'Criar Nova Ordem de Serviço'}</CardTitle>
                <CardDescription>
                    {isEditMode ? 'Altere os detalhes da OS e salve as modificações.' : 'Preencha os detalhes abaixo para agendar um novo serviço.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <fieldset disabled={formDisabled}>
                        <div className="space-y-2">
                            <Label>Observação / Descrição da Solicitação</Label>
                            <div className="flex items-center space-x-2">
                                <Textarea 
                                    placeholder="Ex: O cliente ligou reclamando que o telefone do escritório principal está mudo e não faz chamadas."
                                    value={requestDescription}
                                    onChange={(e) => setRequestDescription(e.target.value)}
                                    rows={4}
                                />
                                <Button type="button" onClick={handleGeminiParse} disabled={isParsing} className="self-start">
                                    {isParsing ? <Spinner className="w-5 h-5 mr-2"/> : <Sparkles className="w-5 h-5 mr-2" />}
                                    {isParsing ? 'Analisando...' : 'Analisar com IA'}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Opcional: use a IA para preencher o "Tipo de Serviço" e "Observações Técnicas" automaticamente a partir da descrição acima.</p>
                        </div>

                        <div className="space-y-2 pt-4">
                            <Label htmlFor="client">Cliente *</Label>
                            <Select id="client" value={clientId} onChange={e => setClientId(e.target.value)} required>
                                {clients.length === 0 && <option>Carregando clientes...</option>}
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.razaoSocial || client.nomeCompleto}</option>
                                ))}
                            </Select>
                        </div>

                        {selectedClient && (
                            <Card className="mt-4 bg-secondary/50 dark:bg-slate-800/60 border-border">
                                <CardHeader className="pb-4 pt-4">
                                    <CardTitle className="text-base flex items-center font-semibold">
                                        <User className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
                                        <span>{selectedClient.contatoPrincipal || selectedClient.nomeCompleto}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm pt-0">
                                    <div className="flex items-center">
                                        <Phone className="w-4 h-4 mr-3 text-muted-foreground flex-shrink-0" />
                                        <span className="text-muted-foreground">{selectedClient.phone || selectedClient.telefoneCelular || 'Telefone não cadastrado'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="w-4 h-4 mr-3 text-muted-foreground flex-shrink-0" />
                                        <span className="text-muted-foreground truncate" title={selectedClient.email}>{selectedClient.email}</span>
                                    </div>
                                    <div className="md:col-span-2 flex items-start">
                                        <MapPin className="w-4 h-4 mr-3 mt-1 text-muted-foreground flex-shrink-0" />
                                        <span className="text-muted-foreground">{`${selectedClient.street}, ${selectedClient.number}${selectedClient.complement ? ' - ' + selectedClient.complement : ''}, ${selectedClient.neighborhood}, ${selectedClient.city} - ${selectedClient.state}`}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="service-type">Tipo de Serviço *</Label>
                                <Input id="service-type" value={serviceType} onChange={e => setServiceType(e.target.value)} placeholder="Ex: Manutenção Corretiva" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="scheduled-date">Data e Hora Agendada *</Label>
                                <Input id="scheduled-date" type="datetime-local" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} required />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="location">Local da Execução (confirmar ou editar) *</Label>
                                <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Endereço completo" required />
                            </div>
                             {isEditMode && (
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="status">Status da OS *</Label>
                                    <Select id="status" value={status} onChange={e => setStatus(e.target.value as OSStatus)} required>
                                        {Object.values(OSStatus).map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </Select>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 pt-4">
                            <Label htmlFor="notes">Observações Técnicas</Label>
                            <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Detalhes técnicos, equipamentos necessários, etc." />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="photos">Upload de Fotos (Opcional)</Label>
                            <Input id="photos" type="file" multiple />
                        </div>
                    </fieldset>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={formDisabled}>Cancelar</Button>
                        <Button type="submit" disabled={formDisabled}>
                            {isSubmitting && <Spinner className="w-4 h-4 mr-2"/>}
                            {isSubmitting ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Salvar Ordem de Serviço')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateServiceOrder;