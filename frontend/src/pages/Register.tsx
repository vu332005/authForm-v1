import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 1. Import hooks của Redux thay vì useAuth
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser } from '../store/features/auth/authSlice';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. Khởi tạo dispatch và navigate
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // (Optional) Lấy trạng thái loading/error để hiển thị UX tốt hơn
  const { isLoading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      // 3. Gọi action registerUser thông qua dispatch
      // .unwrap() giúp biến Promise của Redux thành Promise thường để dùng try/catch bắt lỗi dễ dàng
      await dispatch(registerUser({ username, password })).unwrap();

      alert('Đăng ký thành công! Hãy đăng nhập.');
      navigate('/login');
    } catch (err) {
      // 4. Bắt lỗi từ rejectWithValue trong slice (message lỗi string)
      alert(err || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-96 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-green-600">Đăng Ký</h2>
        
        <input 
          className="mb-4 w-full rounded border p-2" 
          placeholder="Username" 
          value={username}
          onChange={e => setUsername(e.target.value)} 
        />
        <input 
          type="password"
          className="mb-4 w-full rounded border p-2" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)} 
        />
        
        <button 
          disabled={isLoading}
          className="w-full rounded bg-green-600 p-2 text-white hover:bg-green-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
        
        <p className="mt-4 text-center text-sm">
          Đã có tài khoản? <Link to="/login" className="text-blue-500">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}