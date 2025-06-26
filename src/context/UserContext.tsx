import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  JSX,
} from "react";
import { User, UserAction, ModalState, FilterState } from "../interfaces";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  modal: ModalState;
  filter: FilterState;
  totalUsers: number;
  totalPages: number;
}

interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  // Actions
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  openModal: (mode: "create" | "edit" | "view", userId?: string) => void;
  closeModal: () => void;
  setFilter: (filter: Partial<FilterState>) => void;
  setPagination: (total: number, totalPages: number) => void;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  modal: {
    isOpen: false,
    mode: "create",
    selectedUser: undefined,
  },
  filter: {
    search: "",
    page: 1,
    limit: 10,
  },
  totalUsers: 0,
  totalPages: 0,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
        error: null,
      };

    case "ADD_USER":
      return {
        ...state,
        users: [...state.users, action.payload],
        error: null,
      };

    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
        error: null,
      };

    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case "OPEN_MODAL":
      return {
        ...state,
        modal: {
          isOpen: true,
          mode: action.payload.mode,
          selectedUser: action.payload.userId,
        },
      };

    case "CLOSE_MODAL":
      return {
        ...state,
        modal: {
          isOpen: false,
          mode: "create",
          selectedUser: undefined,
        },
      };

    case "SET_FILTER": {
      const newFilter = {
        ...state.filter,
        ...action.payload,
      };

      const isSame = JSON.stringify(state.filter) === JSON.stringify(newFilter);

      if (isSame) return state;

      return {
        ...state,
        filter: newFilter,
      };
    }

    case "SET_PAGINATION":
      return {
        ...state,
        totalUsers: action.payload.total,
        totalPages: action.payload.totalPages,
      };

    default:
      return state;
  }
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Action creators
  const setUsers = (users: User[]) => {
    dispatch({ type: "SET_USERS", payload: users });
  };

  const addUser = (user: User) => {
    dispatch({ type: "ADD_USER", payload: user });
  };

  const updateUser = (user: User) => {
    dispatch({ type: "UPDATE_USER", payload: user });
  };

  const deleteUser = (userId: string) => {
    dispatch({ type: "DELETE_USER", payload: userId });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const openModal = (mode: "create" | "edit" | "view", userId?: string) => {
    dispatch({
      type: "OPEN_MODAL",
      payload: { mode, userId },
    });
  };

  const closeModal = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  const setFilter = (filter: Partial<FilterState>) => {
    dispatch({ type: "SET_FILTER", payload: filter });
  };

  const setPagination = (total: number, totalPages: number) => {
    dispatch({
      type: "SET_PAGINATION",
      payload: { total, totalPages },
    });
  };

  const contextValue: UserContextType = {
    state,
    dispatch,
    setUsers,
    addUser,
    updateUser,
    deleteUser,
    setLoading,
    setError,
    openModal,
    closeModal,
    setFilter,
    setPagination,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUserContext(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
