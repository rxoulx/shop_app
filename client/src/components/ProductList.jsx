import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState(null);
  const { auth } = useAuth();

  const coTheSua = auth && ['Admin', 'NhanVien'].includes(auth.user.role);
  const coTheXoa = auth && auth.user.role === 'Admin';

  const loadData = () => {
    setDangTai(true);
    axiosClient
      .get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => setLoi(err.message))
      .finally(() => setDangTai(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleXoa = async (id) => {
    if (!window.confirm('Ban co chac muon ngung ban san pham nay?')) return;
    try {
      await axiosClient.delete(`/products/${id}`);
      // Cap nhat ngay tren state de giao dien bien mat san pham ma khong can F5
      setProducts(products.filter((sp) => sp.ProductID !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Loi khi xoa san pham');
    }
  };

  if (dangTai) return <p>Dang tai danh sach san pham...</p>;
  if (loi) return <p style={{ color: 'red' }}>Loi: {loi}</p>;

  return (
    <div>
      {coTheSua && (
        <div style={{ marginBottom: 16 }}>
          <Link
            to="/admin/products/new"
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 4,
            }}
          >
            + Them san pham moi
          </Link>
        </div>
      )}

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
          {products.map((sp) => (
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
                      style={{ color: 'red', border: '1px solid red', background: 'none', padding: '2px 8px', borderRadius: 4, cursor: 'pointer' }}
                    >
                      Xoa
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
