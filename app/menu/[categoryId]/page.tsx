'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { getCategoryById, getProductsByCategory } from '@/lib/firebase/firestore';
import type { Category, Product } from '@/types';
import ProductCard from '@/components/customer/ProductCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params.categoryId as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cat, prods] = await Promise.all([
                    getCategoryById(categoryId),
                    getProductsByCategory(categoryId),
                ]);
                setCategory(cat);
                setProducts(prods);
            } catch (error) {
                console.error('Error fetching category data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchData();
        }
    }, [categoryId]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-arabic text-gray-600">القسم غير موجود</h2>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 text-fakhr-purple hover:underline"
                    >
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main
            className="min-h-screen pattern-bg"
            style={{ backgroundColor: category.theme.backgroundColor }}
        >
            {/* Header */}
            <div
                className="py-8 px-4"
                style={{
                    background: `linear-gradient(135deg, ${category.theme.primaryColor} 0%, ${category.theme.secondaryColor} 100%)`,
                }}
            >
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={() => router.push('/')}
                        className="text-white hover:scale-110 transition-transform mb-4 flex items-center gap-2"
                    >
                        <ArrowRight className="w-6 h-6" />
                        <span className="font-arabic">العودة</span>
                    </button>

                    <div className="text-center text-white">
                        <div className="text-6xl mb-4">{category.icon}</div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold">
                            {category.nameAr}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500 font-arabic">
                            لا توجد منتجات في هذا القسم حالياً
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                categoryTheme={category.theme}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
