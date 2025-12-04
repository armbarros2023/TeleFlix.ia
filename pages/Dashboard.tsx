import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { OSStatus } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusCircle, Phone, Activity, CheckCircle2, Clock } from '../components/icons/IconComponents';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { cn } from '@/src/lib/utils';

const StatusCard: React.FC<{ title: string; count: number; color: string; icon: React.ReactNode }> = ({ title, count, color, icon }) => (
    <Card className="overflow-hidden border-none shadow-lg bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</CardTitle>
            <div className={cn("p-2 rounded-full bg-background/50", color)}>
                {icon}
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold tracking-tight">{count}</div>
            <p className="text-xs text-muted-foreground mt-1">Ordens de Serviço</p>
            <div className={cn("h-1 w-full mt-4 rounded-full opacity-20", color.replace('text-', 'bg-'))} />
        </CardContent>
    </Card>
);

const Dashboard: React.FC = () => {
    const { serviceOrders } = useAppContext();
    const navigate = useNavigate();

    const statusCounts = serviceOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<OSStatus, number>);

    const chartData = [
        { name: 'Pendente', count: statusCounts[OSStatus.Pending] || 0, fill: 'hsl(var(--primary))' }, // Primary color
        { name: 'Em Andamento', count: statusCounts[OSStatus.InProgress] || 0, fill: '#3b82f6' }, // Blue
        { name: 'Finalizada', count: statusCounts[OSStatus.Completed] || 0, fill: '#22c55e' }, // Green
    ];

    const recentOrders = [...serviceOrders]
        .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Visão geral do sistema e atividades recentes.</p>
                </div>
                <Button onClick={() => navigate('/service-orders/new')} className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Nova Ordem de Serviço
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatusCard
                    title="Pendentes"
                    count={statusCounts[OSStatus.Pending] || 0}
                    color="text-amber-500"
                    icon={<Clock className="h-4 w-4" />}
                />
                <StatusCard
                    title="Em Andamento"
                    count={statusCounts[OSStatus.InProgress] || 0}
                    color="text-blue-500"
                    icon={<Activity className="h-4 w-4" />}
                />
                <StatusCard
                    title="Finalizadas"
                    count={statusCounts[OSStatus.Completed] || 0}
                    color="text-green-500"
                    icon={<CheckCircle2 className="h-4 w-4" />}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-none shadow-xl bg-card/40 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle>Visão Geral das OS</CardTitle>
                        <CardDescription>Distribuição das ordens de serviço por status.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                    dx={-10}
                                />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--accent)/0.2)' }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '0.5rem',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3 border-none shadow-xl bg-card/40 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle>Atividades Recentes</CardTitle>
                        <CardDescription>Últimas ordens de serviço agendadas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentOrders.map(order => (
                                <div key={order.id} className="flex items-center group">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="ml-4 space-y-1 flex-1">
                                        <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{order.serviceType}</p>
                                        <p className="text-sm text-muted-foreground">{order.clientName}</p>
                                    </div>
                                    <div className="ml-auto font-medium text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                                        {new Date(order.scheduledDate).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                            {recentOrders.length === 0 && (
                                <div className="text-center text-muted-foreground py-8">
                                    Nenhuma atividade recente.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;