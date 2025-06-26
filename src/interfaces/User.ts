export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  uf: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  address: Omit<Address, 'street' | 'neighborhood' | 'city' | 'state' | 'uf'> & {
    street?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    uf?: string;
  };
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string;
}

