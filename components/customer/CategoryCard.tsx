'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { CategoryCardProps } from '@/types';

export default function CategoryCard({ category, delay = 0 }: CategoryCardProps & { delay?: number }) {
    const { nameAr, icon, theme, id } = category;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay / 1000 }}
        >
            <Link href={`/menu/${id}`}>
                <div
                    className="glass rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group overflow-hidden relative"
                    style={{
                        backgroundColor: theme.backgroundColor || '#FAF6F1',
                    }}
                >
                    {/* Pattern Overlay */}
                    <div
                        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                        style={{
                            backgroundImage: theme.patternStyle === 'winter'
                                ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)'
                                : theme.patternStyle === 'summer'
                                    ? 'radial-gradient(circle, currentColor 1px, transparent 1px)'
                                    : 'none',
                            backgroundSize: theme.patternStyle === 'summer' ? '20px 20px' : 'auto',
                            color: theme.primaryColor,
                        }}
                    />

                    {/* Icon */}
                    <div className="relative z-10 mb-4 text-6xl">{icon}</div>

                    {/* Title */}
                    <h3
                        className="text-2xl font-display font-bold mb-2 group-hover:scale-110 transition-transform relative z-10"
                        style={{ color: theme.primaryColor }}
                    >
                        {nameAr}
                    </h3>

                    {/* Decorative Line */}
                    <div
                        className="h-1 w-20 mx-auto rounded-full mt-4"
                        style={{ backgroundColor: theme.secondaryColor }}
                    />
                </div>
            </Link>
        </motion.div>
    );
}
