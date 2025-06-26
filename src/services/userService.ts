import {
  User,
  CreateUserData,
  UpdateUserData,
  PaginatedResponse,
  PaginationParams,
} from "../interfaces";

export class UserService {
  private static instance: UserService;
  private users: User[] = [];
  private nextId = 1;

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Simula delay de operação assíncrona
   */
  private async simulateDelay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Gera ID único para novo usuário
   */
  private generateId(): string {
    return `user_${this.nextId++}_${Date.now()}`;
  }

  /**
   * Cria um novo usuário
   */
  public async createUser(userData: CreateUserData): Promise<User> {
    await this.simulateDelay();

    const newUser: User = {
      id: this.generateId(),
      ...userData,
      address: {
        cep: userData.address.cep,
        street: userData.address.street || "",
        number: userData.address.number,
        complement: userData.address.complement,
        neighborhood: userData.address.neighborhood || "",
        city: userData.address.city || "",
        state: userData.address.state || "",
        uf: userData.address.uf || "",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return newUser;
  }

  /**
   * Busca usuário por ID
   */
  public async getUserById(id: string): Promise<User | null> {
    await this.simulateDelay(200);
    return this.users.find((user) => user.id === id) || null;
  }

  /**
   * Lista usuários com paginação e busca
   */
  public async getUsers(
    params: PaginationParams
  ): Promise<PaginatedResponse<User>> {
    await this.simulateDelay();

    let filteredUsers = [...this.users];

    // Aplicar filtro de busca
    if (params.search && params.search.trim()) {
      const searchTerm = params.search.toLowerCase().trim();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.cpf.includes(searchTerm) ||
          user.phone.includes(searchTerm)
      );
    }

    // Calcular paginação
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / params.limit);
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      data: paginatedUsers,
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
    };
  }

  /**
   * Atualiza usuário existente
   */
  public async updateUser(userData: UpdateUserData): Promise<User> {
    await this.simulateDelay();

    const userIndex = this.users.findIndex((user) => user.id === userData.id);

    if (userIndex === -1) {
      throw new Error("Usuário não encontrado");
    }

    const existingUser = this.users[userIndex];
    const updatedUser: User = {
      ...existingUser,
      ...userData,
      address: userData.address
        ? {
            ...existingUser.address,
            ...userData.address,
          }
        : existingUser.address,
      updatedAt: new Date().toISOString(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  /**
   * Remove usuário
   */
  public async deleteUser(id: string): Promise<boolean> {
    await this.simulateDelay();

    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new Error("Usuário não encontrado");
    }

    this.users.splice(userIndex, 1);
    return true;
  }

  /**
   * Verifica se email já está em uso
   */
  public async isEmailInUse(
    email: string,
    excludeUserId?: string
  ): Promise<boolean> {
    await this.simulateDelay(200);

    return this.users.some(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.id !== excludeUserId
    );
  }

  /**
   * Verifica se CPF já está em uso
   */
  public async isCpfInUse(
    cpf: string,
    excludeUserId?: string
  ): Promise<boolean> {
    await this.simulateDelay(200);

    return this.users.some(
      (user) => user.cpf === cpf && user.id !== excludeUserId
    );
  }

  /**
   * Obtém estatísticas dos usuários
   */
  public async getUserStats(): Promise<{
    total: number;
    byState: Record<string, number>;
    recentlyAdded: number;
  }> {
    await this.simulateDelay(300);

    const total = this.users.length;
    const byState: Record<string, number> = {};
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let recentlyAdded = 0;

    this.users.forEach((user) => {
      // Contar por estado
      const state = user.address.uf;
      byState[state] = (byState[state] || 0) + 1;

      // Contar recém-adicionados
      if (new Date(user.createdAt) > oneWeekAgo) {
        recentlyAdded++;
      }
    });

    return {
      total,
      byState,
      recentlyAdded,
    };
  }

  /**
   * Limpa todos os usuários (útil para testes)
   */
  public clearAllUsers(): void {
    this.users = [];
    this.nextId = 1;
  }

  /**
   * Adiciona usuários de exemplo para demonstração
   */
  public async seedSampleUsers(): Promise<void> {
    const { total } = await userService.getUsers({
      page: 1,
      limit: 10,
      search: "",
    });

    if (total == 0) {
      const sampleUsers: CreateUserData[] = [
        {
          name: "João Silva",
          email: "joao.silva@email.com",
          phone: "(11) 99999-9999",
          cpf: "123.456.789-01",
          birthDate: "1990-05-15",
          address: {
            cep: "01310-100",
            street: "Avenida Paulista",
            number: "1000",
            complement: "Apto 101",
            neighborhood: "Bela Vista",
            city: "São Paulo",
            state: "São Paulo",
            uf: "SP",
          },
        },
        {
          name: "Maria Santos",
          email: "maria.santos@email.com",
          phone: "(21) 88888-8888",
          cpf: "987.654.321-09",
          birthDate: "1985-12-03",
          address: {
            cep: "22071-900",
            street: "Avenida Atlântica",
            number: "500",
            complement: "",
            neighborhood: "Copacabana",
            city: "Rio de Janeiro",
            state: "Rio de Janeiro",
            uf: "RJ",
          },
        },
      ];

      for (const userData of sampleUsers) {
        await this.createUser(userData);
      }
    }
  }
}

export const userService = UserService.getInstance();
