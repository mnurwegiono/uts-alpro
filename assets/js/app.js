/**
 * Blog Studi Kasus Algoritma & Pemrograman C++
 * Application JavaScript Logic
 */

// Keys for LocalStorage
const STORAGE_KEY = 'alpro_case_studies';
const BOOKMARKS_KEY = 'alpro_bookmarks';
const THEME_KEY = 'alpro_theme';

// State
let caseStudies = [];
let bookmarks = [];
let currentCategory = 'Semua';
let currentDifficulty = 'Semua';
let searchQuery = '';
let currentSort = 'newest';
let showOnlyBookmarks = false;
let editingId = null;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    initTheme();
    loadData();
    setupEventListeners();
    renderApp();
}

/**
 * Theme Manager
 */
function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    setTheme(savedTheme);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = theme === 'dark' ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars-fill text-primary';
    }
}

/**
 * Load and Save Data
 */
function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            caseStudies = JSON.parse(stored);
        } catch (e) {
            console.error("Gagal membaca LocalStorage, memuat data default:", e);
            caseStudies = [...initialCaseStudies];
        }
    } else {
        caseStudies = [...initialCaseStudies];
        saveData();
    }

    const storedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
    if (storedBookmarks) {
        try {
            bookmarks = JSON.parse(storedBookmarks);
        } catch (e) {
            bookmarks = [];
        }
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(caseStudies));
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderCaseStudies();
        });
    }

    // Category filter chips
    const categoryChips = document.querySelectorAll('.category-chip');
    categoryChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            categoryChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentCategory = chip.getAttribute('data-category');
            renderCaseStudies();
        });
    });

    // Difficulty filter dropdown
    const diffFilter = document.getElementById('difficultyFilter');
    if (diffFilter) {
        diffFilter.addEventListener('change', (e) => {
            currentDifficulty = e.target.value;
            renderCaseStudies();
        });
    }

    // Sort select
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderCaseStudies();
        });
    }

    // Bookmarks only toggle
    const bookmarkToggle = document.getElementById('bookmarkFilterBtn');
    if (bookmarkToggle) {
        bookmarkToggle.addEventListener('click', () => {
            showOnlyBookmarks = !showOnlyBookmarks;
            bookmarkToggle.classList.toggle('btn-warning', showOnlyBookmarks);
            bookmarkToggle.classList.toggle('btn-outline-warning', !showOnlyBookmarks);
            renderCaseStudies();
        });
    }

    // Form submission for Add / Edit
    const form = document.getElementById('caseStudyForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Export Data Button
    const exportBtn = document.getElementById('exportDataBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportDataAsJson);
    }

    // Import Data Input
    const importInput = document.getElementById('importJsonInput');
    if (importInput) {
        importInput.addEventListener('change', handleImportJson);
    }

    // Reset Data Button
    const resetBtn = document.getElementById('resetDataBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetToDefaultData);
    }
}

/**
 * Filter & Sort Logic
 */
function getFilteredCaseStudies() {
    return caseStudies.filter(item => {
        // Search Filter
        const matchesSearch = searchQuery === '' || 
            item.title.toLowerCase().includes(searchQuery) ||
            item.summary.toLowerCase().includes(searchQuery) ||
            (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery))) ||
            (item.problemStatement && item.problemStatement.toLowerCase().includes(searchQuery));

        // Category Filter
        const matchesCategory = currentCategory === 'Semua' || item.category === currentCategory;

        // Difficulty Filter
        const matchesDifficulty = currentDifficulty === 'Semua' || item.difficulty === currentDifficulty;

        // Bookmark Filter
        const matchesBookmark = !showOnlyBookmarks || bookmarks.includes(item.id);

        return matchesSearch && matchesCategory && matchesDifficulty && matchesBookmark;
    }).sort((a, b) => {
        if (currentSort === 'newest') {
            return new Date(b.date || 0) - new Date(a.date || 0);
        } else if (currentSort === 'oldest') {
            return new Date(a.date || 0) - new Date(b.date || 0);
        } else if (currentSort === 'title-asc') {
            return a.title.localeCompare(b.title);
        } else if (currentSort === 'title-desc') {
            return b.title.localeCompare(a.title);
        }
        return 0;
    });
}

/**
 * Render Main UI
 */
function renderApp() {
    renderStats();
    renderCaseStudies();
}

function renderStats() {
    const totalCountEl = document.getElementById('statTotalCount');
    const totalCategoriesEl = document.getElementById('statTotalCategories');
    const totalBookmarksEl = document.getElementById('statTotalBookmarks');

    if (totalCountEl) totalCountEl.textContent = caseStudies.length;
    
    if (totalCategoriesEl) {
        const uniqueCats = new Set(caseStudies.map(c => c.category));
        totalCategoriesEl.textContent = uniqueCats.size;
    }

    if (totalBookmarksEl) {
        totalBookmarksEl.textContent = bookmarks.length;
    }
}

function renderCaseStudies() {
    const container = document.getElementById('caseStudiesGrid');
    const emptyState = document.getElementById('emptyState');
    const resultCountBadge = document.getElementById('resultCountBadge');

    if (!container) return;

    const filtered = getFilteredCaseStudies();

    if (resultCountBadge) {
        resultCountBadge.textContent = `${filtered.length} Studi Kasus`;
    }

    if (filtered.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('d-none');
        return;
    }

    if (emptyState) emptyState.classList.add('d-none');

    container.innerHTML = filtered.map(item => {
        const isBookmarked = bookmarks.includes(item.id);
        const diffClass = `badge-diff-${(item.difficulty || 'mudah').toLowerCase()}`;
        
        const tagsHtml = (item.tags || []).slice(0, 3).map(tag => 
            `<span class="tag-pill"><i class="bi bi-tag-fill me-1 opacity-50"></i>${escapeHtml(tag)}</span>`
        ).join('');

        return `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="case-card">
                <div class="case-card-header">
                    <span class="badge-category">${escapeHtml(item.category)}</span>
                    <div class="d-flex align-items-center gap-2">
                        <span class="${diffClass}">${escapeHtml(item.difficulty)}</span>
                        <button class="btn btn-sm btn-link text-warning p-0" onclick="toggleBookmark('${item.id}')" title="Bookmark">
                            <i class="bi ${isBookmarked ? 'bi-star-fill' : 'bi-star'} fs-5"></i>
                        </button>
                    </div>
                </div>
                <div class="case-card-body">
                    <h5 class="case-title" role="button" onclick="viewDetail('${item.id}')">${escapeHtml(item.title)}</h5>
                    <p class="case-summary">${escapeHtml(item.summary || '')}</p>
                    <div class="mt-2">
                        ${tagsHtml}
                    </div>
                </div>
                <div class="case-card-footer">
                    <div class="small text-muted">
                        <i class="bi bi-clock me-1"></i>${item.timeComplexity || 'O(n)'}
                    </div>
                    <button class="btn btn-sm btn-primary rounded-pill px-3" onclick="viewDetail('${item.id}')">
                        <i class="bi bi-code-slash me-1"></i> Buka Solusi
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

/**
 * View Case Study Detail Modal
 */
function viewDetail(id) {
    const item = caseStudies.find(c => c.id === id);
    if (!item) return;

    const modalTitle = document.getElementById('detailModalTitle');
    const modalCategory = document.getElementById('detailModalCategory');
    const modalDifficulty = document.getElementById('detailModalDifficulty');
    const modalTime = document.getElementById('detailModalTime');
    const modalSpace = document.getElementById('detailModalSpace');
    const modalTags = document.getElementById('detailModalTags');
    const modalProblem = document.getElementById('detailModalProblem');
    const modalInput = document.getElementById('detailModalInput');
    const modalOutput = document.getElementById('detailModalOutput');
    const modalCode = document.getElementById('detailModalCode');
    const modalExplanation = document.getElementById('detailModalExplanation');
    const modalDate = document.getElementById('detailModalDate');

    if (modalTitle) modalTitle.textContent = item.title;
    if (modalCategory) modalCategory.textContent = item.category;
    
    if (modalDifficulty) {
        modalDifficulty.textContent = item.difficulty;
        modalDifficulty.className = `badge-diff-${(item.difficulty || 'mudah').toLowerCase()}`;
    }

    if (modalTime) modalTime.textContent = item.timeComplexity || 'O(n)';
    if (modalSpace) modalSpace.textContent = item.spaceComplexity || 'O(1)';
    if (modalDate) modalDate.textContent = item.date ? `Diperbarui: ${item.date}` : '';

    if (modalTags) {
        modalTags.innerHTML = (item.tags || []).map(t => `<span class="tag-pill"><i class="bi bi-tag-fill me-1 opacity-50"></i>${escapeHtml(t)}</span>`).join('');
    }

    if (modalProblem) modalProblem.innerHTML = formatTextToHtml(item.problemStatement || item.summary);
    if (modalInput) modalInput.textContent = item.inputExample || 'Tidak ada input khusus.';
    if (modalOutput) modalOutput.textContent = item.outputExample || 'Tidak ada simulasi output.';

    if (modalCode) {
        modalCode.textContent = item.code;
        // Re-run Prism highlighting
        if (window.Prism) {
            Prism.highlightElement(modalCode);
        }
    }

    if (modalExplanation) {
        modalExplanation.innerHTML = formatTextToHtml(item.explanation || 'Belum ada penjelasan tambahan.');
    }

    // Set Actions
    const editBtn = document.getElementById('detailEditBtn');
    const deleteBtn = document.getElementById('detailDeleteBtn');
    const copyBtn = document.getElementById('detailCopyBtn');

    if (editBtn) {
        editBtn.onclick = () => {
            const detailModal = bootstrap.Modal.getInstance(document.getElementById('detailModal'));
            if (detailModal) detailModal.hide();
            openEditModal(item.id);
        };
    }

    if (deleteBtn) {
        deleteBtn.onclick = () => {
            if (confirm(`Yakin ingin menghapus studi kasus "${item.title}"?`)) {
                deleteCaseStudy(item.id);
                const detailModal = bootstrap.Modal.getInstance(document.getElementById('detailModal'));
                if (detailModal) detailModal.hide();
            }
        };
    }

    if (copyBtn) {
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(item.code).then(() => {
                showToast("Kode C++ berhasil disalin ke clipboard!", "success");
            }).catch(err => {
                showToast("Gagal menyalin kode.", "danger");
            });
        };
    }

    const modal = new bootstrap.Modal(document.getElementById('detailModal'));
    modal.show();
}

/**
 * Add / Edit Modal Handlers
 */
function openAddModal() {
    editingId = null;
    const form = document.getElementById('caseStudyForm');
    if (form) form.reset();

    const titleEl = document.getElementById('formModalTitle');
    if (titleEl) titleEl.textContent = "Tambah Studi Kasus Baru";

    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    modal.show();
}

function openEditModal(id) {
    const item = caseStudies.find(c => c.id === id);
    if (!item) return;

    editingId = id;

    const titleEl = document.getElementById('formModalTitle');
    if (titleEl) titleEl.textContent = "Edit Studi Kasus";

    document.getElementById('formTitle').value = item.title || '';
    document.getElementById('formCategory').value = item.category || 'Dasar C++';
    document.getElementById('formDifficulty').value = item.difficulty || 'Mudah';
    document.getElementById('formTimeComplexity').value = item.timeComplexity || '';
    document.getElementById('formSpaceComplexity').value = item.spaceComplexity || '';
    document.getElementById('formTags').value = (item.tags || []).join(', ');
    document.getElementById('formSummary').value = item.summary || '';
    document.getElementById('formProblem').value = item.problemStatement || '';
    document.getElementById('formInput').value = item.inputExample || '';
    document.getElementById('formOutput').value = item.outputExample || '';
    document.getElementById('formCode').value = item.code || '';
    document.getElementById('formExplanation').value = item.explanation || '';

    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    modal.show();
}

function handleFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('formTitle').value.trim();
    const category = document.getElementById('formCategory').value;
    const difficulty = document.getElementById('formDifficulty').value;
    const timeComplexity = document.getElementById('formTimeComplexity').value.trim() || 'O(n)';
    const spaceComplexity = document.getElementById('formSpaceComplexity').value.trim() || 'O(1)';
    const tagsInput = document.getElementById('formTags').value;
    const summary = document.getElementById('formSummary').value.trim();
    const problemStatement = document.getElementById('formProblem').value.trim();
    const inputExample = document.getElementById('formInput').value.trim();
    const outputExample = document.getElementById('formOutput').value.trim();
    const code = document.getElementById('formCode').value.trim();
    const explanation = document.getElementById('formExplanation').value.trim();

    if (!title || !code) {
        showToast("Judul dan Source Code C++ wajib diisi!", "warning");
        return;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const currentDate = new Date().toISOString().split('T')[0];

    if (editingId) {
        // Edit existing
        const index = caseStudies.findIndex(c => c.id === editingId);
        if (index !== -1) {
            caseStudies[index] = {
                ...caseStudies[index],
                title,
                category,
                difficulty,
                timeComplexity,
                spaceComplexity,
                tags,
                summary,
                problemStatement,
                inputExample,
                outputExample,
                code,
                explanation,
                date: currentDate
            };
            showToast("Studi kasus berhasil diperbarui!", "success");
        }
    } else {
        // Create new
        const newCase = {
            id: "cs-" + Date.now(),
            title,
            category,
            difficulty,
            timeComplexity,
            spaceComplexity,
            tags,
            summary,
            problemStatement,
            inputExample,
            outputExample,
            code,
            explanation,
            date: currentDate
        };
        caseStudies.unshift(newCase);
        showToast("Studi kasus baru berhasil ditambahkan!", "success");
    }

    saveData();
    renderApp();

    const modal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
    if (modal) modal.hide();
}

/**
 * Delete Case Study
 */
function deleteCaseStudy(id) {
    caseStudies = caseStudies.filter(c => c.id !== id);
    bookmarks = bookmarks.filter(bId => bId !== id);
    saveData();
    renderApp();
    showToast("Studi kasus berhasil dihapus!", "info");
}

/**
 * Toggle Bookmark
 */
function toggleBookmark(id) {
    if (bookmarks.includes(id)) {
        bookmarks = bookmarks.filter(bId => bId !== id);
        showToast("Dihapus dari favorit.", "secondary");
    } else {
        bookmarks.push(id);
        showToast("Disimpan ke favorit!", "warning");
    }
    saveData();
    renderApp();
}

/**
 * Export / Import / Reset Data
 */
function exportDataAsJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(caseStudies, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `uts_alpro_case_studies_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Data studi kasus berhasil diexport ke JSON!", "success");
}

function handleImportJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData) && importedData.length > 0) {
                caseStudies = importedData;
                saveData();
                renderApp();
                showToast(`Berhasil mengimpor ${importedData.length} studi kasus!`, "success");
            } else {
                showToast("Format file JSON tidak sesuai!", "danger");
            }
        } catch (err) {
            showToast("Gagal membaca file JSON!", "danger");
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function resetToDefaultData() {
    if (confirm("Apakah Anda yakin ingin mengembalikan semua data studi kasus ke data bawaan (default)? Perubahan Anda akan ditimpa.")) {
        caseStudies = [...initialCaseStudies];
        bookmarks = [];
        saveData();
        renderApp();
        showToast("Data berhasil direset ke pengaturan awal.", "info");
    }
}

/**
 * Toast Notifications
 */
function showToast(message, type = 'primary') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toastId = 'toast-' + Date.now();
    const iconMap = {
        success: 'bi-check-circle-fill text-success',
        danger: 'bi-exclamation-triangle-fill text-danger',
        warning: 'bi-exclamation-circle-fill text-warning',
        info: 'bi-info-circle-fill text-info',
        secondary: 'bi-bell-fill text-secondary',
        primary: 'bi-info-circle-fill text-primary'
    };

    const icon = iconMap[type] || 'bi-info-circle-fill text-primary';

    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center gap-2">
                    <i class="bi ${icon} fs-5"></i>
                    <span>${escapeHtml(message)}</span>
                </div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 3500 });
    bsToast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}

/**
 * Helpers
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

function formatTextToHtml(text) {
    if (!text) return '';
    let formatted = escapeHtml(text);
    // Convert markdown bold **text** to <strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert code backticks `code` to <code>
    formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
    // Convert newlines to paragraphs / breaks
    formatted = formatted.split('\n\n').map(p => `<p class="mb-2">${p.replace(/\n/g, '<br>')}</p>`).join('');
    return formatted;
}
