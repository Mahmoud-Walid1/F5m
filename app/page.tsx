'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories, getActiveAnnouncements, getSiteSettings } from '@/lib/firebase/firestore';
import type { Category, Announcement, SiteSettings } from '@/types';
import CategoryCard from '@/components/customer/CategoryCard';
import AnnouncementModal from '@/components/customer/AnnouncementModal';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Coffee, Instagram, Facebook, MessageCircle } from 'lucide-react';

export default function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAnnouncement, setShowAnnouncement] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, anns, sets] = await Promise.all([
                    getCategories(),
                    getActiveAnnouncements(),
                    getSiteSettings(),
                ]);
                setCategories(cats);
                setAnnouncements(anns);
                setSettings(sets);

                // Show announcement modal if available
                if (anns.length > 0) {
                    setShowAnnouncement(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <main className="min-h-screen pattern-bg">
            {/* Hero Section */}
            <div className="bg-gradient-purple text-white py-12 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        {settings?.logo ? (
                            <Image
                                src={settings.logo}
                                alt={settings.siteNameAr}
                                width={150}
                                height={150}
                                className="drop-shadow-2xl"
                            />
                        ) : (
                            <Coffee className="w-24 h-24" />
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                        {settings?.siteNameAr || 'فخم البن'}
                    </h1>
                    <p className="text-xl md:text-2xl font-arabic opacity-90">
                        استمتع بأفضل المشروبات والحلويات
                    </p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <h2 className="text-3xl font-display font-bold text-center mb-10 text-fakhr-purple">
                    القائمة
                </h2>

                {categories.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500 font-arabic">
                            لا توجد أقسام متاحة حالياً
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category, index) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                delay={index * 100}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {settings?.socialMedia && (
                <footer className="bg-fakhr-purple text-white py-8 mt-20">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex justify-center gap-6 mb-4">
                            {settings.socialMedia.instagram && (
                                <a
                                    href={settings.socialMedia.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform"
                                >
                                    <Instagram className="w-8 h-8" />
                                </a>
                            )}
                            {settings.socialMedia.facebook && (
                                <a
                                    href={settings.socialMedia.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform"
                                >
                                    <Facebook className="w-8 h-8" />
                                </a>
                            )}
                            {settings.socialMedia.whatsapp && (
                                <a
                                    href={`https://wa.me/${settings.socialMedia.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform"
                                >
                                    <MessageCircle className="w-8 h-8" />
                                </a>
                            )}
                        </div>
                        <p className="text-center font-arabic">
                            © 2025 {settings.siteNameAr}. جميع الحقوق محفوظة.
                        </p>
                    </div>
                </footer>
            )}

            {/* Announcement Modal */}
            {announcements.length > 0 && (
                <AnnouncementModal
                    announcement={announcements[0]}
                    isOpen={showAnnouncement}
                    onClose={() => setShowAnnouncement(false)}
                />
            )}
        </main>
    );
}
