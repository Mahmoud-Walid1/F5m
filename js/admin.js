// Admin Panel JavaScript

let currentCategories = [];
let currentProducts = [];
let editingCategoryId = null;
let editingProductId = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function () {
    loadCategories();
    loadProducts();
});

// ==================== Navigation ====================
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');

    // Update menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.menu-item').classList.add('active');
}

// ==================== Categories ====================
async function loadCategories() {
    try {
        const snapshot = await db.collection('categories')
            .orderBy('order')
            .get();

        currentCategories = [];
        snapshot.forEach(doc => {
            currentCategories.push({
                id: doc.id,
                ...doc.data()
            });
        });

        displayCategories();
        updateCategorySelect();
    } catch (error) {
        console.error('Error loading categories:', error);
        alert('خطأ في تحميل الأقسام');
    }
}

function displayCategories() {
    const container = document.getElementById('categories-list');

    if (currentCategories.length === 0) {
        container.innerHTML = '<p class="empty-state">لا توجد أقسام. ابدأ بإضافة قسم جديد!</p>';
        return;
    }

    container.innerHTML = currentCategories.map(category => `
        <divclass="item-card">
            <div class="item-header">
                <span class="item-icon">${category.icon || '📁'}</span>
                <h3>${category.nameAr}</h3>
                ${!category.isActive ? '<span class="badge-inactive">غير نشط</span>' : ''}
            </div>
            ${category.image ? `<img src="${category.image}" class="item-image" alt="${category.nameAr}">` : ''}
            <div class="item-footer">
                <button class="btn-edit" onclick="editCategory('${category.id}')">✏️ تعديل</button>
                <button class="btn-delete" onclick="deleteCategory('${category.id}')">🗑️ حذف</button>
            </div>
        </div>
    `).join('');
}

function openCategoryForm(categoryId = null) {
    editingCategoryId = categoryId;

    if (categoryId) {
        const category = currentCategories.find(c => c.id === categoryId);
        document.getElementById('category-form-title').textContent = 'تعديل القسم';
        document.getElementById('category-id').value = categoryId;
        document.getElementById('category-name').value = category.nameAr;
        document.getElementById('category-icon').value = category.icon || '';
        document.getElementById('category-image-url').value = category.image || '';
        document.getElementById('category-order').value = category.order || 1;
        document.getElementById('category-active').checked = category.isActive;

        // Show current image
        if (category.image) {
            document.getElementById('category-image-preview').innerHTML =
                `<img src="${category.image}" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`;
        }
    } else {
        document.getElementById('category-form-title').textContent = 'إضافة قسم جديد';
        document.getElementById('category-form').reset();
        document.getElementById('category-id').value = '';
        document.getElementById('category-image-preview').innerHTML = '';
    }

    document.getElementById('category-modal').classList.add('show');
}

function closeCategoryForm() {
    document.getElementById('category-modal').classList.remove('show');
    editingCategoryId = null;
}

function editCategory(id) {
    openCategoryForm(id);
}

async function saveCategory(event) {
    event.preventDefault();

    const saveBtn = document.getElementById('category-save-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'جاري الحفظ...';

    try {
        // Handle image upload
        let imageUrl = document.getElementById('category-image-url').value;
        const imageFile = document.getElementById('category-image-file').files[0];

        if (imageFile) {
            imageUrl = await uploadImageToGitHub(imageFile);
        }

        const categoryData = {
            nameAr: document.getElementById('category-name').value,
            image: imageUrl || null,
            order: parseInt(document.getElementById('category-order').value) || 1,
            isActive: document.getElementById('category-active').checked,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const categoryId = document.getElementById('category-id').value;

        if (categoryId) {
            // Update existing
            await db.collection('categories').doc(categoryId).update(categoryData);
            alert('تم تحديث القسم بنجاح!');
        } else {
            // Create new
            categoryData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('categories').add(categoryData);
            alert('تم إضافة القسم بنجاح!');
        }

        closeCategoryForm();
        loadCategories();
    } catch (error) {
        console.error('Error saving category:', error);
        alert('خطأ في حفظ القسم: ' + error.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'حفظ';
    }
}

async function deleteCategory(id) {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;

    try {
        await db.collection('categories').doc(id).delete();
        alert('تم حذف القسم بنجاح!');
        loadCategories();
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('خطأ في حذف القسم');
    }
}

// ==================== Products ====================
async function loadProducts() {
    try {
        const snapshot = await db.collection('products')
            .orderBy('order')
            .get();

        currentProducts = [];
        snapshot.forEach(doc => {
            currentProducts.push({
                id: doc.id,
                ...doc.data()
            });
        });

        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        alert('خطأ في تحميل المنتجات');
    }
}

function displayProducts() {
    const container = document.getElementById('products-list');

    if (currentProducts.length === 0) {
        container.innerHTML = '<p class="empty-state">لا توجد منتجات. ابدأ بإضافة منتج جديد!</p>';
        return;
    }

    container.innerHTML = currentProducts.map(product => {
        const category = currentCategories.find(c => c.id === product.categoryId);
        const sizes = product.sizes || [];
        const options = [];
        if (product.hasHot) options.push('ساخن');
        if (product.hasCold) options.push('بارد');

        return `
            <div class="item-card">
                <div class="item-header">
                    <h3>${product.nameAr}</h3>
                    ${!product.isActive ? '<span class="badge-inactive">غير نشط</span>' : ''}
                </div>
                ${product.image ? `<img src="${product.image}" class="item-image" alt="${product.nameAr}">` : ''}
                <div class="item-details">
                    <p><strong>القسم:</strong> ${category ? category.nameAr : 'غير محدد'}</p>
                    ${product.descriptionAr ? `<p><strong>الوصف:</strong> ${product.descriptionAr}</p>` : ''}
                    ${options.length > 0 ? `<p><strong>الخيارات:</strong> ${options.join(', ')}</p>` : ''}
                    ${sizes.length > 0 ? `<p><strong>الأحجام:</strong> ${sizes.map(s => `${s.name}: ${s.price} ر.س`).join(', ')}</p>` : ''}
                </div>
                <div class="item-footer">
                    <button class="btn-edit" onclick="editProduct('${product.id}')">✏️ تعديل</button>
                    <button class="btn-delete" onclick="deleteProduct('${product.id}')">🗑️ حذف</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateCategorySelect() {
    const select = document.getElementById('product-category');
    select.innerHTML = '<option value="">اختر القسم...</option>' +
        currentCategories.map(cat => `<option value="${cat.id}">${cat.nameAr}</option>`).join('');
}

function openProductForm(productId = null) {
    editingProductId = productId;

    if (productId) {
        const product = currentProducts.find(p => p.id === productId);
        document.getElementById('product-form-title').textContent = 'تعديل المنتج';
        document.getElementById('product-id').value = productId;
        document.getElementById('product-name').value = product.nameAr;
        document.getElementById('product-description').value = product.descriptionAr || '';
        document.getElementById('product-category').value = product.categoryId;
        document.getElementById('product-image').value = product.image || '';
        document.getElementById('product-has-hot').checked = product.hasHot || false;
        document.getElementById('product-has-cold').checked = product.hasCold || false;
        document.getElementById('product-order').value = product.order || 1;
        document.getElementById('product-active').checked = product.isActive;

        // Load sizes
        const container = document.getElementById('sizes-container');
        container.innerHTML = '';
        (product.sizes || []).forEach(size => {
            const row = createSizeRow();
            row.querySelector('.size-name').value = size.name;
            row.querySelector('.size-price').value = size.price;
            container.appendChild(row);
        });

        if (container.children.length === 0) {
            container.appendChild(createSizeRow());
        }
    } else {
        document.getElementById('product-form-title').textContent = 'إضافة منتج جديد';
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';

        // Reset sizes
        const container = document.getElementById('sizes-container');
        container.innerHTML = '';
        container.appendChild(createSizeRow());
    }

    document.getElementById('product-modal').classList.add('show');
}

function closeProductForm() {
    document.getElementById('product-modal').classList.remove('show');
    editingProductId = null;
}

function editProduct(id) {
    openProductForm(id);
}

function createSizeRow() {
    const div = document.createElement('div');
    div.className = 'size-row';
    div.innerHTML = `
        <input type="text" placeholder="الحجم (مثلاً: صغير)" class="size-name">
        <input type="number" placeholder="السعر" class="size-price" min="0" step="0.25">
        <button type="button" class="btn-remove" onclick="removeSize(this)">×</button>
    `;
    return div;
}

function addSizeRow() {
    document.getElementById('sizes-container').appendChild(createSizeRow());
}

function removeSize(button) {
    const container = document.getElementById('sizes-container');
    if (container.children.length > 1) {
        button.parentElement.remove();
    }
}

async function saveProduct(event) {
    event.preventDefault();

    // Collect sizes
    const sizeRows = document.querySelectorAll('.size-row');
    const sizes = [];
    sizeRows.forEach(row => {
        const name = row.querySelector('.size-name').value.trim();
        const price = parseFloat(row.querySelector('.size-price').value);
        if (name && price) {
            sizes.push({ name, price, isAvailable: true });
        }
    });

    const productData = {
        nameAr: document.getElementById('product-name').value,
        descriptionAr: document.getElementById('product-description').value || null,
        categoryId: document.getElementById('product-category').value,
        image: document.getElementById('product-image').value || null,
        hasHot: document.getElementById('product-has-hot').checked,
        hasCold: document.getElementById('product-has-cold').checked,
        sizes: sizes,
        order: parseInt(document.getElementById('product-order').value) || 1,
        isActive: document.getElementById('product-active').checked,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        const productId = document.getElementById('product-id').value;

        if (productId) {
            // Update existing
            await db.collection('products').doc(productId).update(productData);
            alert('تم تحديث المنتج بنجاح!');
        } else {
            // Create new
            productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('products').add(productData);
            alert('تم إضافة المنتج بنجاح!');
        }

        closeProductForm();
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        alert('خطأ في حفظ المنتج');
    }
}

async function deleteProduct(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
        await db.collection('products').doc(id).delete();
        alert('تم حذف المنتج بنجاح!');
        loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('خطأ في حذف المنتج');
    }
}

// ==================== Announcements ====================
let currentAnnouncements = [];
let editingAnnouncementId = null;

async function loadAnnouncements() {
    try {
        const snapshot = await db.collection('announcements')
            .orderBy('priority', 'desc')
            .get();

        currentAnnouncements = [];
        snapshot.forEach(doc => {
            currentAnnouncements.push({
                id: doc.id,
                ...doc.data()
            });
        });

        displayAnnouncements();
    } catch (error) {
        console.error('Error loading announcements:', error);
        alert('خطأ في تحميل الإعلانات');
    }
}

function displayAnnouncements() {
    const container = document.getElementById('announcements-list');

    if (currentAnnouncements.length === 0) {
        container.innerHTML = '<p class="empty-state">لا توجد إعلانات. ابدأ بإضافة إعلان جديد!</p>';
        return;
    }

    container.innerHTML = currentAnnouncements.map(announcement => `
        <div class="item-card">
            <div class="item-header">
                <h3>${announcement.titleAr}</h3>
                ${!announcement.isActive ? '<span class="badge-inactive">غير نشط</span>' : ''}
            </div>
            ${announcement.image ? `<img src="${announcement.image}" class="item-image" alt="${announcement.titleAr}">` : ''}
            <div class="item-details">
                ${announcement.descriptionAr ? `<p>${announcement.descriptionAr}</p>` : ''}
                <p><strong>الأولوية:</strong> ${announcement.priority}</p>
            </div>
            <div class="item-footer">
                <button class="btn-edit" onclick="editAnnouncement('${announcement.id}')">✏️ تعديل</button>
                <button class="btn-delete" onclick="deleteAnnouncement('${announcement.id}')">🗑️ حذف</button>
            </div>
        </div>
    `).join('');
}

function openAnnouncementForm(announcementId = null) {
    editingAnnouncementId = announcementId;

    if (announcementId) {
        const announcement = currentAnnouncements.find(a => a.id === announcementId);
        document.getElementById('announcement-form-title').textContent = 'تعديل الإعلان';
        document.getElementById('announcement-id').value = announcementId;
        document.getElementById('announcement-title').value = announcement.titleAr;
        document.getElementById('announcement-description').value = announcement.descriptionAr || '';
        document.getElementById('announcement-image-url').value = announcement.image || '';
        document.getElementById('announcement-priority').value = announcement.priority || 1;
        document.getElementById('announcement-active').checked = announcement.isActive;

        // Show current image
        if (announcement.image) {
            document.getElementById('announcement-image-preview').innerHTML =
                `<img src="${announcement.image}" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`;
        }
    } else {
        document.getElementById('announcement-form-title').textContent = 'إضافة إعلان جديد';
        document.getElementById('announcement-form').reset();
        document.getElementById('announcement-id').value = '';
        document.getElementById('announcement-image-preview').innerHTML = '';
    }

    document.getElementById('announcement-modal').classList.add('show');
}

function closeAnnouncementForm() {
    document.getElementById('announcement-modal').classList.remove('show');
    editingAnnouncementId = null;
}

function editAnnouncement(id) {
    openAnnouncementForm(id);
}

async function saveAnnouncement(event) {
    event.preventDefault();

    const saveBtn = document.getElementById('announcement-save-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'جاري الحفظ...';

    try {
        // Handle image upload
        let imageUrl = document.getElementById('announcement-image-url').value;
        const imageFile = document.getElementById('announcement-image-file').files[0];

        if (imageFile) {
            imageUrl = await uploadImageToGitHub(imageFile);
        }

        const announcementData = {
            titleAr: document.getElementById('announcement-title').value,
            descriptionAr: document.getElementById('announcement-description').value || null,
            image: imageUrl || null,
            priority: parseInt(document.getElementById('announcement-priority').value) || 1,
            isActive: document.getElementById('announcement-active').checked,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const announcementId = document.getElementById('announcement-id').value;

        if (announcementId) {
            await db.collection('announcements').doc(announcementId).update(announcementData);
            alert('تم تحديث الإعلان بنجاح!');
        } else {
            announcementData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('announcements').add(announcementData);
            alert('تم إضافة الإعلان بنجاح!');
        }

        closeAnnouncementForm();
        loadAnnouncements();
    } catch (error) {
        console.error('Error saving announcement:', error);
        alert('خطأ في حفظ الإعلان: ' + error.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'حفظ';
    }
}

async function deleteAnnouncement(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

    try {
        await db.collection('announcements').doc(id).delete();
        alert('تم حذف الإعلان بنجاح!');
        loadAnnouncements();
    } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('خطأ في حذف الإعلان');
    }
}

// ==================== Image Preview Handlers ====================
document.addEventListener('DOMContentLoaded', function () {
    // Category image preview
    const categoryImageFile = document.getElementById('category-image-file');
    if (categoryImageFile) {
        categoryImageFile.addEventListener('change', function (e) {
            if (e.target.files[0]) {
                previewImage(e.target.files[0], 'category-image-preview');
            }
        });
    }

    // Product image preview
    const productImageFile = document.getElementById('product-image-file');
    if (productImageFile) {
        productImageFile.addEventListener('change', function (e) {
            if (e.target.files[0]) {
                previewImage(e.target.files[0], 'product-image-preview');
            }
        });
    }

    // Announcement image preview
    const announcementImageFile = document.getElementById('announcement-image-file');
    if (announcementImageFile) {
        announcementImageFile.addEventListener('change', function (e) {
            if (e.target.files[0]) {
                previewImage(e.target.files[0], 'announcement-image-preview');
            }
        });
    }

    // Load announcements section
    loadAnnouncements();
});
