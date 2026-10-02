import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function ProductFormPage() {
  const { id } = useParams(); // Co id => Dang Sua; khong co id => Dang Them
  const dangSua = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: '',
    categoryId: '',
    unitPrice: '',
    unitsInStock: '',
  });
  const [categories, setCategories] = useState([]);
  const [loi, setLoi] = useState('');

  useEffect(() => {
    // Lay danh sach danh muc cho the select
    axiosClient.get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Loi tai danh muc:', err));

    // Neu dang o che do Sua -> Tai du lieu hien tai cua san pham len form
    if (dangSua) {
      axiosClient.get(`/products/${id}`)
        .then((res) => {
          const sp = res.data;
          setForm({
            productName: sp.ProductName || '',
            categoryId: sp.CategoryID || '',
            unitPrice: sp.UnitPrice ?? '',
            unitsInStock: sp.UnitsInStock ?? '',
          });
        })
        .catch((err) => setLoi('Khong the tai thong tin san pham'));
    }
  }, [id, dangSua]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoi('');
    try {
      if (dangSua) {
        await axiosClient.put(`/products/${id}`, form);
      } else {
        await axiosClient.post('/products', form);
      }
      navigate('/');
    } catch (err) {
      setLoi(err.response?.data?.message || 'Co loi xay ra');
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: '40px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>{dangSua ? `Sua san pham #${id}` : 'Them san pham moi'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Ten san pham:</label><br />
          <input
            style={{ width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }}
            placeholder="Ten san pham"
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Danh muc:</label><br />
          <select
            style={{ width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }}
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">-- Chon danh muc --</option>
            {categories.map((c) => (
              <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Don gia ($):</label><br />
          <input
            type="number"
            step="0.01"
            style={{ width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }}
            placeholder="Don gia"
            value={form.unitPrice}
            onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
            required
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Ton kho:</label><br />
          <input
            type="number"
            style={{ width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }}
            placeholder="Ton kho"
            value={form.unitsInStock}
            onChange={(e) => setForm({ ...form, unitsInStock: e.target.value })}
            required
          />
        </div>

        <button type="submit" style={{ padding: '8px 16px', marginRight: 10, cursor: 'pointer' }}>
          {dangSua ? 'Luu thay doi' : 'Them moi'}
        </button>
        <Link to="/" style={{ textDecoration: 'none', color: '#666' }}>Huy bo</Link>
      </form>
      {loi && <p style={{ color: 'red', marginTop: 12 }}>{loi}</p>}
    </div>
  );
}

export default ProductFormPage;
