import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Landing        from './pages/Landing';
import Menu           from './pages/Menu';
import Cart           from './pages/Cart';
import OrderTracking  from './pages/OrderTracking';
import Login          from './pages/Login';
import AdminDash      from './pages/dashboard/AdminDash';
import KitchenDisplay from './pages/dashboard/KitchenDisplay';
import Analytics      from './pages/dashboard/Analytics';
import TableManager   from './pages/dashboard/TableManager';
import Billing        from './pages/dashboard/Billing';
import MenuManager    from './pages/dashboard/MenuManager';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useSelector(s => s.auth);
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return children;
};

const RoleHome = () => {
  const { user } = useSelector(s => s.auth);
  if (!user) return <Navigate to="/login" />;
  const routes = {
    admin:   '/dashboard',
    manager: '/dashboard',
    kitchen: '/kitchen',
    waiter:  '/tables',
    cashier: '/billing',
  };
  return <Navigate to={routes[user.role] || '/login'} />;
};

function Unauthorized() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#f8f7f5', fontFamily: "'DM Sans', sans-serif",
    }}>
      <h1 style={{ color: '#1B3C53', fontSize: '28px', fontWeight: '800', margin: '0 0 8px' }}>
        Access Denied
      </h1>
      <p style={{ color: '#456882', fontSize: '15px', margin: '0 0 24px' }}>
        You don't have permission to view this page
      </p>
      <button onClick={() => window.history.back()} style={{
        padding: '12px 28px', background: '#1B3C53', color: '#D2C1B6',
        border: 'none', borderRadius: '10px', fontWeight: '700',
        fontSize: '15px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
      }}>
        Go Back
      </button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - Development Environment */}
        <Route path="/"          element={<Landing />} />
        <Route path="/menu"      element={<Menu />} />
        <Route path="/cart"      element={<Cart />} />
        <Route path="/track/:id" element={<OrderTracking />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* After login → go to role home */}
        <Route path="/home" element={<RoleHome />} />

        {/* Admin + Manager */}
        <Route path="/dashboard" element={
          <ProtectedRoute roles={['admin','manager']}>
            <AdminDash />
          </ProtectedRoute>} />

        <Route path="/analytics" element={
          <ProtectedRoute roles={['admin','manager']}>
            <Analytics />
          </ProtectedRoute>} />

        <Route path="/menu-manager" element={
          <ProtectedRoute roles={['admin','manager']}>
            <MenuManager />
          </ProtectedRoute>} />

        {/* Admin + Manager + Waiter */}
        <Route path="/tables" element={
          <ProtectedRoute roles={['admin','manager','waiter']}>
            <TableManager />
          </ProtectedRoute>} />

        {/* Admin + Manager + Kitchen */}
        <Route path="/kitchen" element={
          <ProtectedRoute roles={['admin','manager','kitchen']}>
            <KitchenDisplay />
          </ProtectedRoute>} />

        {/* Admin + Manager + Cashier */}
        <Route path="/billing" element={
          <ProtectedRoute roles={['admin','manager','cashier']}>
            <Billing />
          </ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}
