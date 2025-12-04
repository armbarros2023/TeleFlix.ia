import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusCircle } from '../components/icons/IconComponents';
import { Product } from '../types';
import Spinner from '../components/ui/Spinner';

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const Products: React.FC = () => {
    const { products, isLoading } = useAppContext();
    const navigate = useNavigate();

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Spinner className="w-8 h-8 text-primary" />
                </div>
            );
        }

        if (products.length === 0) {
            return (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">Nenhum produto encontrado.</p>
                </div>
            );
        }

        return (
            <div className="border rounded-lg">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">SKU</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nome</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoria</th>
                                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Estoque</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Preço de Venda</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {products.map((product: Product) => (
                                <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{product.sku}</td>
                                    <td className="p-4 align-middle">{product.name}</td>
                                    <td className="p-4 align-middle">{product.category}</td>
                                    <td className="p-4 align-middle text-center">{`${product.quantityInStock} ${product.unitOfMeasure}(s)`}</td>
                                    <td className="p-4 align-middle text-right">{formatCurrency(product.sellingPrice)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Produtos</h1>
                <Button onClick={() => navigate('/products/new')}>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Novo Produto
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Produtos</CardTitle>
                    <CardDescription>Gerencie seus produtos, peças e estoque.</CardDescription>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
};

export default Products;