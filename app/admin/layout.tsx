'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    Megaphone,
    Users,
    Settings,
    LogOut
} from 'lucide-react';
import { logout } from '@/lib/firebase/auth';
import toast from 'react-hot-toast';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router, pathname]);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('تم تسجيل الخروج بنجاح');
            router.push('/admin/login');
        } catch (error) {
            toast.error('حدث خطأ أثناء تسجيل الخروج');
        }
    };

    // Don't show layout on login page
    if (pathname === '/admin/login') {
        return children;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="spinner" />
            </div>
        );
    }

    const menuItems = [
        { name: 'لوحة التحكم', icon: LayoutDashboard, href: '/admin/dashboard' },
        { name: 'الأقسام', icon: FolderOpen, href: '/admin/categories' },
        { name: 'المنتجات', icon: Package, href: '/admin/products' },
        { name: 'الإعلانات', icon: Megaphone, href: '/admin/announcements' },
        { name: 'المديرين', icon: Users, href: '/admin/admins' },
        { name: 'الإعدادات', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-purple text-white flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-white/20">
                    <h1 className="text-2xl font-display font-bold text-center">
                        فخم البن
                    </h1>
                    <p className="text-sm text-center opacity-80 font-arabic mt-1">
                        لوحة التحكم
                    </p>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-arabic ${isActive
                                    ? 'bg-white text-fakhr-purple shadow-lg'
                                    : 'hover:bg-white/10'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/20">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all w-full font-arabic"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
