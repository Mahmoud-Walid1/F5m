'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Package, FolderOpen, Megaphone, TrendingUp } from 'lucide-react';

interface Stats {
    categories: number;
    products: number;
    announcements: number;
    activeProducts: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        categories: 0,
        products: 0,
        announcements: 0,
        activeProducts: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [categoriesSnap, productsSnap, announcementsSnap, activeProductsSnap] = await Promise.all([
                    getDocs(collection(db, 'categories')),
                    getDocs(collection(db, 'products')),
                    getDocs(collection(db, 'announcements')),
                    getDocs(query(collection(db, 'products'), where('isActive', '==', true))),
                ]);

                setStats({
                    categories: categoriesSnap.size,
                    products: productsSnap.size,
                    announcements: announcementsSnap.size,
                    activeProducts: activeProductsSnap.size,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'الأقسام',
            value: stats.categories,
            icon: FolderOpen,
            color: 'bg-blue-500',
        },
        {
            title: 'المنتجات',
            value: stats.products,
            icon: Package,
            color: 'bg-green-500',
        },
        {
            title: 'المنتجات النشطة',
            value: stats.activeProducts,
            icon: TrendingUp,
            color: 'bg-purple-500',
        },
        {
            title: 'الإعلانات',
            value: stats.announcements,
            icon: Megaphone,
            color: 'bg-orange-500',
        },
    ];

    return (
        <div>
            <h1 className="text-3xl font-display font-bold text-gray-800 mb-8">
                لوحة التحكم
            </h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="spinner" />
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 font-arabic mb-2">
                                                {stat.title}
                                            </p>
                                            <p className="text-3xl font-bold text-gray-800">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className={`${stat.color} p-4 rounded-xl`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-display font-bold text-gray-800 mb-4">
                            إجراءات سريعة
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a
                                href="/admin/products"
                                className="p-4 border-2 border-fakhr-purple rounded-xl hover:bg-fakhr-purple/5 transition-colors text-center"
                            >
                                <Package className="w-8 h-8 text-fakhr-purple mx-auto mb-2" />
                                <p className="font-arabic text-gray-700">إضافة منتج جديد</p>
                            </a>
                            <a
                                href="/admin/categories"
                                className="p-4 border-2 border-fakhr-purple rounded-xl hover:bg-fakhr-purple/5 transition-colors text-center"
                            >
                                <FolderOpen className="w-8 h-8 text-fakhr-purple mx-auto mb-2" />
                                <p className="font-arabic text-gray-700">إضافة قسم جديد</p>
                            </a>
                            <a
                                href="/admin/announcements"
                                className="p-4 border-2 border-fakhr-purple rounded-xl hover:bg-fakhr-purple/5 transition-colors text-center"
                            >
                                <Megaphone className="w-8 h-8 text-fakhr-purple mx-auto mb-2" />
                                <p className="font-arabic text-gray-700">إضافة إعلان</p>
                            </a>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
