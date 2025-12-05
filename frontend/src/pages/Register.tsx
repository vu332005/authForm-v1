import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Gọi API đăng ký
    const [data, err] = await register({ username, password });

    if (err) {
      const message = err.response?.data?.message || 'Đăng ký thất bại';
      alert(message);
      return;
    }

    alert('Đăng ký thành công! Hãy đăng nhập.');
    navigate('/login');
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-96 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-green-600">Đăng Ký</h2>
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
        <button className="w-full rounded bg-green-600 p-2 text-white hover:bg-green-700">Register</button>
        <p className="mt-4 text-center text-sm">
          Đã có tài khoản? <Link to="/login" className="text-blue-500">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}