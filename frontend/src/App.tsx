import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';

import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { checkAuth } from './store/features/auth/authSlice';

function App() {
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Gọi checkAuth khi App mount
    dispatch(checkAuth());
  }, [dispatch]);
  
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Private Routes  */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;