import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Client, ServiceOrder, User, Quote, Product, MaintenanceContract, Invoice } from '../types';
import { api } from '../services/api';

export interface AppContextType {
  isLoggedIn: boolean;
  currentUser: User | null;
  login: (username?: string, password?: string) => Promise<void>;
  logout: () => void;
  clients: Client[];
  serviceOrders: ServiceOrder[];
  users: User[];
  quotes: Quote[];
  products: Product[];
  maintenanceContracts: MaintenanceContract[];
  invoices: Invoice[];
  addServiceOrder: (order: Omit<ServiceOrder, 'id' | 'clientName' | 'status' | 'serviceOrderNumber'>) => Promise<void>;
  updateServiceOrder: (order: ServiceOrder) => Promise<void>;
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'status'> & { password?: string }) => Promise<void>;
  addQuote: (quote: Omit<Quote, 'id' | 'clientName' | 'quoteNumber' | 'status'>) => Promise<void>;
  updateQuote: (quote: Quote) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  addMaintenanceContract: (contract: Omit<MaintenanceContract, 'id' | 'clientName' | 'status' | 'contractNumber'>) => Promise<void>;
  addInvoice: (invoiceData: { originId: string; originType: 'serviceOrder' | 'quote'; items: any[]; total: number }) => Promise<Invoice>;
  updateInvoiceStatus: (invoiceId: string, status: Invoice['paymentStatus']) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => localStorage.getItem('fieldservice_isLoggedIn') === 'true');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [clients, setClients] = useState<Client[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [maintenanceContracts, setMaintenanceContracts] = useState<MaintenanceContract[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
        return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
      setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const [clientsData, serviceOrdersData, usersData, productsData, quotesData, maintenanceData, invoicesData] = await Promise.all([
            api.getClients(),
            api.getServiceOrders(),
            api.getUsers(),
            api.getProducts(),
            api.getQuotes(),
            api.getMaintenanceContracts(),
            api.getInvoices(),
        ]);
        setClients(clientsData);
        setServiceOrders(serviceOrdersData);
        setUsers(usersData);
        setProducts(productsData);
        setQuotes(quotesData);
        setMaintenanceContracts(maintenanceData);
        setInvoices(invoicesData);
    } catch (e) {
        setError("Falha ao carregar os dados iniciais do aplicativo.");
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
        fetchData();
    } else {
        setIsLoading(false);
    }
  }, [isLoggedIn, fetchData]);

  const login = useCallback(async (username?: string, password?: string) => {
    const user = await api.login(username, password);
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('fieldservice_isLoggedIn', 'true');
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('fieldservice_isLoggedIn');
    setClients([]);
    setServiceOrders([]);
    setUsers([]);
    setProducts([]);
    setQuotes([]);
    setMaintenanceContracts([]);
    setInvoices([]);
  }, []);

  const addServiceOrder = useCallback(async (order: Omit<ServiceOrder, 'id' | 'clientName' | 'status' | 'serviceOrderNumber'>) => {
    await api.addServiceOrder(order);
    setServiceOrders(await api.getServiceOrders());
  }, []);

  const updateServiceOrder = useCallback(async (order: ServiceOrder) => {
    await api.updateServiceOrder(order);
    setServiceOrders(await api.getServiceOrders());
  }, []);

  const addClient = useCallback(async (clientData: Omit<Client, 'id'>) => {
    await api.addClient(clientData);
    setClients(await api.getClients());
  }, []);

  const addUser = useCallback(async (userData: Omit<User, 'id' | 'status'> & { password?: string }) => {
    await api.addUser(userData);
    setUsers(await api.getUsers());
  }, []);
  
  const addQuote = useCallback(async (quoteData: Omit<Quote, 'id' | 'clientName' | 'quoteNumber' | 'status'>) => {
    await api.addQuote(quoteData);
    setQuotes(await api.getQuotes());
  }, []);
  
  const updateQuote = useCallback(async (quote: Quote) => {
    await api.updateQuote(quote);
    setQuotes(await api.getQuotes());
  }, []);

  const addProduct = useCallback(async (productData: Omit<Product, 'id'>) => {
    await api.addProduct(productData);
    setProducts(await api.getProducts());
  }, []);

  const addMaintenanceContract = useCallback(async (contractData: Omit<MaintenanceContract, 'id' | 'clientName' | 'status' | 'contractNumber'>) => {
    await api.addMaintenanceContract(contractData);
    setMaintenanceContracts(await api.getMaintenanceContracts());
  }, []);

  const addInvoice = useCallback(async (invoiceData: { originId: string; originType: 'serviceOrder' | 'quote'; items: any[]; total: number }): Promise<Invoice> => {
    const newInvoice = await api.addInvoice(invoiceData);
    // Refetch related data that was mutated on the backend
    await Promise.all([
        setInvoices(await api.getInvoices()),
        setServiceOrders(await api.getServiceOrders()),
        setQuotes(await api.getQuotes())
    ]);
    return newInvoice;
  }, []);

  const updateInvoiceStatus = useCallback(async (invoiceId: string, status: Invoice['paymentStatus']) => {
    await api.updateInvoiceStatus(invoiceId, status);
    setInvoices(await api.getInvoices());
  }, []);

  const value = {
    isLoggedIn,
    currentUser,
    login,
    logout,
    clients,
    serviceOrders,
    users,
    quotes,
    products,
    maintenanceContracts,
    invoices,
    addServiceOrder,
    updateServiceOrder,
    addClient,
    addUser,
    addQuote,
    updateQuote,
    addProduct,
    addMaintenanceContract,
    addInvoice,
    updateInvoiceStatus,
    isLoading,
    error,
    theme,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};