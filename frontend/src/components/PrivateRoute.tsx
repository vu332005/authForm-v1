import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
    // quá trình check user
    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      );
    }

    // nếu k có quyền -> điều hướng về login
    // <Outlet /> → component của React Router, dùng để render các route con.
    // replace nghĩa là thay thế URL hiện tại trong history, không lưu lại trang cũ để back.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;