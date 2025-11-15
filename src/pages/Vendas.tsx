
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, ShoppingBag, Calendar, Download, Filter, Search } from "lucide-react";

const Vendas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const salesStats = [
    { title: "Vendas Hoje", value: "R$ 1.234", change: "+5.2%", icon: DollarSign, color: "bg-green-500" },
    { title: "Vendas do Mês", value: "R$ 45.230", change: "+12.3%", icon: TrendingUp, color: "bg-blue-500" },
    { title: "Pedidos Hoje", value: "23", change: "+8.1%", icon: ShoppingBag, color: "bg-purple-500" },
    { title: "Pedidos do Mês", value: "456", change: "+15.7%", icon: Calendar, color: "bg-orange-500" },
  ];

  const salesData = [
    {
      id: "VEN-001",
      orderId: "ORD-001",
      customer: "João Silva",
      date: "2024-01-28",
      products: ["Paracetamol 500mg", "Ibuprofeno 600mg"],
      quantity: 3,
      total: 85.40,
      commission: 8.54,
      status: "completed"
    },
    {
      id: "VEN-002",
      orderId: "ORD-002",
      customer: "Maria Santos",
      date: "2024-01-28",
      products: ["Protetor Solar FPS 60", "Vitamina C"],
      quantity: 2,
      total: 73.90,
      commission: 7.39,
      status: "completed"
    },
    {
      id: "VEN-003",
      orderId: "ORD-003",
      customer: "Carlos Lima",
      date: "2024-01-27",
      products: ["Shampoo Anticaspa"],
      quantity: 1,
      total: 22.90,
      commission: 2.29,
      status: "completed"
    },
    {
      id: "VEN-004",
      orderId: "ORD-004",
      customer: "Ana Costa",
      date: "2024-01-27",
      products: ["Dipirona", "Omeprazol", "Vitamina D"],
      quantity: 5,
      total: 156.50,
      commission: 15.65,
      status: "pending"
    },
    {
      id: "VEN-005",
      orderId: "ORD-005",
      customer: "Pedro Oliveira",
      date: "2024-01-26",
      products: ["Creme Hidratante", "Protetor Labial"],
      quantity: 2,
      total: 67.80,
      commission: 6.78,
      status: "completed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Concluída";
      case "pending": return "Pendente";
      case "cancelled": return "Cancelada";
      default: return "Desconhecido";
    }
  };

  const filteredSales = salesData.filter(sale => {
    const matchesSearch = sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
    // Simple date filter - in real app, implement proper date filtering
    const matchesDate = dateFilter === "all" || true;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalCommission = filteredSales.reduce((sum, sale) => sum + sale.commission, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-8 h-8 mr-3" />
            Relatório de Vendas
          </h1>
          <p className="text-gray-600 mt-2">Acompanhe suas vendas e comissões detalhadamente</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {salesStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.color} p-2 rounded-full`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> em relação ao período anterior
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  R$ {totalSales.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Total em Vendas (Filtradas)</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalCommission.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Total em Comissões</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredSales.length}
                </div>
                <p className="text-sm text-gray-600">Número de Vendas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por ID da venda, pedido ou cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                  <SelectItem value="year">Este ano</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="completed">Concluídas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Vendas ({filteredSales.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Venda</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto">
                        {sale.orderId}
                      </Button>
                    </TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>
                      {new Date(sale.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-48">
                        {sale.products.slice(0, 2).map((product, index) => (
                          <div key={index} className="text-sm text-gray-600 truncate">
                            • {product}
                          </div>
                        ))}
                        {sale.products.length > 2 && (
                          <div className="text-xs text-blue-600">
                            +{sale.products.length - 2} outros
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell className="font-bold text-blue-600">
                      R$ {sale.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      R$ {sale.commission.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(sale.status)}>
                        {getStatusText(sale.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredSales.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma venda encontrada</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Ainda não há vendas registradas no sistema"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Vendas;
