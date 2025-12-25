// GitHub Configuration
// ⚠️ مهم: لا ترفع الـ Token على GitHub! احتفظ به محلياً فقط
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN'; // ضع الـ token هنا محلياً فقط
const GITHUB_OWNER = 'Mahmoud-Walid1';
const GITHUB_REPO = 'F5m';
const GITHUB_BRANCH = 'main';
const IMAGES_FOLDER = 'images';

// Upload image to GitHub
async function uploadImageToGitHub(file) {
    if (!file) return null;

    try {
        // إنشاء اسم فريد للصورة
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const filePath = `${IMAGES_FOLDER}/${fileName}`;

        // قراءة الصورة كـ Base64
        const base64 = await fileToBase64(file);
        const content = base64.split(',')[1]; // إزالة metadata

        // رفع الصورة لـ GitHub
        const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Upload image: ${fileName}`,
                content: content,
                branch: GITHUB_BRANCH
            })
        });

        if (!response.ok) {
            throw new Error('فشل رفع الصورة لـ GitHub');
        }

        const data = await response.json();

        // إرجاع رابط الصورة
        return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`;
    } catch (error) {
        console.error('Error uploading to GitHub:', error);
        throw error;
    }
}

// تحويل File إلى Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Preview image
function previewImage(file, previewElementId) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const preview = document.getElementById(previewElementId);
        preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`;
    };
    reader.readAsDataURL(file);
}

// Export
window.uploadImageToGitHub = uploadImageToGitHub;
window.previewImage = previewImage;
