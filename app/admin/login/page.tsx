'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithEmail } from '@/lib/firebase/auth';
import { Coffee, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await loginWithEmail(email, password);
            toast.success('تم تسجيل الدخول بنجاح');
            router.push('/admin/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error('خطأ في البريد الإلكتروني أو كلمة المرور');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-purple flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Coffee className="w-16 h-16 text-fakhr-purple" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-fakhr-purple">
                        فخم البن
                    </h1>
                    <p className="text-gray-600 font-arabic mt-2">لوحة التحكم</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-arabic text-gray-700 mb-2">
                            البريد الإلكتروني
                        </label>
                        <div className="relative">
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-fakhr-purple focus:outline-none transition-colors font-arabic"
                                placeholder="admin@example.com"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-arabic text-gray-700 mb-2">
                            كلمة المرور
                        </label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-fakhr-purple focus:outline-none transition-colors font-arabic"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-purple text-white py-3 rounded-xl font-arabic font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                    </button>
                </form>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="text-fakhr-purple hover:underline font-arabic text-sm"
                    >
                        العودة للصفحة الرئيسية
                    </button>
                </div>
            </div>
        </div>
    );
}
