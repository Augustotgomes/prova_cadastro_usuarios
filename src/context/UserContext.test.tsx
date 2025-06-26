import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserProvider, useUserContext } from '../context/UserContext';
import { User } from '../interfaces';

const mockUser: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '(11) 99999-9999',
  cpf: '123.456.789-01',
  birthDate: '1990-05-15',
  address: {
    cep: '01310-100',
    street: 'Avenida Paulista',
    number: '1000',
    complement: 'Apto 101',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'São Paulo',
    uf: 'SP',
  },
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const mockUser2: User = {
  id: '2',
  name: 'Maria Santos',
  email: 'maria@email.com',
  phone: '(21) 88888-8888',
  cpf: '987.654.321-09',
  birthDate: '1985-12-03',
  address: {
    cep: '22071-900',
    street: 'Avenida Atlântica',
    number: '500',
    complement: '',
    neighborhood: 'Copacabana',
    city: 'Rio de Janeiro',
    state: 'Rio de Janeiro',
    uf: 'RJ',
  },
  createdAt: '2023-01-02T00:00:00Z',
  updatedAt: '2023-01-02T00:00:00Z',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>{children}</UserProvider>
);

describe('UserContext', () => {
  it('provides initial state', () => {
    const { result } = renderHook(() => useUserContext(), { wrapper });
    
    expect(result.current.state.users).toEqual([]);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBe(null);
    expect(result.current.state.modal.isOpen).toBe(false);
    expect(result.current.state.modal.mode).toBe('create');
    expect(result.current.state.filter.search).toBe('');
    expect(result.current.state.filter.page).toBe(1);
    expect(result.current.state.filter.limit).toBe(10);
    expect(result.current.state.totalUsers).toBe(0);
    expect(result.current.state.totalPages).toBe(0);
  });

  it('sets users correctly', () => {
    const { result } = renderHook(() => useUserContext(), { wrapper });
    
    act(() => {
      result.current.setUsers([mockUser, mockUser2]);
    });
    
    expect(result.current.state.users).toEqual([mockUser, mockUser2]);
    expect(result.current.state.error).toBe(null);
  });

  it('adds user correctly', () => {
    const { result } = renderHook(() => useUserContext(), { wrapper });
    
    act(() => {
      result.current.addUser(mockUser);
    });
    
    expect(result.current.state.users).toEqual([mockUser]);
    expect(result.current.state.error).toBe(null);
  });

  it('updates user correctly', () => {
    const { result } = renderHook(() => useUserContext(), { wrapper });
    
    // First add a user
    act(() => {
      result.current.setUsers([mockUser]);
    });
    
    // Then update the user
    const updatedUser = { ...mockUser, name: 'João Silva Updated' };
    act(() => {
      result.current.updateUser(updatedUser);
    });
    
    expect(result.current.state.users[0].name).toBe('João Silva Updated');
    expect(result.current.state.error).toBe(null);
  });

  it('deletes user correctly', () => {
    const { result } = renderHook(() => useUserContext(), { wrapper });
    
    // First add users
    act(() => {
      result.current.setUsers([mockUser, mockUser2]);
    });
    
    // Then delete one user
    act(() => {
      result.current.deleteUser('1');
    });
    
    expect(result.current.state.users).toEqual([mockUser2]);
    expect(result.current.state.error).toBe(null);
  });

  it('sets loading state correctly', () => {
    const { result } = renderHook(() => useUserContext(), { wrapper });
    
    act(() => {
      result.current.setLoading(true);
    });
    
    expect(result.current.state.loading).toBe(true);
    expect(result.current.state.error).toBe(null);
  });

  it('clears error when loading is set to true', () => {
    const { result } = renderHook(() => useUserContext(), { wrapper });
    
    // First set an error
    act(() => {
      result.current.setError('Test error');
    });
    
    expect(result.current.state.error).toBe('Test error');
    
    // Then set loading to true
    act(() => {
      result.current.setLoading(true);
    });
    
    expect(result.current.state.error).toBe(null);
  });

  it('sets error correctly', () => {
    const { result } = renderHook(() => useUserContext(), { wrapper });
    
    act(() => {
      result.current.setError('Test error message');
    });
    
    expect(result.current.state.error).toBe('Test error message');
    expect(result.current.state.loading).toBe(false);
  });

  it('opens modal correctly', () => {
    const { result } = renderHook(() => useUserContext(), { wrapper });
    
    act(() => {
      result.current.openModal('edit', 'user-123');
    });
    
    expect(result.current.state.modal.isOpen).toBe(true);
    expect(result.current.state.modal.mode).toBe('edit');
    expect(result.current.state.modal.selectedUser).toBe('user-123');
  });

  it('closes modal correctly', () => {
    const { result } = renderHook(() => useUserContext(), { wrapper });
    
    // First open modal
    act(() => {
      result.current.openModal('edit', 'user-123');
    });
    
    // Then close modal
    act(() => {
      result.current.closeModal();
    });
    
    expect(result.current.state.modal.isOpen).toBe(false);
    expect(result.current.state.modal.mode).toBe('create');
    expect(result.current.state.modal.selectedUser).toBe(undefined);
  });

  it('sets filter correctly', () => {
    const { result } = renderHook(() => useUserContext(), { wrapper });
    
    act(() => {
      result.current.setFilter({ search: 'João', page: 2 });
    });
    
    expect(result.current.state.filter.search).toBe('João');
    expect(result.current.state.filter.page).toBe(2);
    expect(result.current.state.filter.limit).toBe(10); // Should remain unchanged
  });

  it('sets pagination correctly', () => {
    const { result } = renderHook(() => useUserContext(), { wrapper });
    
    act(() => {
      result.current.setPagination(25, 3);
    });
    
    expect(result.current.state.totalUsers).toBe(25);
    expect(result.current.state.totalPages).toBe(3);
  });

  it('throws error when used outside provider', () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useUserContext());
    }).toThrow('useUserContext must be used within a UserProvider');
    
    consoleSpy.mockRestore();
  });

  it('handles multiple state updates correctly', () => {
    const { result } = renderHook(() => useUserContext(), { wrapper });
    
    act(() => {
      result.current.setLoading(true);
      result.current.setUsers([mockUser]);
      result.current.setFilter({ search: 'test' });
      result.current.openModal('view', mockUser.id);
      result.current.setPagination(1, 1);
      result.current.setLoading(false);
    });
    
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.users).toEqual([mockUser]);
    expect(result.current.state.filter.search).toBe('test');
    expect(result.current.state.modal.isOpen).toBe(true);
    expect(result.current.state.modal.mode).toBe('view');
    expect(result.current.state.modal.selectedUser).toBe(mockUser.id);
    expect(result.current.state.totalUsers).toBe(1);
    expect(result.current.state.totalPages).toBe(1);
  });
});

