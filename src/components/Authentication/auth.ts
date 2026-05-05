import type { User, UserCredential } from "firebase/auth";
import type { ReactNode, Dispatch, SetStateAction } from "react";

export type Props = {
    children: ReactNode;
}

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    loginUser: (email: string, password: string) => Promise<UserCredential>;
    createUserEP: (email: string, password: string) => Promise<any>;
    logoutUser: () => Promise<void>;
    profileUpdate: (name: string, photoURL: string) => Promise<void>;
    signInWithGoogle: () => Promise<any>;
    setUser: Dispatch<SetStateAction<User | null>>;
}