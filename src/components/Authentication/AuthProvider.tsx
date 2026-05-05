import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, type User } from "firebase/auth"
import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import { auth } from "../../Firebase/firebase.init"
import type { Props } from "./auth"


export default function AuthProvider({children} : Props){
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const loginUser = (email : string, password : string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }
    const createUserEP = (email : string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    const logoutUser = () => {
        return signOut(auth)
    }
    const profileUpdate = async(name:string, photoURL:string) => {
        const profile = {
            displayName: name,
            photoURL: photoURL
        }
        if (!auth.currentUser) return;
        return await updateProfile(auth.currentUser, profile);
    }
    useEffect(()=> {
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setLoading(false)
            setUser(currentUser)
        })

        return () => unsubscribe();
    }, [])

    // console.log(role, mUser, user)
    const googleProvider = new GoogleAuthProvider()
    const signInWithGoogle = () => {
        return signInWithPopup(auth, googleProvider)
    }
    const authInfo = {
        loginUser,
        signInWithGoogle,
        user,
        createUserEP,
        logoutUser,
        profileUpdate,
        loading, setUser
    }
    return(
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    )
}
