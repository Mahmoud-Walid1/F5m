'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { AnnouncementModalProps } from '@/types';

export default function AnnouncementModal({ announcement, isOpen, onClose }: AnnouncementModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform z-10"
                    >
                        <X className="w-6 h-6 text-fakhr-purple" />
                    </button>

                    {/* Image */}
                    {announcement.image && (
                        <div className="relative w-full h-64">
                            <Image
                                src={announcement.image}
                                alt={announcement.titleAr}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-8">
                        <h2 className="text-3xl font-display font-bold text-fakhr-purple mb-4">
                            {announcement.titleAr}
                        </h2>
                        <p className="text-lg font-arabic text-gray-700 leading-relaxed">
                            {announcement.descriptionAr}
                        </p>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="mt-6 w-full bg-gradient-purple text-white py-3 rounded-xl font-arabic font-bold hover:shadow-lg transition-all"
                        >
                            إغلاق
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
