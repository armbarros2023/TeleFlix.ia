import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    BarChart3, Phone, Building2, LayoutDashboard, ChevronDown, Package, Users, Notebook, LogOut, Wrench, Receipt
} from '../icons/IconComponents';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import { cn } from '@/src/lib/utils';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAppContext();

    const [openSections, setOpenSections] = useState({
        os: false,
        cadastros: false,
        orcamentos: false,
        manutencao: false,
        financeiro: false,
    });

    useEffect(() => {
        setOpenSections({
            os: location.pathname.startsWith('/service-orders'),
            cadastros: location.pathname.startsWith('/clients') || location.pathname.startsWith('/products') || location.pathname.startsWith('/users'),
            orcamentos: location.pathname.startsWith('/quotes'),
            manutencao: location.pathname.startsWith('/maintenance'),
            financeiro: location.pathname.startsWith('/finance'),
        });
    }, [location.pathname]);

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center w-full text-left px-4 py-2 rounded-md transition-all duration-200 text-sm group ${isActive
            ? 'bg-primary/10 text-primary font-medium shadow-[0_0_10px_rgba(var(--primary),0.2)]'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
        }`;

    const topLevelLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${isActive
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }`;

    const sectionButtonClasses = "flex items-center justify-between w-full px-4 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-200 mb-1";

    return (
        <aside className="w-72 bg-card/50 backdrop-blur-xl border-r border-border flex flex-col h-full shadow-2xl z-50">
            <div className="h-24 flex items-center justify-center border-b border-border/50 px-6 bg-card/30">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 mr-4 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                    <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                    <span className="text-xs font-bold text-primary tracking-wider uppercase">SISTEMA</span>
                    <h1 className="text-2xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        TELFIX
                    </h1>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <NavLink to="/dashboard" className={topLevelLinkClasses}>
                    <LayoutDashboard className="w-5 h-5 mr-3" />
                    <span className="font-medium">Dashboard</span>
                </NavLink>

                <div className="pt-4 pb-2">
                    <p className="px-4 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider mb-2">Gerenciamento</p>

                    <button onClick={() => toggleSection('os')} className={sectionButtonClasses} aria-expanded={openSections.os}>
                        <span className="flex items-center font-medium">
                            <Phone className="w-5 h-5 mr-3" />
                            Ordens de Serviço
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSections.os ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${openSections.os ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-4 border-l-2 border-border ml-4 space-y-1">
                            <NavLink to="/service-orders/new" className={navLinkClasses}>
                                <span>Nova OS</span>
                            </NavLink>
                            <NavLink to="/service-orders" className={navLinkClasses}>
                                <span>Listar OS</span>
                            </NavLink>
                        </div>
                    </div>

                    <button onClick={() => toggleSection('cadastros')} className={sectionButtonClasses} aria-expanded={openSections.cadastros}>
                        <span className="flex items-center font-medium">
                            <Building2 className="w-5 h-5 mr-3" />
                            Cadastros
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSections.cadastros ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${openSections.cadastros ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-4 border-l-2 border-border ml-4 space-y-1">
                            <NavLink to="/clients" className={navLinkClasses}>
                                <span>Clientes</span>
                            </NavLink>
                            <NavLink to="/products" className={navLinkClasses}>
                                <span>Produtos</span>
                            </NavLink>
                            <NavLink to="/users" className={navLinkClasses}>
                                <span>Usuários</span>
                            </NavLink>
                        </div>
                    </div>
                </div>

                <div className="pt-2 pb-2">
                    <p className="px-4 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider mb-2">Comercial</p>

                    <button onClick={() => toggleSection('orcamentos')} className={sectionButtonClasses} aria-expanded={openSections.orcamentos}>
                        <span className="flex items-center font-medium">
                            <Notebook className="w-5 h-5 mr-3" />
                            Orçamentos
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSections.orcamentos ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${openSections.orcamentos ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-4 border-l-2 border-border ml-4 space-y-1">
                            <NavLink to="/quotes/new" className={navLinkClasses}>
                                <span>Criar Orçamento</span>
                            </NavLink>
                            <NavLink to="/quotes" className={navLinkClasses}>
                                <span>Listar Orçamentos</span>
                            </NavLink>
                        </div>
                    </div>

                    <button onClick={() => toggleSection('manutencao')} className={sectionButtonClasses} aria-expanded={openSections.manutencao}>
                        <span className="flex items-center font-medium">
                            <Wrench className="w-5 h-5 mr-3" />
                            Manutenção
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSections.manutencao ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${openSections.manutencao ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-4 border-l-2 border-border ml-4 space-y-1">
                            <NavLink to="/maintenance/new" className={navLinkClasses}>
                                <span>Novo Contrato</span>
                            </NavLink>
                            <NavLink to="/maintenance" className={navLinkClasses}>
                                <span>Listar Contratos</span>
                            </NavLink>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <p className="px-4 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider mb-2">Financeiro</p>

                    <button onClick={() => toggleSection('financeiro')} className={sectionButtonClasses} aria-expanded={openSections.financeiro}>
                        <span className="flex items-center font-medium">
                            <Receipt className="w-5 h-5 mr-3" />
                            Financeiro
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSections.financeiro ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${openSections.financeiro ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-4 border-l-2 border-border ml-4 space-y-1">
                            <NavLink to="/finance/billing" className={navLinkClasses}>
                                <span>Faturamento</span>
                            </NavLink>
                        </div>
                    </div>

                    <NavLink to="/reports" className={topLevelLinkClasses}>
                        <BarChart3 className="w-5 h-5 mr-3" />
                        <span className="font-medium">Relatórios</span>
                    </NavLink>
                </div>
            </nav>

            <div className="mt-auto px-4 py-6 border-t border-border/50 bg-card/30">
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-4 py-3 rounded-xl transition-all duration-200 group">
                    <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Sair do Sistema</span>
                </Button>
                <p className="text-[10px] text-muted-foreground/40 text-center mt-4 uppercase tracking-widest">© 2024 TeleFlix</p>
            </div>
        </aside>
    );
};

export default Sidebar;