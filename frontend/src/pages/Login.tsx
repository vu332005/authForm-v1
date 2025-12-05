import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate(); //  hook của react router -> trả về navigate để điều hướng trang

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const [data, err] = await login({ username, password });

    if (err) {
        const message = err.response?.data?.message || 'Đăng nhập thất bại';
        // ?. -> optional chaining nếu vd respone k tồn tại -> trả về undefine
        alert(message);
        return; // Dừng lại nếu có lỗi
    }

    // Nếu không có lỗi -> Thành công
    console.log("Login success:", data);
    navigate('/');
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-96 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold">Đăng Nhập</h2>
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
        <button className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700">Đăng nhập</button>
        <p className="mt-4 text-center text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-blue-500">Đăng ký</Link>
        </p>
      </form>
    </div>
  );
}