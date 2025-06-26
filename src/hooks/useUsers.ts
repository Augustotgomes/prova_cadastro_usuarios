import { useCallback } from "react";
import { useUserContext } from "../context/UserContext";
import { userService, viaCepService } from "../services";
import { CreateUserData, UpdateUserData, ViaCepResponse } from "../interfaces";

export function useUsers() {
  const { state, setUsers, setLoading, setError, setPagination } =
    useUserContext();

  const { page, limit, search } = state.filter;

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.getUsers({
        page,
        limit,
        search,
      });

      setUsers(response.data);
      setPagination(response.total, response.totalPages);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, setUsers, setLoading, setError, setPagination]);

  const loadInitialUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.getUsers({
        page: 1,
        limit: 10,
        search: "",
      });

      setUsers(response.data);
      setPagination(response.total, response.totalPages);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUsers = useCallback(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users: state.users,
    loading: state.loading,
    error: state.error,
    totalUsers: state.totalUsers,
    totalPages: state.totalPages,
    filter: state.filter,
    loadUsers,
    loadInitialUsers,
    refreshUsers,
  };
}

export function useUserOperations() {
  const { addUser, updateUser, deleteUser, setLoading, setError, closeModal } =
    useUserContext();

  const createUser = useCallback(
    async (userData: CreateUserData) => {
      try {
        setLoading(true);
        setError(null);

        // Verificar se email já existe
        const emailExists = await userService.isEmailInUse(userData.email);
        if (emailExists) {
          throw new Error("Este e-mail já está sendo usado por outro usuário");
        }

        // Verificar se CPF já existe
        const cpfExists = await userService.isCpfInUse(userData.cpf);
        if (cpfExists) {
          throw new Error("Este CPF já está sendo usado por outro usuário");
        }

        const newUser = await userService.createUser(userData);
        addUser(newUser);
        closeModal();

        return newUser;
      } catch (error) {
        console.error("Erro ao criar usuário:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao criar usuário";
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addUser, setLoading, setError, closeModal]
  );

  const editUser = useCallback(
    async (userData: UpdateUserData) => {
      try {
        setLoading(true);
        setError(null);

        // Verificar se email já existe (excluindo o usuário atual)
        if (userData.email) {
          const emailExists = await userService.isEmailInUse(
            userData.email,
            userData.id
          );
          if (emailExists) {
            throw new Error(
              "Este e-mail já está sendo usado por outro usuário"
            );
          }
        }

        // Verificar se CPF já existe (excluindo o usuário atual)
        if (userData.cpf) {
          const cpfExists = await userService.isCpfInUse(
            userData.cpf,
            userData.id
          );
          if (cpfExists) {
            throw new Error("Este CPF já está sendo usado por outro usuário");
          }
        }

        const updatedUser = await userService.updateUser(userData);
        updateUser(updatedUser);
        closeModal();

        return updatedUser;
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao atualizar usuário";
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [updateUser, setLoading, setError, closeModal]
  );

  const removeUser = useCallback(
    async (userId: string) => {
      try {
        setLoading(true);
        setError(null);

        await userService.deleteUser(userId);
        deleteUser(userId);

        return true;
      } catch (error) {
        console.error("Erro ao remover usuário:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao remover usuário";
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [deleteUser, setLoading, setError]
  );

  return {
    createUser,
    editUser,
    removeUser,
  };
}

export function useViaCep() {
  const { setError } = useUserContext();

  const searchAddress = useCallback(
    async (cep: string): Promise<ViaCepResponse | null> => {
      try {
        setError(null);

        const response = await viaCepService.getAddressByCep(cep);

        if (response.error) {
          setError(response.error.message);
          return null;
        }

        return response.data || null;
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao buscar CEP";
        setError(errorMessage);
        return null;
      }
    },
    [setError]
  );

  const validateCep = useCallback((cep: string): boolean => {
    return viaCepService.validateCep(cep);
  }, []);

  const formatCep = useCallback((cep: string): string => {
    return viaCepService.formatCep(cep);
  }, []);

  return {
    searchAddress,
    validateCep,
    formatCep,
  };
}

export function useModal() {
  const { state, openModal, closeModal } = useUserContext();

  const openCreateModal = useCallback(() => {
    openModal("create");
  }, [openModal]);

  const openEditModal = useCallback(
    (userId: string) => {
      openModal("edit", userId);
    },
    [openModal]
  );

  const openViewModal = useCallback(
    (userId: string) => {
      openModal("view", userId);
    },
    [openModal]
  );

  return {
    modal: state.modal,
    openCreateModal,
    openEditModal,
    openViewModal,
    closeModal,
  };
}

export function useFilter() {
  const { state, setFilter } = useUserContext();

  const updateSearch = useCallback(
    (search: string) => {
      setFilter({ search, page: 1 }); // Reset to first page when searching
    },
    [setFilter]
  );

  const updatePage = useCallback(
    (page: number) => {
      setFilter({ page });
    },
    [setFilter]
  );

  const updateLimit = useCallback(
    (limit: number) => {
      setFilter({ limit, page: 1 }); // Reset to first page when changing limit
    },
    [setFilter]
  );

  const resetFilter = useCallback(() => {
    setFilter({ search: "", page: 1, limit: 10 });
  }, [setFilter]);

  return {
    filter: state.filter,
    updateSearch,
    updatePage,
    updateLimit,
    resetFilter,
  };
}
