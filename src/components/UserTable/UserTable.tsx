import { JSX, useMemo } from "react";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
import { Button, Badge, Form, Row, Col, InputGroup } from "react-bootstrap";
import { User } from "../../interfaces";
import { formatCpf, formatPhone, formatDate } from "../../services";
import { Loader } from "../Loader";

interface UserTableProps {
  users: User[];
  loading: boolean;
  totalRows: number;
  currentPage: number;
  perPage: number;
  searchTerm: string;
  onEdit: (userId: string) => void;
  onDelete: (user: User) => void;
  onView: (userId: string) => void;
  onPageChange: (page: number) => void;
  onPerRowsChange: (newPerPage: number, page: number) => void;
  onSearchChange: (searchTerm: string) => void;
}

export function UserTable({
  users,
  loading,
  totalRows,
  currentPage,
  perPage,
  searchTerm,
  onEdit,
  onDelete,
  onView,
  onPageChange,
  onPerRowsChange,
  onSearchChange,
}: UserTableProps): JSX.Element {
  const columns: TableColumn<User>[] = useMemo(
    () => [
      {
        name: "Nome",
        selector: (row: User) => row.name,
        sortable: true,
        minWidth: "200px",
        cell: (row: User) => (
          <div>
            <div className="fw-bold">{row.name}</div>
            <small className="text-muted">{row.email}</small>
          </div>
        ),
      },
      {
        name: "CPF",
        selector: (row: User) => row.cpf,
        sortable: true,
        minWidth: "130px",
        cell: (row: User) => (
          <span className="font-monospace">{formatCpf(row.cpf)}</span>
        ),
      },
      {
        name: "Telefone",
        selector: (row: User) => row.phone,
        sortable: true,
        minWidth: "140px",
        cell: (row: User) => (
          <span className="font-monospace">{formatPhone(row.phone)}</span>
        ),
      },
      {
        name: "Cidade/UF",
        selector: (row: User) => `${row.address.city}/${row.address.uf}`,
        sortable: true,
        minWidth: "150px",
        cell: (row: User) => (
          <div>
            <div>{row.address.city}</div>
            <Badge bg="secondary" className="font-monospace">
              {row.address.uf}
            </Badge>
          </div>
        ),
      },
      {
        name: "Data Nascimento",
        selector: (row: User) => row.birthDate,
        sortable: true,
        minWidth: "130px",
        cell: (row: User) => <span>{formatDate(row.birthDate)}</span>,
      },
      {
        name: "Ações",
        cell: (row: User) => (
          <div className="d-flex gap-1">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onView(row.id)}
              title="Visualizar"
            >
              <i className="bi bi-eye"></i>
            </Button>
            <Button
              variant="outline-warning"
              size="sm"
              onClick={() => onEdit(row.id)}
              title="Editar"
            >
              <i className="bi bi-pencil"></i>
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(row)}
              title="Excluir"
            >
              <i className="bi bi-trash"></i>
            </Button>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        minWidth: "120px",
      },
    ],
    [onView, onEdit, onDelete]
  );

  const customStyles: TableStyles = {
    header: {
      style: {
        minHeight: "56px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid" as const,
        borderTopWidth: "1px",
        borderTopColor: "#dee2e6",
      },
    },
    headCells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid" as const,
          borderRightWidth: "1px",
          borderRightColor: "#dee2e6",
        },
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
    cells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid" as const,
          borderRightWidth: "1px",
          borderRightColor: "#dee2e6",
        },
        fontSize: "14px",
      },
    },
  };

  const paginationComponentOptions = {
    rowsPerPageText: "Linhas por página:",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  return (
    <div className="user-table">
      {/* Search Bar */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por nome, email, CPF ou telefone..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => onSearchChange("")}
                title="Limpar busca"
              >
                <i className="bi bi-x"></i>
              </Button>
            )}
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
          <small className="text-muted">
            {totalRows > 0 ? (
              <>
                Mostrando {Math.min((currentPage - 1) * perPage + 1, totalRows)}{" "}
                a {Math.min(currentPage * perPage, totalRows)} de {totalRows}{" "}
                registros
                {searchTerm && " (filtrados)"}
              </>
            ) : (
              "Nenhum registro encontrado"
            )}
          </small>
        </Col>
      </Row>

      {/* Data Table */}
      <div className="border rounded">
        <DataTable
          columns={columns}
          data={users}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationDefaultPage={currentPage}
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={[5, 10, 20, 50]}
          onChangeRowsPerPage={onPerRowsChange}
          onChangePage={onPageChange}
          paginationComponentOptions={paginationComponentOptions}
          progressPending={loading}
          progressComponent={
            <div className="p-4">
              <Loader text="Carregando usuários..." size="lg" />
            </div>
          }
          noDataComponent={
            <div className="p-4 text-center">
              <div className="text-muted">
                <i className="bi bi-inbox display-4 d-block mb-2"></i>
                {searchTerm ? (
                  <>
                    <h5>Nenhum usuário encontrado</h5>
                    <p>Tente ajustar os termos de busca</p>
                  </>
                ) : (
                  <>
                    <h5>Nenhum usuário cadastrado</h5>
                    <p>Clique em "Novo Usuário" para começar</p>
                  </>
                )}
              </div>
            </div>
          }
          customStyles={customStyles}
          responsive
          striped
          highlightOnHover
          pointerOnHover
        />
      </div>
    </div>
  );
}
