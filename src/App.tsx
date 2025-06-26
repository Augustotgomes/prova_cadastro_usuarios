import { JSX, useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import { UserProvider } from "./context";
import { UserTable, ModalUser, Loader } from "./components";
import { useUsers, useModal, useFilter, useUserOperations } from "./hooks";
import { User } from "./interfaces";
import { userService } from "./services";

function AppContent(): JSX.Element {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<User | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const {
    users,
    loading,
    error,
    totalUsers,
    totalPages,
    filter,
    loadUsers,
    loadInitialUsers,
    refreshUsers,
  } = useUsers();

  const { modal, openCreateModal, openEditModal, openViewModal, closeModal } =
    useModal();

  const { updateSearch, updatePage, updateLimit } = useFilter();

  const { removeUser } = useUserOperations();

  // Load initial data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Add sample users if none exist
        const stats = await userService.getUserStats();
        if (stats.total === 0) {
          await userService.seedSampleUsers();
        }

        await loadInitialUsers();
      } catch (error) {
        console.error("Erro ao inicializar aplicação:", error);
      } finally {
        setInitialLoad(false);
      }
    };

    initializeApp();
  }, [loadInitialUsers]);

  // Reload users when filter changes
  const { page, limit, search } = filter;

  useEffect(() => {
    if (!initialLoad) {
      loadUsers();
    }
  }, [page, limit, search, loadUsers, initialLoad]);

  const handleDeleteUser = async (user: User) => {
    try {
      await removeUser(user.id);
      setShowDeleteConfirm(null);
      refreshUsers();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const handleUserSuccess = () => {
    refreshUsers();
  };

  if (initialLoad) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Loader text="Carregando aplicação..." size="lg" />
      </div>
    );
  }

  return (
    <div className="App">
      <Container fluid>
        {/* Header */}
        <header className="bg-primary text-white p-3 mb-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="h3 mb-0">
                <i className="bi bi-people-fill me-2"></i>
                Sistema de Cadastro de Usuários
              </h1>
              <small className="opacity-75">
                Gerencie usuários com integração ViaCEP
              </small>
            </Col>
            <Col xs="auto">
              <Button
                variant="light"
                onClick={openCreateModal}
                className="d-flex align-items-center"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Novo Usuário
              </Button>
            </Col>
          </Row>
        </header>

        <main>
          {/* Error Alert */}
          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => window.location.reload()}
            >
              <Alert.Heading>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Erro
              </Alert.Heading>
              {error}
            </Alert>
          )}

          {/* Stats Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <div className="display-6 text-primary">
                    <i className="bi bi-people"></i>
                  </div>
                  <Card.Title className="h5 mt-2">Total de Usuários</Card.Title>
                  <Card.Text className="h4 text-primary mb-0">
                    {totalUsers}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <div className="display-6 text-info">
                    <i className="bi bi-file-earmark-text"></i>
                  </div>
                  <Card.Title className="h5 mt-2">Páginas</Card.Title>
                  <Card.Text className="h4 text-info mb-0">
                    {totalPages}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <div className="display-6 text-success">
                    <i className="bi bi-search"></i>
                  </div>
                  <Card.Title className="h5 mt-2">Filtro Ativo</Card.Title>
                  <Card.Text className="h4 text-success mb-0">
                    {filter.search ? "Sim" : "Não"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <div className="display-6 text-warning">
                    <i className="bi bi-eye"></i>
                  </div>
                  <Card.Title className="h5 mt-2">Por Página</Card.Title>
                  <Card.Text className="h4 text-warning mb-0">
                    {filter.limit}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* User Table */}
          <Card>
            <Card.Header className="bg-light">
              <Row className="align-items-center">
                <Col>
                  <h5 className="mb-0">
                    <i className="bi bi-table me-2"></i>
                    Lista de Usuários
                  </h5>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={refreshUsers}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Atualizar
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="p-0">
              <UserTable
                users={users}
                loading={loading}
                totalRows={totalUsers}
                currentPage={filter.page}
                perPage={filter.limit}
                searchTerm={filter.search}
                onEdit={openEditModal}
                onDelete={setShowDeleteConfirm}
                onView={openViewModal}
                onPageChange={updatePage}
                onPerRowsChange={(newPerPage, page) => {
                  updateLimit(newPerPage);

                  updatePage(page);
                }}
                onSearchChange={updateSearch}
              />
            </Card.Body>
          </Card>
        </main>

        {/* User Modal */}
        <ModalUser
          show={modal.isOpen}
          mode={modal.mode}
          userId={modal.selectedUser}
          onHide={closeModal}
          onSuccess={handleUserSuccess}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                    Confirmar Exclusão
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteConfirm(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Tem certeza que deseja excluir o usuário:</p>
                  <div className="bg-light p-3 rounded">
                    <strong>{showDeleteConfirm.name}</strong>
                    <br />
                    <small className="text-muted">
                      {showDeleteConfirm.email}
                    </small>
                  </div>
                  <p className="text-danger mt-3 mb-0">
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
                <div className="modal-footer">
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteUser(showDeleteConfirm)}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Excluir Usuário
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

function App(): JSX.Element {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
