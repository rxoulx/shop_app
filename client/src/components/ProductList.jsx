import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tuKhoa, setTuKhoa] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [trang, setTrang] = useState(1);
  const [tongSoTrang, setTongSoTrang] = useState(1);
  const [tongSoDong, setTongSoDong] = useState(0);

  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState(null);
  const { auth } = useAuth();

  const coTheSua = auth && ['Admin', 'NhanVien'].includes(auth.user.role);
  const coTheXoa = auth && auth.user.role === 'Admin';

  // Tai danh sach danh muc 1 lan duy nhat cho bo loc
  useEffect(() => {
    axiosClient.get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Loi lay danh muc:', err));
  }, []);

  // Goi API lay danh sach san pham moi khi trang, tuKhoa, categoryId thay doi
  useEffect(() => {
    setDangTai(true);
    axiosClient
      .get('/products', {
        params: {
          page: trang,
          pageSize: 10,
          search: tuKhoa,
          categoryId: categoryId || undefined,
        },
      })
      .then((res) => {
        setProducts(res.data.data);
        setTongSoTrang(res.data.totalPages);
        setTongSoDong(res.data.totalItems);
      })
      .catch((err) => setLoi(err.message))
      .finally(() => setDangTai(false));
  }, [trang, tuKhoa, categoryId]);

  const handleXoa = async (id) => {
    if (!window.confirm('Ban co chac muon ngung ban san pham nay?')) return;
    try {
      await axiosClient.delete(`/products/${id}`);
      // Tai lai danh sach trang hien tai
      setProducts(products.filter((sp) => sp.ProductID !== id));
      setTongSoDong((prev) => prev - 1);
    } catch (err) {
      alert(err.response?.data?.message || 'Loi khi xoa san pham');
    }
  };

  return (
    <div>
      {/* Thanh cong cu: Them moi, Tim kiem, Loc danh muc */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        {coTheSua && (
          <Link
            to="/admin/products/new"
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 4,
            }}
          >
            + Them san pham moi
          </Link>
        )}

        <input
          type="text"
          placeholder="Tim kiem theo ten san pham..."
          value={tuKhoa}
          onChange={(e) => {
            setTrang(1);
            setTuKhoa(e.target.value);
          }}
          style={{ padding: '8px 12px', minWidth: 240, borderRadius: 4, border: '1px solid #ccc' }}
        />

        <select
          value={categoryId}
          onChange={(e) => {
            setTrang(1);
            setCategoryId(e.target.value);
          }}
          style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="">-- Tat ca danh muc --</option>
          {categories.map((c) => (
            <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>
          ))}
        </select>

        <span style={{ marginLeft: 'auto', color: '#666' }}>
          Tong so: <strong>{tongSoDong}</strong> san pham
        </span>
      </div>

      {/* Bang du lieu */}
      {dangTai ? (
        <p>Dang tai danh sach san pham...</p>
      ) : loi ? (
        <p style={{ color: 'red' }}>Loi: {loi}</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>ID</th>
              <th>Ten san pham</th>
              <th>Danh muc</th>
              <th>Don gia</th>
              <th>Ton kho</th>
              {coTheSua && <th>Thao tac</th>}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={coTheSua ? 6 : 5} style={{ textAlign: 'center', padding: 20 }}>
                  Khong tim thay san pham nao phu hop.
                </td>
              </tr>
            ) : (
              products.map((sp) => (
                <tr key={sp.ProductID}>
                  <td>{sp.ProductID}</td>
                  <td>{sp.ProductName}</td>
                  <td>{sp.CategoryName}</td>
                  <td>{sp.UnitPrice?.toLocaleString('vi-VN')} $</td>
                  <td>{sp.UnitsInStock}</td>
                  {coTheSua && (
                    <td>
                      <Link
                        to={`/admin/products/${sp.ProductID}/edit`}
                        style={{ marginRight: 12, textDecoration: 'none', color: '#007bff' }}
                      >
                        Sua
                      </Link>
                      {coTheXoa && (
                        <button
                          onClick={() => handleXoa(sp.ProductID)}
                          style={{
                            color: 'red',
                            border: '1px solid red',
                            background: 'none',
                            padding: '2px 8px',
                            borderRadius: 4,
                            cursor: 'pointer',
                          }}
                        >
                          Xoa
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Phan trang */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 20 }}>
        <button
          onClick={() => setTrang((t) => Math.max(1, t - 1))}
          disabled={trang <= 1}
          style={{ padding: '6px 14px', cursor: trang <= 1 ? 'not-allowed' : 'pointer' }}
        >
          Trang truoc
        </button>

        <span>
          Trang <strong>{trang}</strong> / {tongSoTrang}
        </span>

        <button
          onClick={() => setTrang((t) => Math.min(tongSoTrang, t + 1))}
          disabled={trang >= tongSoTrang}
          style={{ padding: '6px 14px', cursor: trang >= tongSoTrang ? 'not-allowed' : 'pointer' }}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default ProductList;
