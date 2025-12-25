import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
    title: "فخم البن - قائمة المشروبات والحلويات",
    description: "استمتع بأفضل المشروبات والحلويات في فخم البن",
    keywords: ["قهوة", "مشروبات", "حلويات", "فخم البن", "كافيه"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl">
            <body className="antialiased">
                {children}
                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#7E60A8',
                            color: '#fff',
                            fontFamily: 'var(--font-cairo)',
                        },
                    }}
                />
            </body>
        </html>
    );
}
