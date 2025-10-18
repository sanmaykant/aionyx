import {
    useState,
    useEffect,
    useContext,
    createContext,
} from "react";
import { useNavigate } from "react-router";

const AuthContext = createContext("undetermined")

const readAccessToken = () => {
    return localStorage.getItem("access-token")
}

export function AuthProvider({ children }) {
    const [authStatus, setAuthStatus] = useState(useContext(AuthContext))

    useEffect(() => {
        (async () => {
            const token = readAccessToken()
            if (token) {
                setAuthStatus("authenticated")
            } else {
                setAuthStatus("unauthenticated")
            }
        })()
    }, [authStatus, setAuthStatus])

    return <AuthContext.Provider value={{ authStatus }}>
        {children}
    </AuthContext.Provider>
}

export function ProtectedRoute({ children }) {
    let page = children
    const navigate = useNavigate();
    const { authStatus } = useContext(AuthContext);

    useEffect(() => {
        console.log(authStatus)
        if (authStatus === "unauthenticated") {
            navigate("/register");
        }
    }, [authStatus, navigate]);

    if (authStatus !== "authenticated") {
        page = <div>Loading...</div>;
    }

    return page
}
