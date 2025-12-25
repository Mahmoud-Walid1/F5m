// App.js - Main application logic

// Global state
let categories = [];
let products = [];
let announcements = [];
let currentCategory = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    initApp();
});

async function initApp() {
    try {
        // Load data from Firestore
        await Promise.all([
            loadCategories(),
            loadProducts(),
            loadAnnouncements()
        ]);

        // Display categories
        displayCategories();

        // Show announcement if exists
        showAnnouncement();

        // Hide loading screen
        hideLoadingScreen();
    } catch (error) {
        console.error('Error initializing app:', error);
        hideLoadingScreen();
        alert('حدث خطأ في تحميل البيانات. يرجى التحديث.');
    }
}

// Load categories from Firestore
async function loadCategories() {
    try {
        const snapshot = await db.collection('categories')
            .where('isActive', '==', true)
            .orderBy('order')
            .get();

        categories = [];
        snapshot.forEach(doc => {
            categories.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log('Loaded categories:', categories.length);
    } catch (error) {
        console.error('Error loading categories:', error);
        // If no data, use sample data
        categories = getSampleCategories();
    }
}

// Load products from Firestore
async function loadProducts() {
    try {
        const snapshot = await db.collection('products')
            .where('isActive', '==', true)
            .orderBy('order')
            .get();

        products = [];
        snapshot.forEach(doc => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log('Loaded products:', products.length);
    } catch (error) {
        console.error('Error loading products:', error);
        // If no data, use sample data
        products = getSampleProducts();
    }
}

// Load announcements from Firestore
async function loadAnnouncements() {
    try {
        const snapshot = await db.collection('announcements')
            .where('isActive', '==', true)
            .orderBy('priority', 'desc')
            .limit(1)
            .get();

        announcements = [];
        snapshot.forEach(doc => {
            announcements.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log('Loaded announcements:', announcements.length);
    } catch (error) {
        console.error('Error loading announcements:', error);
    }
}

// Display categories on page
function displayCategories() {
    const grid = document.getElementById('categories-grid');

    if (categories.length === 0) {
        grid.innerHTML = `
            <div class="loading-coffee-container">
                <div class="coffee-cup">
                    <div class="cup-body">
                        <div class="coffee-fill"></div>
                        <div class="steam">
                            <span class="steam-line"></span>
                            <span class="steam-line"></span>
                            <span class="steam-line"></span>
                        </div>
                    </div>
                    <div class="cup-handle"></div>
                </div>
                <p class="loading-text">جاري تحضير القائمة...</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = categories.map(category => {
        const imageHtml = category.image ?
            `<img src="${category.image}" alt="${category.nameAr}" class="category-image">` :
            `<span class="category-icon">${category.icon || '☕'}</span>`;

        return `
            <div class="category-card" onclick="scrollToCategory('${category.id}')">
                ${imageHtml}
                <h3 class="category-name">${category.nameAr}</h3>
                <div class="category-line"></div>
            </div>
        `;
    }).join('');

    // Also display all products grouped by category
    displayAllProducts();
}

// Display all products grouped by category
function displayAllProducts() {
    const container = document.getElementById('products-sections');

    if (categories.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = categories.map(category => {
        const categoryProducts = products.filter(p => p.categoryId === category.id);

        if (categoryProducts.length === 0) return '';

        return `
            <div class="product-section" id="category-${category.id}">
                <div class="product-section-header">
                    <span class="product-section-icon">${category.icon || '☕'}</span>
                    <h2 class="product-section-title">${category.nameAr}</h2>
                    <a href="#categories-grid" class="back-to-categories">← العودة للأقسام</a>
                </div>
                <div class="products-grid">
                    ${categoryProducts.map(product => createProductCard(product)).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Scroll to category products
function scrollToCategory(categoryId) {
    const section = document.getElementById(`category-${categoryId}`);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Create product card HTML
function createProductCard(product) {
    // Image
    const imageHtml = product.image ?
        `<img src="${product.image}" alt="${product.nameAr}" class="product-image">` :
        `<div class="product-image-placeholder">☕</div>`;

    // Sizes
    let sizesHtml = '';
    if (product.sizes && product.sizes.length > 0) {
        sizesHtml = `
            <div class="product-sizes">
                ${product.sizes.map(size =>
            `<span class="size-badge">${size.name}: ${size.price} ر.س</span>`
        ).join('')}
            </div>
        `;
    }

    // Temperature options
    let optionsHtml = '';
    if (product.hasHot || product.hasCold) {
        optionsHtml = '<div class="product-options">';
        if (product.hasHot) {
            optionsHtml += '<span class="option-badge option-hot">ساخن ☕</span>';
        }
        if (product.hasCold) {
            optionsHtml += '<span class="option-badge option-cold">بارد 🧊</span>';
        }
        optionsHtml += '</div>';
    }

    // Get minimum price for display
    let priceDisplay = '';
    if (product.sizes && product.sizes.length > 0) {
        const minPrice = Math.min(...product.sizes.map(s => s.price));
        priceDisplay = `<div class="product-price">${minPrice} ر.س</div>`;
    }

    return `
        <div class="product-card">
            ${imageHtml}
            <div class="product-info">
                <h4 class="product-name">${product.nameAr}</h4>
                ${product.descriptionAr ? `<p class="product-description">${product.descriptionAr}</p>` : ''}
                ${sizesHtml}
                ${optionsHtml}
            </div>
            ${priceDisplay}
        </div>
    `;
}

// Show announcement
function showAnnouncement() {
    if (announcements.length === 0) return;

    const announcement = announcements[0];
    const container = document.getElementById('announcement-container');

    container.innerHTML = `
        ${announcement.image ? `<img src="${announcement.image}" alt="${announcement.titleAr}" class="announcement-image">` : ''}
        <h3 class="announcement-title">${announcement.titleAr}</h3>
        <p class="announcement-description">${announcement.descriptionAr || ''}</p>
    `;

    // Show modal after a short delay
    setTimeout(() => {
        document.getElementById('announcement-modal').classList.add('show');
    }, 1000);
}

// Close announcement
function closeAnnouncement() {
    document.getElementById('announcement-modal').classList.remove('show');
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

// Sample data (fallback if Firestore is empty)
function getSampleCategories() {
    return [
        {
            id: 'drinks',
            nameAr: 'المشروبات',
            icon: '☕',
            order: 1,
            isActive: true
        },
        {
            id: 'sweets',
            nameAr: 'الحلويات',
            icon: '🍰',
            order: 2,
            isActive: true
        },
        {
            id: 'boxes',
            nameAr: 'البوكسات',
            icon: '🎁',
            order: 3,
            isActive: true
        }
    ];
}

function getSampleProducts() {
    return [
        {
            id: '1',
            nameAr: 'كابتشينو',
            descriptionAr: 'قهوة إيطالية كلاسيكية مع رغوة الحليب',
            categoryId: 'drinks',
            image: '',
            order: 1,
            isActive: true,
            hasHot: true,
            hasCold: true,
            sizes: [
                { name: 'صغير', price: 12, isAvailable: true },
                { name: 'وسط', price: 15, isAvailable: true },
                { name: 'كبير', price: 18, isAvailable: true }
            ]
        },
        {
            id: '2',
            nameAr: 'لاتيه',
            descriptionAr: 'قهوة espresso مع الحليب المبخر',
            categoryId: 'drinks',
            image: '',
            order: 2,
            isActive: true,
            hasHot: true,
            hasCold: true,
            sizes: [
                { name: 'صغير', price: 12, isAvailable: true },
                { name: 'وسط', price: 15, isAvailable: true },
                { name: 'كبير', price: 18, isAvailable: true }
            ]
        }
    ];
}

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});
