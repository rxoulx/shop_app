import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loi, setLoi] = useState('');
  const { dangNhap } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoi('');
    try {
      const res = await axiosClient.post('/auth/login', form);
      dangNhap(res.data);
      navigate('/');
    } catch (err) {
      setLoi(err.response?.data?.message || 'Dang nhap that bai');
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>Dang nhap</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Ten dang nhap"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Mat khau"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        /><br /><br />
        <button type="submit">Dang nhap</button>
      </form>
      {loi && <p style={{ color: 'red' }}>{loi}</p>}
      <p>Chua co tai khoan? <Link to="/register">Dang ky</Link></p>
    </div>
  );
}

export default LoginPage;
