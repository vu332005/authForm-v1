import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold">Xin chào, {user?.username}!</h1>
      <p className="text-gray-500">Bạn đã vào được Private Route.</p>
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Đăng xuất</button>
    </div>
  );
}

export default Dashboard