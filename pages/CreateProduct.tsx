import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Label from '../components/ui/Label';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Product } from '../types';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Spinner from '../components/ui/Spinner';

// --- Helper Functions for Currency ---
const parseCurrency = (value: string): number => {
    return Number(value.replace(/[^0-9,-]+/g,"").replace(",", ".")) || 0;
};

const formatToCurrencyInput = (value: number): string => {
    if (isNaN(value)) return '0,00';
    return value.toFixed(2).replace('.', ',');
};

const initialFormState: Omit<Product, 'id'> = {
    name: '',
    sku: '',
    description: '',
    category: 'Telefonia',
    unitOfMeasure: 'unidade',
    quantityInStock: 0,
    costPrice: 0,
    sellingPrice: 0,
    supplier: '',
};

const CreateProduct: React.FC = () => {
    const { addProduct } = useAppContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: Number(value) || 0 }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: parseCurrency(value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.sku || !formData.sellingPrice) {
            return alert('Nome, SKU e Preço de Venda são obrigatórios.');
        }
        
        setIsSubmitting(true);
        try {
            await addProduct(formData);
            alert('Produto cadastrado com sucesso!');
            navigate('/products');
        } catch(error) {
            alert(`Falha ao cadastrar produto: ${(error as Error).message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            <h1 className="text-3xl font-bold text-white">Cadastro de Produto</h1>

            <fieldset disabled={isSubmitting}>
                <Card>
                    <CardHeader>
                        <CardTitle>Detalhes do Produto</CardTitle>
                        <CardDescription>Informações básicas para identificação do item.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome do Produto *</Label>
                                <Input id="name" value={formData.name} onChange={handleChange} required placeholder="Ex: Telefone IP XPTO" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU / Código *</Label>
                                <Input id="sku" value={formData.sku} onChange={handleChange} required placeholder="Ex: TEL-IP-001" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea id="description" value={formData.description} onChange={handleChange} placeholder="Detalhes técnicos, cor, modelo, etc." />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="category">Categoria</Label>
                                <Select id="category" value={formData.category} onChange={handleChange}>
                                    <option value="Telefonia">Telefonia</option>
                                    <option value="Redes">Redes</option>
                                    <option value="Segurança">Segurança</option>
                                    <option value="Manutenção">Manutenção</option>
                                    <option value="Outros">Outros</option>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unitOfMeasure">Unidade de Medida</Label>
                                <Select id="unitOfMeasure" value={formData.unitOfMeasure} onChange={handleChange}>
                                    <option value="unidade">Unidade</option>
                                    <option value="caixa">Caixa</option>
                                    <option value="peça">Peça</option>
                                    <option value="metro">Metro</option>
                                    <option value="outro">Outro</option>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Estoque e Preços</CardTitle>
                        <CardDescription>Controle de inventário e valores de compra e venda.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="quantityInStock">Quantidade em Estoque</Label>
                            <Input id="quantityInStock" type="number" value={formData.quantityInStock} onChange={handleNumericChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="costPrice">Preço de Custo (R$)</Label>
                            <Input id="costPrice" value={formatToCurrencyInput(formData.costPrice)} onChange={handlePriceChange} placeholder="R$ 0,00" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sellingPrice">Preço de Venda (R$) *</Label>
                            <Input id="sellingPrice" value={formatToCurrencyInput(formData.sellingPrice)} onChange={handlePriceChange} required placeholder="R$ 0,00" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Informações Adicionais</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="supplier">Fornecedor</Label>
                            <Input id="supplier" value={formData.supplier} onChange={handleChange} placeholder="Nome do fornecedor ou distribuidor" />
                        </div>
                    </CardContent>
                </Card>
            </fieldset>

            <div className="fixed bottom-0 right-0 w-full lg:w-[calc(100%-16rem)] bg-card border-t border-border p-4 flex justify-end space-x-4">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={isSubmitting}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Spinner className="w-4 h-4 mr-2" />}
                    {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
                </Button>
            </div>
        </form>
    );
};

export default CreateProduct;