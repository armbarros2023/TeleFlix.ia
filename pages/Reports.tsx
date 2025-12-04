import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Label from '../components/ui/Label';
import Input from '../components/ui/Input';
import { useAppContext } from '../hooks/useAppContext';
import { ServiceOrder, Quote, Client, MaintenanceContract, OSStatus, QuoteStatus, MaintenanceStatus } from '../types';
import Spinner from '../components/ui/Spinner';
import { Mail, WhatsApp } from '../components/icons/IconComponents';

type ReportType = 'serviceOrders' | 'quotes' | 'maintenanceContracts';

// --- Funções Auxiliares ---
const getOSStatusBadge = (status: OSStatus) => {
    switch (status) {
        case OSStatus.Pending: return 'bg-amber-100 text-amber-800 border-amber-200 print:bg-transparent print:border-gray-400';
        case OSStatus.InProgress: return 'bg-blue-100 text-blue-800 border-blue-200 print:bg-transparent print:border-gray-400';
        case OSStatus.Completed: return 'bg-green-100 text-green-800 border-green-200 print:bg-transparent print:border-gray-400';
        case OSStatus.Canceled: return 'bg-gray-100 text-gray-800 border-gray-200 print:bg-transparent print:border-gray-400';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getQuoteStatusBadge = (status: QuoteStatus) => {
    switch (status) {
        case QuoteStatus.Draft: return 'bg-gray-100 text-gray-800 border-gray-200 print:bg-transparent print:border-gray-400';
        case QuoteStatus.Sent: return 'bg-blue-100 text-blue-800 border-blue-200 print:bg-transparent print:border-gray-400';
        case QuoteStatus.Accepted: return 'bg-green-100 text-green-800 border-green-200 print:bg-transparent print:border-gray-400';
        case QuoteStatus.Rejected: return 'bg-red-100 text-red-800 border-red-200 print:bg-transparent print:border-gray-400';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getMaintenanceStatusBadge = (status: MaintenanceStatus) => {
    switch (status) {
        case MaintenanceStatus.Active: return 'bg-green-100 text-green-800 border-green-200 print:bg-transparent print:border-gray-400';
        case MaintenanceStatus.Expired: return 'bg-amber-100 text-amber-800 border-amber-200 print:bg-transparent print:border-gray-400';
        case MaintenanceStatus.Canceled: return 'bg-gray-100 text-gray-800 border-gray-200 print:bg-transparent print:border-gray-400';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// --- Componente de Relatório de OS ---
const ServiceOrderReport: React.FC<{ order: ServiceOrder; client: Client | undefined }> = ({ order, client }) => (
  <div className="p-4 border rounded-lg bg-background/50 space-y-6 text-sm print:border-none print:p-0">
    <div className="text-center pb-4 border-b">
      <h2 className="text-2xl font-bold">Ordem de Serviço - {order.serviceOrderNumber}</h2>
      <p className="text-muted-foreground">Data de Emissão: {new Date().toLocaleDateString()}</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="font-bold text-lg border-b pb-1">Cliente</h3>
        {client ? (
          <div className="space-y-1">
            <p><strong>Nome/Razão Social:</strong> {client.razaoSocial || client.nomeCompleto}</p>
            <p><strong>CPF/CNPJ:</strong> {client.cnpj || client.cpf}</p>
            <p><strong>Endereço:</strong> {`${client.street}, ${client.number} - ${client.neighborhood}, ${client.city}/${client.state}`}</p>
            <p><strong>Contato:</strong> {client.phone || client.telefoneCelular} | {client.email}</p>
          </div>
        ) : <p>Cliente não encontrado.</p>}
      </div>
      <div className="space-y-4">
        <h3 className="font-bold text-lg border-b pb-1">Detalhes do Serviço</h3>
        <p><strong>Tipo de Serviço:</strong> {order.serviceType}</p>
        <p><strong>Data Agendada:</strong> {new Date(order.scheduledDate).toLocaleString()}</p>
        <p><strong>Local de Execução:</strong> {order.location}</p>
        <p><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getOSStatusBadge(order.status)}`}>{order.status}</span></p>
      </div>
    </div>

    <div className="space-y-4 pt-4">
      <div className="p-4 border rounded-md print:border-gray-300">
        <h3 className="font-bold text-base mb-2">Solicitação do Cliente (Relato Original)</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">{order.requestDescription || 'Não informado.'}</p>
      </div>
      <div className="p-4 border rounded-md print:border-gray-300">
        <h3 className="font-bold text-base mb-2">Observações Técnicas / Laudo</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">{order.notes || 'Nenhuma observação técnica adicionada.'}</p>
      </div>
    </div>
    
    <div className="pt-16 flex justify-around text-center">
      <div className="w-64">
        <div className="border-t border-gray-400 pt-2">
          <p>Assinatura do Técnico</p>
        </div>
      </div>
      <div className="w-64">
        <div className="border-t border-gray-400 pt-2">
          <p>Assinatura do Cliente</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Componente de Relatório de Orçamento ---
const QuoteReport: React.FC<{ quote: Quote; client: Client | undefined }> = ({ quote, client }) => {
    const companyDetails = {
        name: 'TELFIX',
        address: 'Rua Exemplo, 123 - Centro, São Paulo/SP',
        phone: '(11) 5555-1234',
        email: 'contato@tecnicosemtelefonia.com.br',
        cnpj: '11.222.333/0001-44'
    };
    
    return (
        <div className="p-4 border rounded-lg bg-background/50 space-y-6 text-sm print:border-none print:p-0">
            <header className="flex justify-between items-start pb-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold">{companyDetails.name}</h2>
                    <p className="text-muted-foreground">{companyDetails.address}</p>
                    <p className="text-muted-foreground">{companyDetails.phone} | {companyDetails.email}</p>
                    <p className="text-muted-foreground">CNPJ: {companyDetails.cnpj}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold">Orçamento</h2>
                    <p className="font-mono text-lg">{quote.quoteNumber}</p>
                    <p><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getQuoteStatusBadge(quote.status)}`}>{quote.status}</span></p>
                </div>
            </header>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-1">
                    <h3 className="font-bold">Cliente:</h3>
                    {client ? (
                        <>
                            <p>{client.razaoSocial || client.nomeCompleto}</p>
                            <p>{client.cnpj || client.cpf}</p>
                            <p>{`${client.street}, ${client.number}, ${client.city}/${client.state}`}</p>
                            <p>{client.email}</p>
                        </>
                    ) : <p>Cliente não encontrado.</p>}
                </div>
                <div className="space-y-1 text-left md:text-right">
                     <h3 className="font-bold">Datas:</h3>
                     <p>Data de Emissão: {new Date(quote.quoteDate).toLocaleDateString()}</p>
                     <p>Válido até: {new Date(quote.validUntil).toLocaleDateString()}</p>
                </div>
            </section>
            
            <section>
                <h3 className="font-bold text-lg mb-2">Itens do Orçamento:</h3>
                <div className="border rounded-md">
                    <table className="w-full">
                        <thead className="bg-muted/50 print:bg-gray-100">
                             <tr>
                                <th className="p-2 text-left font-medium">Descrição</th>
                                <th className="p-2 text-center font-medium w-20">Qtd.</th>
                                <th className="p-2 text-right font-medium w-32">Preço Unit.</th>
                                <th className="p-2 text-right font-medium w-32">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quote.items.map(item => (
                                <tr key={item.id} className="border-b last:border-0">
                                    <td className="p-2 align-top">{item.description}</td>
                                    <td className="p-2 text-center align-top">{item.quantity}</td>
                                    <td className="p-2 text-right align-top">{formatCurrency(item.unitPrice)}</td>
                                    <td className="p-2 text-right align-top font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            
            <section className="flex justify-end">
                <div className="w-full max-w-sm space-y-2">
                     <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(quote.subtotal)}</span></div>
                     <div className="flex justify-between"><span>Desconto:</span><span>- {formatCurrency(quote.discount)}</span></div>
                     <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2"><span>TOTAL:</span><span>{formatCurrency(quote.total)}</span></div>
                </div>
            </section>
            
            <section className="space-y-4 pt-4 border-t">
                <div>
                    <h3 className="font-bold">Observações:</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{quote.observations || 'Nenhuma.'}</p>
                </div>
                 <div>
                    <h3 className="font-bold">Condições Comerciais:</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{quote.commercialConditions}</p>
                </div>
            </section>
             <footer className="text-center pt-8 text-xs text-muted-foreground">
                <p>Agradecemos a sua preferência!</p>
             </footer>
        </div>
    );
};

// --- Componente de Relatório de Contrato ---
const MaintenanceContractReport: React.FC<{ contract: MaintenanceContract; client: Client | undefined }> = ({ contract, client }) => (
    <div className="p-4 border rounded-lg bg-background/50 space-y-6 text-sm print:border-none print:p-0">
        <div className="text-center pb-4 border-b">
            <h2 className="text-2xl font-bold">Contrato de Manutenção - {contract.contractNumber}</h2>
            <p className="text-muted-foreground">Data de Emissão: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="font-bold text-lg border-b pb-1">Cliente</h3>
                {client ? (
                    <div className="space-y-1">
                        <p><strong>Nome/Razão Social:</strong> {client.razaoSocial || client.nomeCompleto}</p>
                        <p><strong>CPF/CNPJ:</strong> {client.cnpj || client.cpf}</p>
                        <p><strong>Endereço:</strong> {`${client.street}, ${client.number}, ${client.city}/${client.state}`}</p>
                        <p><strong>Contato:</strong> {client.phone || client.telefoneCelular} | {client.email}</p>
                    </div>
                ) : <p>Cliente não encontrado.</p>}
            </div>
            <div className="space-y-4">
                <h3 className="font-bold text-lg border-b pb-1">Detalhes do Contrato</h3>
                <p><strong>Tipo:</strong> {contract.type}</p>
                <p><strong>Vigência:</strong> {new Date(contract.startDate).toLocaleDateString()} a {new Date(contract.endDate).toLocaleDateString()}</p>
                <p><strong>Valor Mensal:</strong> {formatCurrency(contract.monthlyValue)}</p>
                <p><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getMaintenanceStatusBadge(contract.status)}`}>{contract.status}</span></p>
            </div>
        </div>

        <div className="space-y-4 pt-4">
            <div className="p-4 border rounded-md print:border-gray-300">
                <h3 className="font-bold text-base mb-2">Escopo do Contrato</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{contract.scope || 'Não informado.'}</p>
            </div>
            <div className="p-4 border rounded-md print:border-gray-300">
                <h3 className="font-bold text-base mb-2">Observações</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{contract.observations || 'Nenhuma.'}</p>
            </div>
        </div>
    </div>
);


// --- Função para gerar conteúdo de compartilhamento ---
const generateTextContentForShare = (
    report: ServiceOrder | Quote | MaintenanceContract,
    type: ReportType
): { subject: string; body: string } => {
    
    const companyName = "TELFIX";
    const closing = `\n\nAtenciosamente,\nEquipe ${companyName}`;

    if (type === 'serviceOrders') {
        const order = report as ServiceOrder;
        const subject = `Ordem de Serviço: ${order.serviceOrderNumber} - ${order.clientName}`;
        const body = `Olá,\n\nSegue o resumo da Ordem de Serviço:\n\n` +
            `*OS Nº:* ${order.serviceOrderNumber}\n` +
            `*Cliente:* ${order.clientName}\n` +
            `*Serviço:* ${order.serviceType}\n` +
            `*Data Agendada:* ${new Date(order.scheduledDate).toLocaleString()}\n` +
            `*Status:* ${order.status}\n\n` +
            `*Descrição:* ${order.requestDescription || 'Não informado.'}\n\n` +
            `*Obs. Técnicas:* ${order.notes || 'Nenhuma.'}` +
            closing;
        return { subject, body };
    }

    if (type === 'quotes') {
        const quote = report as Quote;
        const subject = `Orçamento: ${quote.quoteNumber} - ${quote.clientName}`;
        const itemsText = quote.items.map(i => `- ${i.description} (Qtd: ${i.quantity}, Unit.: ${formatCurrency(i.unitPrice)})`).join('\n');
        const body = `Olá,\n\nSegue o resumo do Orçamento:\n\n` +
            `*Orçamento Nº:* ${quote.quoteNumber}\n` +
            `*Cliente:* ${quote.clientName}\n` +
            `*Válido até:* ${new Date(quote.validUntil).toLocaleDateString()}\n` +
            `*Status:* ${quote.status}\n\n` +
            `*Itens:*\n${itemsText}\n\n` +
            `*Subtotal:* ${formatCurrency(quote.subtotal)}\n` +
            `*Desconto:* ${formatCurrency(quote.discount)}\n` +
            `*TOTAL:* ${formatCurrency(quote.total)}` +
            closing;
        return { subject, body };
    }

    if (type === 'maintenanceContracts') {
        const contract = report as MaintenanceContract;
        const subject = `Contrato de Manutenção: ${contract.contractNumber} - ${contract.clientName}`;
        const body = `Olá,\n\nSegue o resumo do Contrato de Manutenção:\n\n` +
            `*Contrato Nº:* ${contract.contractNumber}\n` +
            `*Cliente:* ${contract.clientName}\n` +
            `*Tipo:* ${contract.type}\n` +
            `*Vigência:* ${new Date(contract.startDate).toLocaleDateString()} a ${new Date(contract.endDate).toLocaleDateString()}\n` +
            `*Valor Mensal:* ${formatCurrency(contract.monthlyValue)}\n\n` +
            `*Escopo:* ${contract.scope || 'Não informado.'}` +
            closing;
        return { subject, body };
    }

    return { subject: 'Detalhes do Documento', body: 'Não foi possível gerar o conteúdo.' };
};


// --- Componente Principal ---
const Reports: React.FC = () => {
    const { serviceOrders, quotes, maintenanceContracts, clients } = useAppContext();
    const [reportType, setReportType] = useState<ReportType>('serviceOrders');
    const [searchTerm, setSearchTerm] = useState('');
    const [reportData, setReportData] = useState<(ServiceOrder | Quote | MaintenanceContract)[] | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateReport = () => {
        if (!searchTerm.trim()) {
            alert("Por favor, digite o número do documento para gerar o relatório.");
            return;
        }
        setIsGenerating(true);
        setReportData(null);

        setTimeout(() => {
            const term = searchTerm.trim().toLowerCase();
            let filteredData;

            if (reportType === 'serviceOrders') {
                filteredData = serviceOrders.filter(order => order.serviceOrderNumber.toLowerCase() === term);
            } else if (reportType === 'quotes') {
                filteredData = quotes.filter(quote => quote.quoteNumber.toLowerCase() === term);
            } else {
                filteredData = maintenanceContracts.filter(c => c.contractNumber.toLowerCase() === term);
            }
            setReportData(filteredData);
            setIsGenerating(false);
        }, 500);
    };

    const handleShare = (method: 'email' | 'whatsapp') => {
        if (!reportData || reportData.length === 0) return;

        const reportItem = reportData[0];
        const { subject, body } = generateTextContentForShare(reportItem, reportType);

        if (method === 'email') {
            const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
        } else if (method === 'whatsapp') {
            const whatsappLink = `https://wa.me/?text=${encodeURIComponent(body)}`;
            window.open(whatsappLink, '_blank', 'noopener,noreferrer');
        }
    };


    const renderReportContent = () => {
        if (isGenerating) {
            return (
                <div className="flex flex-col items-center justify-center text-center h-48 space-y-3">
                    <Spinner className="h-8 w-8 text-primary" />
                    <p className="text-muted-foreground">Gerando relatório...</p>
                </div>
            );
        }

        if (!reportData) {
            return (
                <div className="text-center h-48 flex items-center justify-center">
                    <p className="text-muted-foreground">Digite um número e gere um relatório para visualizar os dados.</p>
                </div>
            );
        }

        if (reportData.length === 0) {
            return (
                <div className="text-center h-48 flex items-center justify-center">
                    <p className="text-muted-foreground">Nenhum dado encontrado para o número informado.</p>
                </div>
            );
        }

        if (reportType === 'serviceOrders') {
            const order = reportData[0] as ServiceOrder;
            const clientData = clients.find(c => c.id === order.clientId);
            return <ServiceOrderReport order={order} client={clientData} />;
        }
        
        if (reportType === 'quotes') {
            const quote = reportData[0] as Quote;
            const clientData = clients.find(c => c.id === quote.clientId);
            return <QuoteReport quote={quote} client={clientData} />;
        }
        
        if (reportType === 'maintenanceContracts') {
            const contract = reportData[0] as MaintenanceContract;
            const clientData = clients.find(c => c.id === contract.clientId);
            return <MaintenanceContractReport contract={contract} client={clientData} />;
        }
        
        return null;
    };

    return (
        <div className="space-y-6">
            <h1 id="page-title" className="text-3xl font-bold text-white">Relatórios</h1>

            <Card id="report-form-card">
                <CardHeader>
                    <CardTitle>Gerador de Relatórios</CardTitle>
                    <CardDescription>Selecione o tipo de relatório e digite o número para a busca.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tipo de Relatório</Label>
                        <div className="flex flex-wrap items-center p-1 rounded-lg bg-muted w-max">
                            <Button onClick={() => { setReportType('serviceOrders'); setReportData(null); setSearchTerm('') }} variant={reportType === 'serviceOrders' ? 'default' : 'ghost'} className="w-48">Ordens de Serviço</Button>
                            <Button onClick={() => { setReportType('quotes'); setReportData(null); setSearchTerm('') }} variant={reportType === 'quotes' ? 'default' : 'ghost'} className="w-48">Orçamentos</Button>
                            <Button onClick={() => { setReportType('maintenanceContracts'); setReportData(null); setSearchTerm('') }} variant={reportType === 'maintenanceContracts' ? 'default' : 'ghost'} className="w-48">Contratos</Button>
                        </div>
                    </div>
                     <div className="space-y-2 max-w-md">
                        <Label htmlFor="search-term">Número do Documento</Label>
                        <Input 
                            id="search-term" 
                            type="text" 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            placeholder={
                                reportType === 'serviceOrders' ? "Digite o número (ex: OS-0001)" : 
                                reportType === 'quotes' ? "Digite o número (ex: ORC-0001)" :
                                "Digite o número (ex: CT-MAN-001)"
                            }
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGenerateReport} disabled={isGenerating}>
                         {isGenerating && <Spinner className="w-4 h-4 mr-2" />}
                         {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
                    </Button>
                </CardFooter>
            </Card>

            {reportData !== null || isGenerating ? (
                <div id="report-view">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle>Resultado do Relatório</CardTitle>
                                <CardDescription>
                                     {`Exibindo resultado para a busca: "${searchTerm}".`}
                                </CardDescription>
                            </div>
                            {reportData && reportData.length > 0 && (
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <Button onClick={() => handleShare('email')} variant="outline" size="sm">
                                        <Mail className="w-4 h-4 mr-2"/> E-mail
                                    </Button>
                                    <Button onClick={() => handleShare('whatsapp')} variant="outline" size="sm" className="bg-green-50 hover:bg-green-100 dark:bg-green-900/50 dark:hover:bg-green-900/80 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                                        <WhatsApp className="w-4 h-4 mr-2"/> WhatsApp
                                    </Button>
                                    <Button id="print-button" onClick={() => window.print()}>
                                        Imprimir
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            {renderReportContent()}
                        </CardContent>
                    </Card>
                </div>
            ) : null}
            
            <style>{`
                @media print {
                    body > #root > div.flex, 
                    #page-title,
                    #report-form-card,
                    #print-button,
                    #report-view > .bg-card > .flex .flex { /* Oculta a div dos botões de ação */
                        display: none !important;
                    }
                    main {
                        padding: 0 !important;
                        margin: 0 !important;
                        overflow: visible !important;
                    }
                    body, #root, main, .bg-card, .bg-background\\/50 {
                        background: white !important;
                        color: black !important;
                    }
                    .text-muted-foreground {
                        color: #4a5568 !important; /* Um cinza escuro para impressão */
                    }
                    #report-view, #report-view .bg-card {
                        box-shadow: none !important;
                        border: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Reports;