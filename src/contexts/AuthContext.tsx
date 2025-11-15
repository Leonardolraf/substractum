import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'seller' | 'user';
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  signup: (email: string, password: string, username?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer the role fetching to avoid blocking the auth callback
          setTimeout(() => {
            fetchUserRole(session.user.id, session.user.email || '');
          }, 0);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        fetchUserRole(session.user.id, session.user.email || '');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string, email: string): Promise<'admin' | 'seller' | 'user'> => {
    try {
      const { data: roleData } = await (supabase as any)
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      const role = roleData?.role || 'user';
      
      setUser({
        id: userId,
        email: email,
        role: role as 'admin' | 'seller' | 'user'
      });
      
      return role as 'admin' | 'seller' | 'user';
    } catch (error) {
      console.error('Error fetching user role:', error);
      // Default to user role if fetch fails
      setUser({
        id: userId,
        email: email,
        role: 'user'
      });
      return 'user';
    }
  };

  const signup = async (email: string, password: string, username?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: username || email.split('@')[0]
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: 'Erro ao criar conta' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: AuthUser }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        // Fetch user role
        const role = await fetchUserRole(data.user.id, data.user.email || '');
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          role: role
        };
        return { success: true, user: authUser };
      }

      return { success: false, error: 'Erro ao fazer login' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    login,
    signup,
    logout,
    isAuthenticated: !!session,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
