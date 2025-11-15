import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PrescriptionRequest {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  file_path: string | null;
  status: string;
  created_at: string;
  user_id: string | null;
}

const PrescriptionRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<PrescriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<PrescriptionRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prescription_requests' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests((data || []) as any);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar solicitações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('prescription_requests' as any)
        .update({ status: newStatus } as any)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: "O status da solicitação foi atualizado com sucesso",
      });

      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const downloadFile = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('prescriptions')
        .download(filePath);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'receita';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: "Erro ao baixar arquivo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Progresso';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background py-8">
          <div className="container mx-auto px-4 text-center">Carregando...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Solicitações de Receitas</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie as solicitações de orçamento e receitas dos clientes
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_progress">Em Progresso</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Solicitações</CardTitle>
              <CardDescription>
                Total: {filteredRequests.length} solicitação(ões)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Arquivo</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(request.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>{request.name}</TableCell>
                        <TableCell>{request.phone}</TableCell>
                        <TableCell>
                          <Select
                            value={request.status}
                            onValueChange={(value) => updateStatus(request.id, value)}
                          >
                            <SelectTrigger className={`w-[140px] ${getStatusColor(request.status)}`}>
                              <SelectValue>{getStatusText(request.status)}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="in_progress">Em Progresso</SelectItem>
                              <SelectItem value="completed">Concluído</SelectItem>
                              <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {request.file_path ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadFile(request.file_path!)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Baixar
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">Sem arquivo</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDetailsModal(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredRequests.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma solicitação encontrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />

      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>
              Informações completas da solicitação
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome</p>
                <p className="text-foreground">{selectedRequest.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                <p className="text-foreground">{selectedRequest.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data</p>
                <p className="text-foreground">
                  {new Date(selectedRequest.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={getStatusColor(selectedRequest.status)}>
                  {getStatusText(selectedRequest.status)}
                </Badge>
              </div>
              {selectedRequest.message && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mensagem</p>
                  <p className="text-foreground whitespace-pre-wrap">{selectedRequest.message}</p>
                </div>
              )}
              {selectedRequest.file_path && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Arquivo</p>
                  <Button
                    variant="outline"
                    onClick={() => downloadFile(selectedRequest.file_path!)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Arquivo
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrescriptionRequests;
