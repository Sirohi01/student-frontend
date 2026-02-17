import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import Focus from './pages/Focus';
import Revision from './pages/Revision';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import RequireAuth from './features/auth/RequireAuth';

function App() {
  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-100 font-sans">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<RequireAuth />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="planner" element={<Planner />} />
                <Route path="focus" element={<Focus />} />
                <Route path="revision" element={<Revision />} />
                <Route path="analytics" element={<Analytics />} />
                {/* Add more protected routes here */}
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
