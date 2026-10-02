import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
  });
  const [thongBao, setThongBao] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setThongBao('');
    try {
      await axiosClient.post('/auth/register', form);
      setThongBao('Dang ky thanh cong! Dang chuyen den trang dang nhap...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setThongBao(err.response?.data?.message || 'Da co loi xay ra');
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>Dang ky tai khoan</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Ho ten"
          value={form.fullName}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          name="username"
          placeholder="Ten dang nhap"
          value={form.username}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        /><br /><br />
        <input
          name="password"
          type="password"
          placeholder="Mat khau (>= 6 ky tu)"
          value={form.password}
          onChange={handleChange}
          required
        /><br /><br />
        <button type="submit">Dang ky</button>
      </form>
      {thongBao && <p>{thongBao}</p>}
      <p>Da co tai khoan? <Link to="/login">Dang nhap</Link></p>
    </div>
  );
}

export default RegisterPage;
