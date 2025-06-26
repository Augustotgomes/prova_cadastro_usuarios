import { User } from './User';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view';
  selectedUser?: string;
}

export interface TableColumn<T> {
  name: string;
  selector: (row: T) => any;
  sortable?: boolean;
  width?: string;
  cell?: (row: T) => JSX.Element;
}

export interface FilterState {
  search: string;
  page: number;
  limit: number;
}

export type UserAction = 
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'OPEN_MODAL'; payload: { mode: 'create' | 'edit' | 'view'; userId?: string } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_FILTER'; payload: Partial<FilterState> }
  | { type: 'SET_PAGINATION'; payload: { total: number; totalPages: number } };

