import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ Add loading state

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const usernameToShow = sessionStorage.getItem("username");
        const email = sessionStorage.getItem("email");
        if (token) {
            setUser({ token, usernameToShow, email });
        }
        setLoading(false); // ✅ Mark loading complete after check
    }, []);

    const login = ({ token, usernameToShow, email }) => {
        setUser({ token, usernameToShow, email });
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("email");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
