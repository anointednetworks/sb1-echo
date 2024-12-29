import { supabase } from '../supabase';
import type { AuthError } from '@supabase/supabase-js';

interface SignUpData {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

export const authService = {
  async signUp({ email, password, username, fullName }: SignUpData) {
    // First create the auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('Failed to create user');

    try {
      // Then create the profile with the same ID
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username,
          full_name: fullName,
        });

      if (profileError) throw profileError;
      
      return { user: authData.user, error: null };
    } catch (error) {
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.signOut();
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { user: data.user, error: null };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};