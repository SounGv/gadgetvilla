'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema, type LoginForm, type RegisterForm } from '@/lib/validations/auth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function AccountPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [serverError, setServerError] = useState('');

  const login = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const reg = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const field = 'w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-accent';
  const err = 'mt-1 text-xs text-error';

  const onLogin = async (data: LoginForm) => {
    setServerError('');
    try {
      const res = await api.post('/auth/login', data);
      if (typeof window !== 'undefined') window.localStorage.setItem('gv_access_token', res.data.accessToken);
      router.push('/');
    } catch {
      setServerError('อีเมลหรือรหัสผ่านไม่ถูกต้อง (ต้องเชื่อม API จริง)');
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setServerError('');
    try {
      await api.post('/auth/register', data);
      setMode('login');
    } catch {
      setServerError('สมัครสมาชิกไม่สำเร็จ (ต้องเชื่อม API จริง)');
    }
  };

  return (
    <div className="container-gv flex justify-center py-16">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">
        <div className="mb-6 flex gap-1 rounded-full border border-border p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 rounded-full py-2 text-sm font-bold ${mode === 'login' ? 'bg-brand text-brand-fg' : 'text-fg-muted'}`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 rounded-full py-2 text-sm font-bold ${mode === 'register' ? 'bg-brand text-brand-fg' : 'text-fg-muted'}`}
          >
            สมัครสมาชิก
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={login.handleSubmit(onLogin)} className="space-y-4">
            <div>
              <input placeholder="อีเมล" className={field} {...login.register('email')} />
              {login.formState.errors.email && <p className={err}>{login.formState.errors.email.message}</p>}
            </div>
            <div>
              <input type="password" placeholder="รหัสผ่าน" className={field} {...login.register('password')} />
              {login.formState.errors.password && <p className={err}>{login.formState.errors.password.message}</p>}
            </div>
            {serverError && <p className={err}>{serverError}</p>}
            <Button type="submit" variant="accent" className="w-full" loading={login.formState.isSubmitting}>
              เข้าสู่ระบบ
            </Button>
            <a href={`${API}/auth/google`} className="flex w-full items-center justify-center gap-2 rounded-full border border-border py-2.5 text-sm font-bold hover:bg-bg-subtle">
              เข้าสู่ระบบด้วย Google
            </a>
          </form>
        ) : (
          <form onSubmit={reg.handleSubmit(onRegister)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="ชื่อ" className={field} {...reg.register('firstName')} />
              <input placeholder="นามสกุล" className={field} {...reg.register('lastName')} />
            </div>
            <div>
              <input placeholder="อีเมล" className={field} {...reg.register('email')} />
              {reg.formState.errors.email && <p className={err}>{reg.formState.errors.email.message}</p>}
            </div>
            <div>
              <input type="password" placeholder="รหัสผ่าน" className={field} {...reg.register('password')} />
              {reg.formState.errors.password && <p className={err}>{reg.formState.errors.password.message}</p>}
            </div>
            <div>
              <input type="password" placeholder="ยืนยันรหัสผ่าน" className={field} {...reg.register('confirmPassword')} />
              {reg.formState.errors.confirmPassword && <p className={err}>{reg.formState.errors.confirmPassword.message}</p>}
            </div>
            {serverError && <p className={err}>{serverError}</p>}
            <Button type="submit" variant="accent" className="w-full" loading={reg.formState.isSubmitting}>
              สมัครสมาชิก
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
