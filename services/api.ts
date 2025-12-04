import { Client, ServiceOrder, User, Quote, Product, MaintenanceContract, Invoice } from '../types';
import { db } from './mockDb';

// Este arquivo foi modificado para usar um banco de dados em memória (mock)
// em vez de fazer chamadas de rede para um backend.
// Isso resolve os erros "Failed to fetch" e permite que o aplicativo funcione de forma independente.

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const simulateApiCall = <T>(data: T, delay = 200): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API Request Failed');
    }

    return response.json();
}

const login = async (username?: string, password?: string): Promise<User> => {
    if (USE_MOCK) {
        const { user, error } = db.findUserByCredentials(username, password);
        if (error) {
            throw new Error(error);
        }
        return simulateApiCall(user!);
    }

    const response = await apiRequest<{ user: User; token: string }>('/sessions', {
        method: 'POST',
        body: JSON.stringify({ email: username, password }),
    });

    localStorage.setItem('token', response.token);
    return response.user;
};

const getServiceOrders = async (): Promise<ServiceOrder[]> => {
    return simulateApiCall(db.getServiceOrders());
};

const addServiceOrder = async (order: Omit<ServiceOrder, 'id' | 'clientName' | 'status' | 'serviceOrderNumber'>): Promise<ServiceOrder> => {
    const result = db.addServiceOrder(order);
    if (result.error) {
        throw new Error(result.error);
    }
    return simulateApiCall(result.order!);
};

const updateServiceOrder = async (order: ServiceOrder): Promise<ServiceOrder> => {
    return simulateApiCall(db.updateServiceOrder(order));
};

const getClients = async (): Promise<Client[]> => {
    return simulateApiCall(db.getClients());
};

const addClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
    return simulateApiCall(db.addClient(client));
};

const getUsers = async (): Promise<User[]> => {
    return simulateApiCall(db.getUsers());
};

const addUser = async (user: Omit<User, 'id' | 'status'> & { password?: string }): Promise<User> => {
    try {
        const newUser = db.addUser(user);
        return simulateApiCall(newUser);
    } catch (e) {
        throw e;
    }
};

const getProducts = async (): Promise<Product[]> => {
    return simulateApiCall(db.getProducts());
};

const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    return simulateApiCall(db.addProduct(product));
};

const getQuotes = async (): Promise<Quote[]> => {
    return simulateApiCall(db.getQuotes());
};

const addQuote = async (quote: Omit<Quote, 'id' | 'clientName' | 'quoteNumber' | 'status'>): Promise<Quote> => {
    const result = db.addQuote(quote);
    if (result.error) {
        throw new Error(result.error);
    }
    return simulateApiCall(result.quote!);
};

const updateQuote = async (quote: Quote): Promise<Quote> => {
    return simulateApiCall(db.updateQuote(quote));
};

const getMaintenanceContracts = async (): Promise<MaintenanceContract[]> => {
    return simulateApiCall(db.getMaintenanceContracts());
};

const addMaintenanceContract = async (contract: Omit<MaintenanceContract, 'id' | 'clientName' | 'status' | 'contractNumber'>): Promise<MaintenanceContract> => {
    const result = db.addMaintenanceContract(contract);
    if (result.error) {
        throw new Error(result.error);
    }
    return simulateApiCall(result.contract!);
};

const getInvoices = async (): Promise<Invoice[]> => {
    return simulateApiCall(db.getInvoices());
};

const addInvoice = async (invoiceData: { originId: string; originType: 'serviceOrder' | 'quote'; items: any[]; total: number }): Promise<Invoice> => {
    const result = db.addInvoice(invoiceData);
    if (result.error) {
        throw new Error(result.error);
    }
    return simulateApiCall(result.invoice!);
};

const updateInvoiceStatus = async (invoiceId: string, status: Invoice['paymentStatus']): Promise<Invoice> => {
    const result = db.updateInvoiceStatus(invoiceId, status);
    if (result.error) {
        throw new Error(result.error);
    }
    return simulateApiCall(result.invoice!);
};


export const api = {
    login,
    getClients,
    addClient,
    getServiceOrders,
    addServiceOrder,
    updateServiceOrder,
    getUsers,
    addUser,
    getProducts,
    addProduct,
    getQuotes,
    addQuote,
    updateQuote,
    getMaintenanceContracts,
    addMaintenanceContract,
    getInvoices,
    addInvoice,
    updateInvoiceStatus,
};
