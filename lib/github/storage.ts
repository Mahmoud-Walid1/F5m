import { Octokit } from '@octokit/rest';

/**
 * GitHub Image Upload Service
 * Uploads images to a GitHub repository instead of Firebase Storage
 */

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || '';
const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER || '';
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || '';
const GITHUB_BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main';

const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});

/**
 * Convert file to base64
 */
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
    });
};

/**
 * Generate unique filename
 */
export const generateUniqueFilename = (originalName: string, prefix: string = ''): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 9);
    const extension = originalName.split('.').pop();
    return `${prefix}${prefix ? '-' : ''}${timestamp}-${randomString}.${extension}`;
};

/**
 * Upload image to GitHub repository
 * @param file - The image file
 * @param folder - Folder in repo (e.g., 'products', 'categories')
 * @returns The raw GitHub URL of the uploaded image
 */
export const uploadImageToGitHub = async (
    file: File,
    folder: string = 'images'
): Promise<string> => {
    try {
        // Convert file to base64
        const base64Content = await fileToBase64(file);

        // Generate unique filename
        const filename = generateUniqueFilename(file.name);
        const path = `${folder}/${filename}`;

        // Upload to GitHub
        const response = await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path,
            message: `Add image: ${filename}`,
            content: base64Content,
            branch: GITHUB_BRANCH,
        });

        // Return raw GitHub URL
        const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;
        return rawUrl;
    } catch (error) {
        console.error('Error uploading to GitHub:', error);
        throw new Error('Failed to upload image to GitHub');
    }
};

/**
 * Delete image from GitHub repository
 * @param imageUrl - The GitHub raw URL
 */
export const deleteImageFromGitHub = async (imageUrl: string): Promise<void> => {
    try {
        // Extract path from URL
        const urlParts = imageUrl.split(`/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/`);
        if (urlParts.length < 2) {
            throw new Error('Invalid GitHub URL');
        }
        const path = urlParts[1];

        // Get file SHA (required for deletion)
        const fileData = await octokit.repos.getContent({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path,
            ref: GITHUB_BRANCH,
        });

        if ('sha' in fileData.data) {
            // Delete file
            await octokit.repos.deleteFile({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path,
                message: `Delete image: ${path}`,
                sha: fileData.data.sha,
                branch: GITHUB_BRANCH,
            });
        }
    } catch (error) {
        console.error('Error deleting from GitHub:', error);
        throw new Error('Failed to delete image from GitHub');
    }
};

/**
 * Compress image before upload (client-side)
 */
export const compressImage = (
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 1200,
    quality: number = 0.8
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = height * (maxWidth / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = width * (maxHeight / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Canvas toBlob failed'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};
