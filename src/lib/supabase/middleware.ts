import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: セッションをリフレッシュするために getUser() を呼び出す
  // サーバーコンポーネントでは getUser() を使用する（getSession()は使わない）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // メール確認のcodeパラメータがトップページにある場合、callbackにリダイレクト
  if (request.nextUrl.pathname === '/' && request.nextUrl.searchParams.has('code')) {
    const code = request.nextUrl.searchParams.get('code');
    const url = request.nextUrl.clone();
    url.pathname = '/auth/callback';
    url.search = `?code=${code}`;
    return NextResponse.redirect(url);
  }

  // エラーパラメータがトップページにある場合、ログインページにリダイレクト
  if (request.nextUrl.pathname === '/' && request.nextUrl.searchParams.has('error')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // searchParamsはそのまま保持される（error, error_code, error_descriptionなど）
    return NextResponse.redirect(url);
  }

  // 認証が必要なルートを保護
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 認証されていないユーザーが保護されたルートにアクセスしようとした場合、ログインページにリダイレクト
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 認証済みユーザーがログイン/サインアップページ、またはトップページにアクセスしようとした場合、ダッシュボードにリダイレクト
  if (
    user &&
    (request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/signup')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
