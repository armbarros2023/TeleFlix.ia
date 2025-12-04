import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Label from '../components/ui/Label';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Client, ClientType } from '../types';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import Textarea from '../components/ui/Textarea';

// --- Helper Functions for Formatting ---
const formatters: Record<string, (value: string) => string> = {
    cnpj: (value) => value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2').slice(0, 18),
    cpf: (value) => value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').slice(0, 14),
    zipCode: (value) => value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9),
    phone: (value) => value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4,5})(\d{4})/, '$1-$2').slice(0, 15),
    telefoneCelular: (value) => value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4,5})(\d{4})/, '$1-$2').slice(0, 15),
    telefoneResidencial: (value) => value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{4})/, '$1-$2').slice(0, 14),
};

const brazilianStates = [
    { value: 'AC', label: 'Acre' }, { value: 'AL', label: 'Alagoas' }, { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' }, { value: 'BA', label: 'Bahia' }, { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' }, { value: 'ES', label: 'Espírito Santo' }, { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' }, { value: 'MT', label: 'Mato Grosso' }, { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' }, { value: 'PA', label: 'Pará' }, { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' }, { value: 'PE', label: 'Pernambuco' }, { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' }, { value: 'RN', label: 'Rio Grande do Norte' }, { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' }, { value: 'RR', label: 'Roraima' }, { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' }, { value: 'SE', label: 'Sergipe' }, { value: 'TO', label: 'Tocantins' }
];

const initialFormState: Partial<Client> = {
    type: 'pessoaJuridica', email: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '', emailNfe: '', emailCobranca: '', observacoes: '',
    razaoSocial: '', nomeFantasia: '', cnpj: '', inscricaoEstadual: '', inscricaoMunicipal: '', site: '', contatoPrincipal: '', contatoFinanceiro: '', phone: '',
    nomeCompleto: '', dataNascimento: '', sexo: 'Masculino', cpf: '', rg: '', telefoneResidencial: '', telefoneCelular: ''
};

const CreateClient: React.FC = () => {
    const { addClient } = useAppContext();
    const navigate = useNavigate();
    const [clientType, setClientType] = useState<ClientType>('pessoaJuridica');
    const [formData, setFormData] = useState<Partial<Client>>(initialFormState);
    const [isFetchingCep, setIsFetchingCep] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClientTypeChange = (type: ClientType) => {
        setClientType(type);
        setFormData({ ...initialFormState, type });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        const formatter = formatters[id as keyof typeof formatters];
        const formattedValue = formatter ? formatter(value) : value;

        setFormData(prev => ({ ...prev, [id]: formattedValue }));
    };

    const handleCepLookup = useCallback(async () => {
        const cep = (formData.zipCode || '').replace(/\D/g, '');
        if (cep.length !== 8) return alert('Por favor, insira um CEP válido com 8 dígitos.');
        
        setIsFetchingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (data.erro) throw new Error('CEP não localizado.');
            setFormData(prev => ({
                ...prev, street: data.logradouro || '', neighborhood: data.bairro || '',
                city: data.localidade || '', state: data.uf || '',
            }));
            document.getElementById('number')?.focus();
        } catch (error) {
            alert((error as Error).message || 'Falha ao buscar o CEP.');
        } finally {
            setIsFetchingCep(false);
        }
    }, [formData.zipCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (clientType === 'pessoaJuridica' && (!formData.razaoSocial || !formData.cnpj)) {
            return alert('Razão Social e CNPJ são obrigatórios.');
        }
        if (clientType === 'pessoaFisica' && (!formData.nomeCompleto || !formData.cpf)) {
            return alert('Nome Completo e CPF são obrigatórios.');
        }

        setIsSubmitting(true);
        try {
            await addClient(formData as Omit<Client, 'id'>);
            alert('Cliente cadastrado com sucesso!');
            navigate('/clients');
        } catch (error) {
            alert(`Falha ao cadastrar cliente: ${(error as Error).message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const formDisabled = isFetchingCep || isSubmitting;

    const addressFields = useMemo(() => (
        <Card>
            <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>Para localização e emissão de notas fiscais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="space-y-2 md:col-span-1">
                        <Label htmlFor="zipCode">CEP *</Label>
                        <Input id="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="00000-000" required />
                    </div>
                    <div className="md:col-span-2">
                        <Button type="button" variant="outline" onClick={handleCepLookup} disabled={isFetchingCep}>
                            {isFetchingCep ? <Spinner className="w-4 h-4 mr-2" /> : null}
                            {isFetchingCep ? 'Buscando...' : 'Buscar Endereço pelo CEP'}
                        </Button>
                    </div>
                </div>
                <Input id="street" value={formData.street} onChange={handleChange} placeholder="Logradouro (Rua, Avenida, etc.)" disabled={isFetchingCep} required />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input id="number" value={formData.number} onChange={handleChange} placeholder="Número *" required />
                    <Input id="complement" value={formData.complement} onChange={handleChange} placeholder="Complemento (apto, sala, etc.)" />
                    <Input id="neighborhood" value={formData.neighborhood} onChange={handleChange} placeholder="Bairro *" disabled={isFetchingCep} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input id="city" value={formData.city} onChange={handleChange} placeholder="Cidade *" disabled={isFetchingCep} required />
                    <Select id="state" value={formData.state} onChange={handleChange} disabled={isFetchingCep} required>
                        <option value="">Selecione um estado *</option>
                        {brazilianStates.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </Select>
                </div>
            </CardContent>
        </Card>
    ), [formData, handleChange, handleCepLookup, isFetchingCep]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            <h1 className="text-3xl font-bold text-white">Cadastro de Cliente</h1>

            <fieldset disabled={formDisabled}>
                <div className="flex items-center p-1 rounded-lg bg-muted w-max">
                    <Button type="button" onClick={() => handleClientTypeChange('pessoaJuridica')} variant={clientType === 'pessoaJuridica' ? 'default' : 'ghost'} className="w-40">Pessoa Jurídica</Button>
                    <Button type="button" onClick={() => handleClientTypeChange('pessoaFisica')} variant={clientType === 'pessoaFisica' ? 'default' : 'ghost'} className="w-40">Pessoa Física</Button>
                </div>

                {clientType === 'pessoaJuridica' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Dados de Identificação</CardTitle>
                                <CardDescription>Informações fiscais da empresa.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input id="razaoSocial" value={formData.razaoSocial} onChange={handleChange} required placeholder="Razão Social *" />
                                <Input id="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} placeholder="Nome Fantasia" />
                                <Input id="cnpj" value={formData.cnpj} onChange={handleChange} required placeholder="CNPJ *" />
                                <Input id="inscricaoEstadual" value={formData.inscricaoEstadual} onChange={handleChange} placeholder="Inscrição Estadual (ou 'Isento')" />
                                <Input id="inscricaoMunicipal" value={formData.inscricaoMunicipal} onChange={handleChange} placeholder="Inscrição Municipal" />
                                <Input id="site" type="url" value={formData.site} onChange={handleChange} placeholder="Site (ex: https://site.com)" />
                            </CardContent>
                        </Card>
                        {addressFields}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contatos e Faturamento</CardTitle>
                                <CardDescription>Informações para comunicação e envio de cobranças.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Telefone Principal *" required />
                                <Input id="contatoPrincipal" value={formData.contatoPrincipal} onChange={handleChange} placeholder="Nome do Contato Principal *" required/>
                                <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="E-mail Principal *" required />
                                <Input id="contatoFinanceiro" value={formData.contatoFinanceiro} onChange={handleChange} placeholder="Nome do Contato Financeiro" />
                                <Input id="emailNfe" type="email" value={formData.emailNfe} onChange={handleChange} placeholder="E-mail para NF-e" />
                                <Input id="emailCobranca" type="email" value={formData.emailCobranca} onChange={handleChange} placeholder="E-mail para Cobrança" />
                            </CardContent>
                        </Card>
                    </div>
                )}

                {clientType === 'pessoaFisica' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Dados Pessoais</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <Input id="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} required placeholder="Nome Completo *" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Input id="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleChange} placeholder="Data de Nascimento" />
                                    <Input id="cpf" value={formData.cpf} onChange={handleChange} required placeholder="CPF *" />
                                    <Input id="rg" value={formData.rg} onChange={handleChange} placeholder="RG" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Sexo</Label>
                                    <div className="flex items-center space-x-4">
                                        {['Masculino', 'Feminino', 'Outro'].map(sexo => (
                                            <div key={sexo} className="flex items-center space-x-2">
                                                <input type="radio" id={sexo} name="sexo" value={sexo} checked={formData.sexo === sexo} onChange={(e) => setFormData(p => ({...p, sexo: e.target.value as any}))} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                                                <Label htmlFor={sexo}>{sexo}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {addressFields}
                        <Card>
                            <CardHeader><CardTitle>Contatos e Faturamento</CardTitle></CardHeader>
                             <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input id="telefoneCelular" type="tel" value={formData.telefoneCelular} onChange={handleChange} placeholder="Telefone Celular *" required />
                                <Input id="telefoneResidencial" type="tel" value={formData.telefoneResidencial} onChange={handleChange} placeholder="Telefone Residencial" />
                                <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="E-mail Principal *" required />
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <Input id="emailNfe" type="email" value={formData.emailNfe} onChange={handleChange} placeholder="E-mail para NF-e" />
                                   <Input id="emailCobranca" type="email" value={formData.emailCobranca} onChange={handleChange} placeholder="E-mail para Cobrança" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                 <Card>
                    <CardHeader><CardTitle>Observações</CardTitle></CardHeader>
                    <CardContent>
                        <Textarea id="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Adicione qualquer informação relevante sobre o cliente aqui."/>
                    </CardContent>
                 </Card>
            </fieldset>

            <div className="fixed bottom-0 right-0 w-full lg:w-[calc(100%-16rem)] bg-card border-t border-border p-4 flex justify-end space-x-4">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={formDisabled}>Cancelar</Button>
                <Button type="submit" disabled={formDisabled}>
                    {isSubmitting && <Spinner className="w-4 h-4 mr-2" />}
                    {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
                </Button>
            </div>
        </form>
    );
};

export default CreateClient;