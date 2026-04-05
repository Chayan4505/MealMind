import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  session: Session | null
  user: User | null
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateRestaurantName: (name: string) => Promise<void>
  updateProfileData: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Automatically redirects back to where the user was
        redirectTo: window.location.origin + '/setup',
      }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const updateRestaurantName = async (name: string) => {
    if (!user) return
    const { data, error } = await supabase.auth.updateUser({
      data: { restaurant_name: name }
    })
    
    if (!error && data.user) {
      setUser(data.user)
    }
  }

  const updateProfileData = async (metaData: any) => {
    if (!user) return
    const { data, error } = await supabase.auth.updateUser({
      data: metaData
    })
    
    if (!error && data.user) {
      setUser(data.user)
    }
  }

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signInWithGoogle, signOut, updateRestaurantName, updateProfileData }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
