import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser } from '../store/features/auth/authSlice';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Lấy loading/error từ Redux store nếu muốn hiển thị
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // dispatch action loginUser
    // unwrap() giúp ta bắt được error ngay tại đây như Promise thường (nếu muốn alert)
    try {
      await dispatch(loginUser({ username, password })).unwrap();
      
      console.log("Login success");
      navigate('/');
    } catch (err) {
      alert(err || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-96 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold">Đăng Nhập</h2>
        
        {/* Hiển thị lỗi từ Redux state nếu có */}
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <input 
          className="mb-4 w-full rounded border p-2" 
          placeholder="Username" 
          onChange={e => setUsername(e.target.value)} 
        />
        <input 
          type="password"
          className="mb-4 w-full rounded border p-2" 
          placeholder="Password" 
          onChange={e => setPassword(e.target.value)} 
        />
        <button 
          disabled={isLoading}
          className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
        <p className="mt-4 text-center text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-blue-500">Đăng ký</Link>
        </p>
      </form>
    </div>
  );
}