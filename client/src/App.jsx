import ProductList from './components/ProductList';
import { useAuth } from './context/AuthContext';
import { Link } from 'react-router-dom';

function App() {
  const { auth, dangXuat } = useAuth();

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Quan ly cua hang - Danh sach san pham</h1>
        <div>
          {auth ? (
            <div>
              <span>Xin chao, <strong>{auth.user.fullName}</strong> ({auth.user.role}) </span>
              <button onClick={dangXuat} style={{ marginLeft: 8, cursor: 'pointer' }}>Dang xuat</button>
            </div>
          ) : (
            <div>
              <Link to="/login" style={{ marginRight: 8 }}>Dang nhap</Link> | 
              <Link to="/register" style={{ marginLeft: 8 }}>Dang ky</Link>
            </div>
          )}
        </div>
      </div>
      <hr style={{ margin: '16px 0' }} />
      <ProductList />
    </div>
  );
}

export default App;
