export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
                <div className="spinner mx-auto mb-4" />
                <p className="text-xl font-arabic text-fakhr-purple">جاري التحميل...</p>
            </div>
        </div>
    );
}
