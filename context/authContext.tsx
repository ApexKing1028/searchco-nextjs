import { createContext, useContext, useEffect, useState } from 'react'
import {
    onAuthStateChanged,
    signOut
} from 'firebase/auth'
import { auth, db } from '@/utils/firebase'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import HomeContext from '@/pages/api/home/home.context'

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [user, setUser] = useState<any>(null)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(collection(db, "users"), where("email", "==", user.email));
                try {
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.empty) {
                        setUser({
                            uid: user.uid,
                            email: user.email,
                            role: "user"
                        })
                    }
                    else {
                        for (const doc of querySnapshot.docs) {
                            let dt = doc.data();
                            setUser({
                                uid: user.uid,
                                email: user.email,
                                name: dt.name,
                                role: dt.role
                            })
                        }
                    }
                }
                catch (error) {
                    let message = (error as Error).message;
                    console.log(message);
                }
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const logout = async () => {
        setUser(null)
        await signOut(auth)
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
