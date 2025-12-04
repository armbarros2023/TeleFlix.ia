import { Client, ServiceOrder, User, Quote, Product, MaintenanceContract, OSStatus, QuoteStatus, MaintenanceStatus, Invoice, InvoicePaymentStatus } from '../types';

// --- IN-MEMORY DATABASE & MOCK DATA ---
// Data migrated from backend/server.js to make the app self-contained.

let clientsDb: Client[] = [
  { 
    id: 'cli-1', type: 'pessoaJuridica', razaoSocial: 'Tech Solutions & Inovações Ltda.', nomeFantasia: 'Tech Solutions', cnpj: '12.345.678/0001-99', inscricaoEstadual: '111.222.333.444', street: 'Rua das Inovações', number: '123', complement: 'Andar 10', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', zipCode: '01001-000', email: 'contato@techsolutions.com', emailNfe: 'nfe@techsolutions.com', emailCobranca: 'financeiro@techsolutions.com', phone: '(11) 98765-4321', contatoPrincipal: 'Ana', contatoFinanceiro: 'Roberto'
  },
  { 
    id: 'cli-2', type: 'pessoaJuridica', razaoSocial: 'João da Silva MEI', nomeFantasia: 'JS Instalações', cnpj: '23.456.789/0001-11', inscricaoEstadual: 'Isento', street: 'Av. Principal', number: '456', complement: 'Loja B', neighborhood: 'Copacabana', city: 'Rio de Janeiro', state: 'RJ', zipCode: '22020-002', email: 'joao.silva@jsinstalacoes.com', emailNfe: 'joao.silva@jsinstalacoes.com', emailCobranca: 'joao.silva@jsinstalacoes.com', phone: '(21) 91234-5678', contatoPrincipal: 'João da Silva'
  },
  { 
    id: 'cli-3', type: 'pessoaJuridica', razaoSocial: 'Comércio de Alimentos Oliveira Ltda.', nomeFantasia: 'Supermercado Oliveira', cnpj: '98.765.432/0001-22', inscricaoEstadual: '555.666.777.888', street: 'Praça Central', number: '789', complement: '', neighborhood: 'Savassi', city: 'Belo Horizonte', state: 'MG', zipCode: '30130-141', email: 'compras@superoliveira.com', emailNfe: 'fiscal@superoliveira.com', emailCobranca: 'financeiro@superoliveira.com', phone: '(31) 95555-4444', contatoPrincipal: 'Maria Oliveira'
  },
  {
    id: 'cli-4', type: 'pessoaFisica', nomeCompleto: 'Fernanda Costa', cpf: '123.456.789-00', rg: '22.333.444-5', dataNascimento: '1990-05-15', sexo: 'Feminino', street: 'Rua das Flores', number: '50', complement: 'Apto 202', neighborhood: 'Jardins', city: 'São Paulo', state: 'SP', zipCode: '01401-001', email: 'fernanda.costa@email.com', emailNfe: 'fernanda.costa@email.com', telefoneCelular: '(11) 98888-7777',
  }
];

let usersDb: User[] = [
  { id: 'user-admin', type: 'pessoaFisica', nomeCompleto: 'Administrador do Sistema', username: 'administrador', email: 'admin@fieldservice.com', role: 'Administrador', status: 'Ativo' },
];

let productsDb: Product[] = [
  { id: 'prod-1', sku: 'TEL-001', name: 'Telefone IP Intelbras TIP 125i', description: 'Telefone IP com suporte a 1 conta SIP, PoE e alta qualidade de voz.', category: 'Telefonia', unitOfMeasure: 'unidade', quantityInStock: 25, costPrice: 250.00, sellingPrice: 349.90, supplier: 'Intelbras S/A' },
  { id: 'prod-2', sku: 'CAB-001', name: 'Cabo de Rede CAT6 Furukawa', description: 'Cabo de rede para instalações de alta performance.', category: 'Redes', unitOfMeasure: 'metro', quantityInStock: 500, costPrice: 1.80, sellingPrice: 3.50, supplier: 'Distribuidora Cabos Mil' },
  { id: 'prod-3', sku: 'CEN-001', name: 'Central Telefônica Intelbras Modulare+', description: 'Central PABX analógica para pequenas empresas.', category: 'Telefonia', unitOfMeasure: 'peça', quantityInStock: 5, costPrice: 450.00, sellingPrice: 629.90, supplier: 'Intelbras S/A' },
  { id: 'prod-4', sku: 'SEG-002', name: 'Câmera IP Giga Security GS0246', description: 'Câmera IP Bullet com infravermelho e resolução Full HD.', category: 'Segurança', unitOfMeasure: 'unidade', quantityInStock: 15, costPrice: 280.00, sellingPrice: 419.99, supplier: 'Giga Security' },
  { id: 'prod-5', sku: 'CON-001', name: 'Conector RJ45 CAT6 Blindado', description: 'Conector para montagem de cabos de rede CAT6.', category: 'Redes', unitOfMeasure: 'caixa', quantityInStock: 10, costPrice: 80.00, sellingPrice: 150.00, supplier: 'Distribuidora Cabos Mil' },
];

let serviceOrdersDb: ServiceOrder[] = [
  { id: 'os-001', serviceOrderNumber: 'OS-0001', clientId: 'cli-1', clientName: 'Tech Solutions & Inovações Ltda.', requestDescription: 'Servidor principal apresentando lentidão nos últimos dias. O acesso aos arquivos está demorando mais que o normal.', serviceType: 'Manutenção de Servidor', location: 'Rua das Inovações, 123, São Paulo, SP', scheduledDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), notes: 'Verificar performance do servidor principal e fazer limpeza de logs.', status: OSStatus.Pending, technician: 'Carlos' },
  { id: 'os-002', serviceOrderNumber: 'OS-0002', clientId: 'cli-2', clientName: 'João da Silva MEI', requestDescription: 'Cliente solicitou a instalação de 4 câmeras na frente da casa para monitorar a entrada e a garagem.', serviceType: 'Instalação de Câmeras', location: 'Av. Principal, 456, Rio de Janeiro, RJ', scheduledDate: new Date().toISOString(), notes: 'Instalar 4 câmeras de segurança na área externa da residência.', status: OSStatus.InProgress, technician: 'Ana' },
  { id: 'os-003', serviceOrderNumber: 'OS-0003', clientId: 'cli-3', clientName: 'Comércio de Alimentos Oliveira Ltda.', requestDescription: 'Funcionários do segundo andar reclamando que o sinal de Wi-Fi está muito fraco e caindo toda hora.', serviceType: 'Reparo de Rede Wi-Fi', location: 'Praça Central, 789, Belo Horizonte, MG', scheduledDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), notes: 'Sinal de Wi-Fi fraco no segundo andar.', status: OSStatus.Completed, technician: 'Carlos', completedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
];

let quotesDb: Quote[] = [
    { id: 'qt-001', quoteNumber: 'ORC-0001', clientId: 'cli-1', clientName: 'Tech Solutions & Inovações Ltda.', quoteDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), validUntil: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(), items: [ { id: 'item-1', description: 'Instalação e configuração de 10 câmeras de segurança Intelbras Full HD', quantity: 1, unitPrice: 4500 }, { id: 'item-2', description: 'Licença anual de software de monitoramento', quantity: 1, unitPrice: 800 }, ], subtotal: 5300, discount: 150, total: 5150, observations: 'Infraestrutura de cabos não inclusa.', commercialConditions: 'Garantia de 12 meses para equipamentos. Pagamento em 3x no boleto.', status: QuoteStatus.Sent, },
    { id: 'qt-002', quoteNumber: 'ORC-0002', clientId: 'cli-4', clientName: 'Fernanda Costa', quoteDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), validUntil: new Date(new Date().setDate(new Date().getDate() + 28)).toISOString(), items: [ { id: 'item-3', description: 'Consultoria e configuração de rede Wi-Fi Mesh', quantity: 1, unitPrice: 600 }, ], subtotal: 600, discount: 0, total: 600, observations: 'Visita técnica para análise do ambiente e recomendação de equipamentos.', commercialConditions: 'Pagamento via PIX na conclusão do serviço.', status: QuoteStatus.Accepted, }
];

let maintenanceDb: MaintenanceContract[] = [
  { id: 'man-1', contractNumber: 'CT-MAN-001', clientId: 'cli-1', clientName: 'Tech Solutions & Inovações Ltda.', type: 'Suporte Remoto', startDate: new Date('2024-01-01').toISOString(), endDate: new Date('2024-12-31').toISOString(), monthlyValue: 350.00, scope: 'Suporte remoto ilimitado para central telefônica e 10 ramais.', status: MaintenanceStatus.Active },
  { id: 'man-2', contractNumber: 'CT-MAN-002', clientId: 'cli-3', clientName: 'Comércio de Alimentos Oliveira Ltda.', type: 'Suporte Presencial', startDate: new Date('2023-06-01').toISOString(), endDate: new Date('2024-05-31').toISOString(), monthlyValue: 800.00, scope: 'Uma visita presencial mensal para manutenção preventiva e corretiva da infraestrutura de rede.', status: MaintenanceStatus.Expired },
];

let invoicesDb: Invoice[] = [];

const USER_PASSWORDS = new Map<string | undefined, string>([
    ['administrador', '112233'],
]);

// --- DB LOGIC ---
export const db = {
    findUserByCredentials: (username?: string, password?: string): { user?: User; error?: string } => {
        if (!username || !password) return { error: 'Usuário e senha são obrigatórios.' };
        const user = usersDb.find(u => u.username === username);
        const expectedPassword = user ? USER_PASSWORDS.get(user.username) : undefined;
        if (user && expectedPassword === password) {
            if (user.status === 'Inativo') return { error: 'Este usuário está inativo e não pode acessar o sistema.' };
            const { ...userWithoutPassword } = user;
            return { user: userWithoutPassword as User };
        }
        return { error: 'Usuário ou senha inválidos.' };
    },
    getClients: (): Client[] => clientsDb,
    addClient: (client: Omit<Client, 'id'>): Client => {
        const newClient = { ...client, id: `cli-${Date.now()}` } as Client;
        clientsDb.unshift(newClient);
        return newClient;
    },
    getServiceOrders: (): ServiceOrder[] => serviceOrdersDb,
    addServiceOrder: (order: Omit<ServiceOrder, 'id' | 'clientName' | 'status' | 'serviceOrderNumber'>): { order?: ServiceOrder; error?: string } => {
        const client = clientsDb.find(c => c.id === order.clientId);
        if (!client) return { error: "Cliente não encontrado" };
        
        const newOrderNumber = `OS-${String(serviceOrdersDb.length + 1).padStart(4, '0')}`;

        const newOrder: ServiceOrder = { 
            ...order, 
            id: `os-${Date.now()}`, 
            serviceOrderNumber: newOrderNumber,
            clientName: client.razaoSocial || client.nomeCompleto || 'Cliente Desconhecido', 
            status: OSStatus.Pending,
        };
        serviceOrdersDb.unshift(newOrder);
        return { order: newOrder };
    },
    updateServiceOrder: (updatedOrder: ServiceOrder): ServiceOrder => {
        const orderIndex = serviceOrdersDb.findIndex(order => order.id === updatedOrder.id);
        if (orderIndex === -1) {
            throw new Error("Ordem de serviço não encontrada para atualização.");
        }
        // Ensure clientName is updated if clientId changed
        const client = clientsDb.find(c => c.id === updatedOrder.clientId);
        updatedOrder.clientName = client?.razaoSocial || client?.nomeCompleto || 'Cliente Desconhecido';

        serviceOrdersDb[orderIndex] = updatedOrder;
        // Sort by date again to maintain order
        serviceOrdersDb.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
        return updatedOrder;
    },
    getUsers: (): User[] => usersDb,
    addUser: (user: Omit<User, 'id' | 'status'> & { password?: string }): User => {
        if (user.username && usersDb.some(u => u.username?.toLowerCase() === user.username?.toLowerCase())) {
            throw new Error("Este nome de usuário já está em uso.");
        }
        if (usersDb.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
            throw new Error("Este e-mail já está cadastrado.");
        }
    
        const newUser: User = { ...user, id: `user-${Date.now()}`, status: 'Ativo' };
        if (newUser.username && user.password) {
            USER_PASSWORDS.set(newUser.username, user.password);
        }
        delete (newUser as Partial<User & {password?: string}>).password;
        usersDb.unshift(newUser);
        return newUser;
    },
    getProducts: (): Product[] => productsDb,
    addProduct: (product: Omit<Product, 'id'>): Product => {
        const newProduct = { ...product, id: `prod-${Date.now()}` };
        productsDb.unshift(newProduct);
        return newProduct;
    },
    getQuotes: (): Quote[] => quotesDb,
    addQuote: (quoteData: Omit<Quote, 'id' | 'clientName' | 'quoteNumber' | 'status'>): { quote?: Quote; error?: string } => {
        const client = clientsDb.find(c => c.id === quoteData.clientId);
        if (!client) return { error: "Cliente não encontrado" };
        const newQuote: Quote = { 
            ...quoteData, 
            id: `qt-${Date.now()}`, 
            quoteNumber: `ORC-${String(quotesDb.length + 1).padStart(4, '0')}`, 
            clientName: client.razaoSocial || client.nomeCompleto || 'Cliente Desconhecido', 
            status: QuoteStatus.Draft,
        };
        quotesDb.unshift(newQuote);
        return { quote: newQuote };
    },
    updateQuote: (updatedQuote: Quote): Quote => {
        const quoteIndex = quotesDb.findIndex(quote => quote.id === updatedQuote.id);
        if (quoteIndex === -1) {
            throw new Error("Orçamento não encontrado para atualização.");
        }
         // Ensure clientName is updated if clientId changed
        const client = clientsDb.find(c => c.id === updatedQuote.clientId);
        updatedQuote.clientName = client?.razaoSocial || client?.nomeCompleto || 'Cliente Desconhecido';

        quotesDb[quoteIndex] = updatedQuote;
        // Sort by date again to maintain order
        quotesDb.sort((a, b) => new Date(b.quoteDate).getTime() - new Date(a.quoteDate).getTime());
        return updatedQuote;
    },
    getMaintenanceContracts: (): MaintenanceContract[] => maintenanceDb,
    addMaintenanceContract: (contractData: Omit<MaintenanceContract, 'id' | 'clientName' | 'status' | 'contractNumber'>): { contract?: MaintenanceContract; error?: string } => {
        const client = clientsDb.find(c => c.id === contractData.clientId);
        if (!client) return { error: "Cliente não encontrado" };
        const newContract: MaintenanceContract = {
            ...contractData,
            id: `man-${Date.now()}`,
            contractNumber: `CT-MAN-${String(maintenanceDb.length + 1).padStart(3, '0')}`,
            clientName: client.razaoSocial || client.nomeCompleto || 'Cliente Desconhecido',
            status: MaintenanceStatus.Active,
        };
        maintenanceDb.unshift(newContract);
        return { contract: newContract };
    },
    getInvoices: (): Invoice[] => invoicesDb,
    addInvoice: (invoiceData: { originId: string; originType: 'serviceOrder' | 'quote', items: any[], total: number }): { invoice?: Invoice, error?: string } => {
        const { originId, originType, items, total } = invoiceData;
        let sourceDoc: ServiceOrder | Quote | undefined;
        
        if (originType === 'serviceOrder') {
            sourceDoc = serviceOrdersDb.find(os => os.id === originId);
        } else {
            sourceDoc = quotesDb.find(q => q.id === originId);
        }
        
        if (!sourceDoc) return { error: 'Documento de origem não encontrado.' };
        if (sourceDoc.invoiceId) return { error: 'Este documento já foi faturado.' };

        const client = clientsDb.find(c => c.id === sourceDoc!.clientId);
        if (!client) return { error: 'Cliente não encontrado.' };
        
        const newInvoiceId = `inv-${Date.now()}`;
        const newInvoiceNumber = String(invoicesDb.length + 1).padStart(6, '0');
        const issueDate = new Date();
        const dueDate = new Date(issueDate.setDate(issueDate.getDate() + 15)); // 15 days to pay

        const newInvoice: Invoice = {
            id: newInvoiceId,
            invoiceNumber: newInvoiceNumber,
            originType,
            originId,
            clientId: client.id,
            clientName: client.razaoSocial || client.nomeCompleto || 'Desconhecido',
            issueDate: new Date().toISOString(),
            dueDate: dueDate.toISOString(),
            items,
            total,
            paymentStatus: InvoicePaymentStatus.Pending,
            nfeData: {
                accessKey: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            },
            paymentData: {
                boleto: {
                    linhaDigitavel: `23793.38128 60094.836171 63527.240008 5 ${dueDate.getTime()}00000${(total * 100).toFixed(0).padStart(10, '0')}`,
                    barcodeUrl: 'https://via.placeholder.com/400x80.png?text=Simulated+Barcode',
                },
                pix: {
                    qrCodeUrl: 'https://via.placeholder.com/200x200.png?text=Simulated+PIX+QR+Code',
                    copiaECola: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-42661417400053039865802BR5913NOME DA EMPRESA6009SAO PAULO62070503***6304E2A7',
                }
            }
        };

        sourceDoc.invoiceId = newInvoiceId;
        invoicesDb.unshift(newInvoice);

        return { invoice: newInvoice };
    },
    updateInvoiceStatus: (invoiceId: string, status: InvoicePaymentStatus): { invoice?: Invoice; error?: string } => {
        const invoiceIndex = invoicesDb.findIndex(inv => inv.id === invoiceId);
        if (invoiceIndex === -1) return { error: 'Fatura não encontrada.' };
        
        invoicesDb[invoiceIndex].paymentStatus = status;
        return { invoice: invoicesDb[invoiceIndex] };
    }
};