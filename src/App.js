// App.js
import {Routes, Route, Navigate} from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CreateMessage from './pages/CreateMessage';
import AllMessage from "./pages/AllMessage";
import PrivateRoute from './auth/PrivateRoute';


function AppContent() {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return (
        <Routes>
            <Route path="/all-message" element={<AllMessage />} />
            {/*<Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />*/}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/*<Route path="/create-message" element={<CreateMessage />} />*/}

            <Route path="/" element={<PrivateRoute element={user ? <HomePage /> : <Navigate to="/login" />} />} />
            <Route path="/create-message" element={<PrivateRoute element={<CreateMessage />} />} />
        </Routes>
    );
}

export default function App() {
    return <AppContent />;
}
