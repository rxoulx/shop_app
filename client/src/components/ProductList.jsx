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

  const handleXoa = async (id) => {
    if (!window.confirm('Ban co chac muon ngung ban san pham nay?')) return;
    try {
      await axiosClient.delete(`/products/${id}`);
      alert(`Da goi lenh xoa san pham ${id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Loi khi xoa san pham');
    }
  };

  useEffect(() => {
    axiosClient
      .get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => setLoi(err.message))
      .finally(() => setDangTai(false));
  }, []);

  if (dangTai) return <p>Dang tai danh sach san pham...</p>;
  if (loi) return <p style={{ color: 'red' }}>Loi: {loi}</p>;

  return (
    <div>
      {coTheSua && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => alert('Chuc nang them se hoan thien o Lab 9')}>
            + Them san pham moi
          </button>
        </div>
      )}
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
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
                  <button onClick={() => alert(`Sua san pham ${sp.ProductID} (Lab 9)`)} style={{ marginRight: 6 }}>
                    Sua
                  </button>
                  {coTheXoa && (
                    <button onClick={() => handleXoa(sp.ProductID)} style={{ color: 'red' }}>
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
