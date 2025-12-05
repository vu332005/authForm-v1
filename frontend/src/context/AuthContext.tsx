import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axiosClient from '../api/axiosClient';
import { wrapperAsync } from '../utils';

//types
interface User { username: string; }
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

//reducer
type AuthAction = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'STOP_LOADING' };

// reducer func  
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
      // { ...state, user: action.payload, isAuthenticated: true, isLoading: false } -> giữ nguyên các gtri # trong state-> ghi đè các gtri này user: action.payload, isAuthenticated: true, isLoading: false
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case 'STOP_LOADING': //  dùng khi muốn dừng loading -> kh ảnh hưởng đến các state #
      return { ...state, isLoading: false };
    default: return state;
  }
};

//context
type AsyncResult = [any | null, any | null];

interface AuthContextType extends AuthState {
  login: (data: any) => Promise<AsyncResult>;
  register: (data: any) => Promise<AsyncResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  // useReducer
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true, // Mặc định true để chờ check
  });

  // Check auth khi tải trang
  useEffect(() => {
    const checkAuth = async () => {
      const [res, err] = await wrapperAsync(() => axiosClient.get('/user/me'));
      if (err) {
        dispatch({ type: 'LOGOUT' });
      } else if (res) {
        dispatch({ type: 'LOGIN', payload: res.data.user });
      }
    };
    checkAuth();
  }, []);

  const login = async (formData: any): Promise<AsyncResult> => {
    const [res, err] = await wrapperAsync(() => axiosClient.post('/auth/login', formData));

    if (err) {
      return [null, err];
    }
    if (res) {
      localStorage.setItem('accessToken', res.data.accessToken);
      dispatch({ type: 'LOGIN', payload: res.data.user });
      return [res.data, null];
    }
    return [null, new Error("Unknown error")];
  };

  const register = async (formData: any) => {
    return await wrapperAsync(() => axiosClient.post('/auth/register', formData));
  };

  const logout = async () => {
    await wrapperAsync(() => axiosClient.post('/auth/logout'));
    localStorage.removeItem('accessToken'); // -> xóa accesstoken ở local storage của client -> đồng thời trong api cũng xóa đi refresh token ở cookie
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("use auth phải được dùng trong authProvider");
  return context;
};