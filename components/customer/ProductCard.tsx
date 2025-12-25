'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { ProductCardProps } from '@/types';

export default function ProductCard({ product, categoryTheme }: ProductCardProps) {
    const { nameAr, descriptionAr, image, options, basePrice } = product;

    // Determine price display
    const getPriceDisplay = () => {
        if (options.sizes && options.sizes.length > 0) {
            const prices = options.sizes
                .filter((s) => s.isAvailable)
                .map((s) => s.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            if (minPrice === maxPrice) {
                return `${minPrice} جنيه`;
            }
            return `${minPrice} - ${maxPrice} جنيه`;
        }
        return basePrice ? `${basePrice} جنيه` : '';
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
            {/* Product Image */}
            <div className="relative w-full h-48">
                <Image
                    src={image || '/placeholder-product.jpg'}
                    alt={nameAr}
                    fill
                    className="object-cover"
                />
                {/* Overlay with gradient */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                />
            </div>

            {/* Product Info */}
            <div className="p-5">
                <h3
                    className="text-xl font-display font-bold mb-2"
                    style={{ color: categoryTheme?.primaryColor || '#7E60A8' }}
                >
                    {nameAr}
                </h3>

                {descriptionAr && (
                    <p className="text-sm font-arabic text-gray-600 mb-3 leading-relaxed">
                        {descriptionAr}
                    </p>
                )}

                {/* Options */}
                <div className="space-y-2 mb-3">
                    {/* Sizes */}
                    {options.sizes && options.sizes.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {options.sizes.filter((s) => s.isAvailable).map((size, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs px-3 py-1 rounded-full font-arabic"
                                    style={{
                                        backgroundColor: categoryTheme?.secondaryColor || '#9B7EBD',
                                        color: 'white',
                                    }}
                                >
                                    {size.name}: {size.price} جم
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Temperature */}
                    {options.temperature && (
                        <div className="flex gap-2 text-xs font-arabic">
                            {options.temperature.hot.available && (
                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
                                    ساخن ☕
                                </span>
                            )}
                            {options.temperature.cold.available && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                                    بارد 🧊
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Price */}
                <div className="flex justify-between items-center border-t pt-3">
                    <span className="text-lg font-bold font-mono text-fakhr-brown">
                        {getPriceDisplay()}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
