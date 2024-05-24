import { createContext, useContext, useEffect, useState } from 'react'
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth'
import { auth, db } from '@/config/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import SpinPage from '@/components/Spin'
import DashboardLayout from '@/components/DashboardLayout'

import { usePathname } from 'next/navigation'

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null)
    const router = useRouter();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (pathname.includes("chatbot-iframe")) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(collection(db, "users"), where("email", "==", user.email));
                try {
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.empty) {
                        setUser({
                            uid: user.uid,
                            email: user.email,
                            role: "user",
                            freeCredit: 10,
                            openaiKey: "",
                            pplxKey: "",
                            geminiKey: "",
                            openaiKeyEnable: false,
                            pplxKeyEnable: false,
                            geminiKeyEnable: false
                        })
                    }
                    else {
                        for (const doc of querySnapshot.docs) {
                            let dt = doc.data();
                            setUser({
                                uid: user.uid,
                                email: user.email,
                                userid: dt.userid,
                                role: dt.role,
                                freeCredit: dt.freeCredit,
                                openaiKey: dt.openaiKey,
                                pplxKey: dt.pplxKey,
                                geminiKey: dt.geminiKey,
                                openaiKeyEnable: dt.openaiKey === "" ? false : true,
                                pplxKeyEnable: dt.pplxKey === "" ? false : true,
                                geminiKeyEnable: dt.geminiKey === "" ? false : true,
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
            setLoading(false);
        });

        return () => unsubscribe()
    }, [router])

    const signup = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = async () => {
        setUser(null)
        await signOut(auth)
    }

    return (
        <AuthContext.Provider value={{ user, setUser, login, signup, logout }}>
            {pathname.includes("chatbot-iframe") ? children : loading ? <SpinPage /> : children}
        </AuthContext.Provider>
    )
}
