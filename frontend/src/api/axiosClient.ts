import axios from 'axios';

// tạo instance của axios -> tạo ra 1 instance riêng của axios -> có thể cấu hình mặc định tất cả các request khi sdung axios này
const axiosClient = axios.create({
  baseURL: 'http://localhost:5001/api', 
  withCredentials: true, // Để gửi/nhận cookie
  headers: { 'Content-Type': 'application/json' }
});

// .use() -> đăng kí inerceptor cho res/ req
/*
.use(onFulfilled, onRejected) dùng để đăng ký interceptor:
onFulfilled → chạy khi response thành công (status 2xx).
onRejected → chạy khi response lỗi (status 4xx/5xx).
*/

// Gắn AccessToken vào Header mỗi request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // lấy token từ localstoareg
  
  if (token) config.headers.Authorization = `Bearer ${token}`; // Nếu có token -> thêm vào header Authorization theo chuẩn Bearer <token> (JWT chuẩn).
  return config;// return config để tiếp tục qtrinh gửi
});

// Xử lý khi token hết hạn (Lỗi 403/401)
axiosClient.interceptors.response.use(
  
  (response) => response, // nếu res k lỗi -> trả về res như bth / còn nếu lỗi thì chạy async ở dưới để fix
  
  async (error) => {

    // axios gửi 1 req -> tạo ra 1 ibj config chứa tca các ttin của req đó
    // -> nếu gặp lỗi -> trả về err obj nhưng req gốc vẫn đc lưu trong error.config
    // -> ta lấy req để khi refresh đc token -> có thể tự retry lại req
    const originalRequest = error.config;
    
    // Nếu lỗi 403 - và chưa retry lần nào
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi API lấy token mới
        const res = await axiosClient.post('/auth/refresh');
        const { accessToken } = res.data;
        
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`; // cập nhật auth của req cũ với token mới
        
        // Gọi lại request cũ
        return axiosClient(originalRequest); 

      } catch (err) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login'; // k cứu dc
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;