'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

type ActionState = {
  error?: string;
  success?: string;
};

export async function signUp(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');

  // メール確認が必要な場合のメッセージ
  return {
    success: '確認メールを送信しました。メールボックスを確認して、メールアドレスを認証してください。'
  };
}

export async function signIn(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // エラーメッセージを日本語化
    let errorMessage = error.message;
    if (error.message === 'Email not confirmed') {
      errorMessage = 'メールアドレスが確認されていません。確認メールをご確認ください。';
    } else if (error.message === 'Invalid login credentials') {
      errorMessage = 'メールアドレスまたはパスワードが正しくありません。';
    }
    return { error: errorMessage };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}
