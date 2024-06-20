import axios from 'axios'
import React, { createContext, useState, useEffect, useCallback } from 'react'
const AuthContext = createContext()
const AuthContextProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(null)
    const [user, setUser] = useState(null)
    // const socket = null;
    const checkLoginState = useCallback(async () => {
        try {
            const {
                data: { loggedIn: logged_in, user }
            } = await axios.get(`http://localhost:5000/auth/logged_in`, { withCredentials: true })
            // console.log(logged_in);
            setLoggedIn(logged_in)
            console.log(user)
            // socket = useMemo(() => io('http://localhost:5000'), []);
            user && setUser(user)
        } catch (err) {
            console.error(err)
        }
    }, [])

    useEffect(() => {
        checkLoginState()
    }, [checkLoginState])
    // useEffect(() => {
    //     console.log(user)
    // }, [user])

    return <AuthContext.Provider value={{ loggedIn, checkLoginState, user }}>{children}</AuthContext.Provider>
}
const useAuth = () => React.useContext(AuthContext);
export { AuthContext, AuthContextProvider, useAuth }