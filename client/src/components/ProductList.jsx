import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState(null);

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
    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Ten san pham</th>
          <th>Danh muc</th>
          <th>Don gia</th>
          <th>Ton kho</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductList;
