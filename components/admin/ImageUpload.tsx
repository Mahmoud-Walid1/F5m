'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImageToGitHub, compressImage } from '@/lib/github/storage';
import toast from 'react-hot-toast';

interface ImageUploadProps {
    onImageUploaded: (url: string) => void;
    currentImage?: string;
    folder?: string;
    label?: string;
}

export default function ImageUpload({
    onImageUploaded,
    currentImage,
    folder = 'images',
    label = 'رفع صورة',
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string>(currentImage || '');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('يرجى اختيار صورة فقط');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('حجم الصورة كبير جداً (الحد الأقصى 5MB)');
            return;
        }

        try {
            setUploading(true);
            setProgress(20);

            // Show local preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            setProgress(40);

            // Compress image
            const compressedFile = await compressImage(file);
            setProgress(60);

            // Upload to GitHub
            const imageUrl = await uploadImageToGitHub(compressedFile, folder);
            setProgress(90);

            // Success
            setPreview(imageUrl);
            onImageUploaded(imageUrl);
            setProgress(100);
            toast.success('تم رفع الصورة بنجاح ✓');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('فشل رفع الصورة. تأكد من إعدادات GitHub');
            setPreview(currentImage || '');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const handleRemove = () => {
        setPreview('');
        onImageUploaded('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-arabic font-bold text-gray-700 mb-2">
                {label}
            </label>

            {preview ? (
                <div className="relative group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-3 left-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-fakhr-purple hover:bg-purple-50 transition-all"
                >
                    {uploading ? (
                        <div className="space-y-3">
                            <div className="spinner mx-auto" />
                            <p className="text-sm font-arabic text-gray-600">
                                جاري الرفع... {progress}%
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-fakhr-purple h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm font-arabic text-gray-600 mb-1">
                                اضغط لاختيار صورة
                            </p>
                            <p className="text-xs font-arabic text-gray-400">
                                JPG, PNG (حجم أقصى 5MB)
                            </p>
                        </>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
            />

            {uploading && (
                <p className="mt-2 text-xs font-arabic text-gray-500">
                    ⚠️ لا تغلق الصفحة أثناء الرفع
                </p>
            )}
        </div>
    );
}
