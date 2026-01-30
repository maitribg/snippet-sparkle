// ===========================
// State Management
// ===========================
let snippets = [];
let editingSnippetId = null;
let copyingSnippet = null;
let isDarkMode = false;
let sortableInstance = null;

// ===========================
// DOM Elements
// ===========================
const addSnippetBtn = document.getElementById('addSnippetBtn');
const snippetModal = document.getElementById('snippetModal');
const copyModal = document.getElementById('copyModal');
const closeModal = document.getElementById('closeModal');
const cancelModal = document.getElementById('cancelModal');
const closeCopyModal = document.getElementById('closeCopyModal');
const cancelCopyModal = document.getElementById('cancelCopyModal');
const snippetForm = document.getElementById('snippetForm');
const copyForm = document.getElementById('copyForm');
const snippetsContainer = document.getElementById('snippetsContainer');
const emptyState = document.getElementById('emptyState');
const modalTitle = document.getElementById('modalTitle');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');

// ===========================
// Initialize App
// ===========================
function init() {
    console.log('🌟 Snippet Sparkle initializing...');
    
    // Test localStorage availability
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        console.log('✅ localStorage is available');
    } catch (err) {
        console.error('❌ localStorage is NOT available:', err);
        showToast('⚠️ Storage disabled - snippets won\'t persist!');
    }
    
    loadSnippets();
    loadTheme();
    renderSnippets();
    initSortable();
    attachEventListeners();
    
    console.log('🎀 Snippet Sparkle ready!');
}

// ===========================
// Local Storage
// ===========================
function loadSnippets() {
    try {
        const stored = localStorage.getItem('snippetSparkleData');
        snippets = stored ? JSON.parse(stored) : [];
        console.log('✅ Loaded snippets:', snippets.length);
    } catch (err) {
        console.error('❌ Error loading snippets:', err);
        snippets = [];
    }
}

function saveSnippets() {
    try {
        localStorage.setItem('snippetSparkleData', JSON.stringify(snippets));
        console.log('💾 Saved snippets:', snippets.length);
    } catch (err) {
        console.error('❌ Error saving snippets:', err);
        showToast('⚠️ Failed to save snippet!');
    }
}

function loadTheme() {
    try {
        const stored = localStorage.getItem('snippetSparkleTheme');
        isDarkMode = stored === 'dark';
        applyTheme();
    } catch (err) {
        console.error('❌ Error loading theme:', err);
    }
}

function saveTheme() {
    try {
        localStorage.setItem('snippetSparkleTheme', isDarkMode ? 'dark' : 'light');
    } catch (err) {
        console.error('❌ Error saving theme:', err);
    }
}

function applyTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        themeIcon.textContent = '🌙';
    }
}

// ===========================
// Event Listeners
// ===========================
function attachEventListeners() {
    // Add snippet button
    addSnippetBtn.addEventListener('click', openAddModal);
    
    // Add snippet triggers in empty state
    document.querySelectorAll('.add-snippet-trigger').forEach(btn => {
        btn.addEventListener('click', openAddModal);
    });
    
    // Modal close buttons
    closeModal.addEventListener('click', closeSnippetModal);
    cancelModal.addEventListener('click', closeSnippetModal);
    closeCopyModal.addEventListener('click', closeCopyModalFn);
    cancelCopyModal.addEventListener('click', closeCopyModalFn);
    
    // Click outside modal to close
    snippetModal.addEventListener('click', (e) => {
        if (e.target === snippetModal) closeSnippetModal();
    });
    copyModal.addEventListener('click', (e) => {
        if (e.target === copyModal) closeCopyModalFn();
    });
    
    // Forms
    snippetForm.addEventListener('submit', handleSnippetSubmit);
    copyForm.addEventListener('submit', handleCopySubmit);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Import/Export
    exportBtn.addEventListener('click', exportSnippets);
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', importSnippets);
}

// ===========================
// Render Functions
// ===========================
function renderSnippets() {
    if (snippets.length === 0) {
        emptyState.classList.remove('hidden');
        snippetsContainer.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        snippetsContainer.classList.remove('hidden');
        
        snippetsContainer.innerHTML = snippets.map(snippet => `
            <div class="snippet-card" data-id="${snippet.id}">
                <h3>${escapeHtml(snippet.title)}</h3>
                <p class="message-preview">${escapeHtml(snippet.message)}</p>
                <div class="card-actions">
                    <button class="card-btn copy-btn" onclick="openCopyModal('${snippet.id}')" title="Copy snippet">
                        📋 Copy
                    </button>
                    <button class="card-btn edit-btn" onclick="openEditModal('${snippet.id}')" title="Edit snippet">
                        ✏️ Edit
                    </button>
                    <button class="card-btn delete-btn" onclick="deleteSnippet('${snippet.id}')" title="Delete snippet">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        // Reinitialize sortable after rendering
        initSortable();
    }
}

// ===========================
// Modal Functions
// ===========================
function openAddModal() {
    editingSnippetId = null;
    modalTitle.textContent = 'Add Snippet';
    document.getElementById('snippetTitle').value = '';
    document.getElementById('snippetMessage').value = '';
    snippetModal.classList.remove('hidden');
}

function openEditModal(id) {
    editingSnippetId = id;
    const snippet = snippets.find(s => s.id === id);
    if (snippet) {
        modalTitle.textContent = 'Edit Snippet';
        document.getElementById('snippetTitle').value = snippet.title;
        document.getElementById('snippetMessage').value = snippet.message;
        snippetModal.classList.remove('hidden');
    }
}

function closeSnippetModal() {
    snippetModal.classList.add('hidden');
    editingSnippetId = null;
}

function openCopyModal(id) {
    copyingSnippet = snippets.find(s => s.id === id);
    if (copyingSnippet) {
        document.getElementById('copyName').value = '';
        document.getElementById('copyCompany').value = '';
        document.getElementById('copyRole').value = '';
        copyModal.classList.remove('hidden');
    }
}

function closeCopyModalFn() {
    copyModal.classList.add('hidden');
    copyingSnippet = null;
}

// ===========================
// CRUD Operations
// ===========================
function handleSnippetSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('snippetTitle').value.trim();
    const message = document.getElementById('snippetMessage').value.trim();
    
    if (!title || !message) return;
    
    if (editingSnippetId) {
        // Edit existing snippet
        const snippet = snippets.find(s => s.id === editingSnippetId);
        if (snippet) {
            snippet.title = title;
            snippet.message = message;
            snippet.updatedAt = new Date().toISOString();
        }
        showToast('✨ Snippet updated!');
    } else {
        // Create new snippet
        const newSnippet = {
            id: generateId(),
            title,
            message,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        snippets.push(newSnippet);
        showToast('✨ Snippet created!');
    }
    
    saveSnippets();
    renderSnippets();
    closeSnippetModal();
}

function deleteSnippet(id) {
    if (confirm('Are you sure you want to delete this snippet? 🗑️')) {
        snippets = snippets.filter(s => s.id !== id);
        saveSnippets();
        renderSnippets();
        showToast('🗑️ Snippet deleted!');
    }
}

// ===========================
// Copy with Placeholder Replacement
// ===========================
function handleCopySubmit(e) {
    e.preventDefault();
    
    if (!copyingSnippet) return;
    
    const name = document.getElementById('copyName').value.trim();
    const company = document.getElementById('copyCompany').value.trim();
    const role = document.getElementById('copyRole').value.trim();
    
    let message = copyingSnippet.message;
    
    // Replace placeholders (case-insensitive for flexibility)
    if (name) {
        message = message.replace(/\[NAME\]/gi, name);
    }
    if (company) {
        message = message.replace(/\[COMPANY\]/gi, company);
    }
    if (role) {
        message = message.replace(/\[ROLE\]/gi, role);
    }
    
    // Copy to clipboard
    copyToClipboard(message);
    closeCopyModalFn();
    showToast('✨ Snippet copied to clipboard!');
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textarea);
}

// ===========================
// Drag and Drop with Sortable.js
// ===========================
function initSortable() {
    // Destroy existing instance if it exists
    if (sortableInstance) {
        sortableInstance.destroy();
        sortableInstance = null;
    }
    
    if (snippets.length === 0) return;
    
    sortableInstance = Sortable.create(snippetsContainer, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function(evt) {
            // Reorder snippets array
            const movedSnippet = snippets.splice(evt.oldIndex, 1)[0];
            snippets.splice(evt.newIndex, 0, movedSnippet);
            saveSnippets();
            showToast('✨ Order saved!');
        }
    });
}

// ===========================
// Theme Toggle
// ===========================
function toggleTheme() {
    isDarkMode = !isDarkMode;
    applyTheme();
    saveTheme();
    showToast(isDarkMode ? '🌙 Dark mode enabled!' : '☀️ Light mode enabled!');
}

// ===========================
// Import/Export
// ===========================
function exportSnippets() {
    if (snippets.length === 0) {
        showToast('⚠️ No snippets to export!');
        return;
    }
    
    const dataStr = JSON.stringify(snippets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `snippet-sparkle-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('📤 Snippets exported!');
}

function importSnippets(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const imported = JSON.parse(event.target.result);
            
            if (!Array.isArray(imported)) {
                showToast('⚠️ Invalid file format!');
                return;
            }
            
            // Validate and merge
            const validSnippets = imported.filter(s => 
                s.id && s.title && s.message
            );
            
            if (validSnippets.length === 0) {
                showToast('⚠️ No valid snippets found!');
                return;
            }
            
            // Merge with existing (avoid duplicates by ID)
            const existingIds = new Set(snippets.map(s => s.id));
            const newSnippets = validSnippets.filter(s => !existingIds.has(s.id));
            
            snippets = [...snippets, ...newSnippets];
            saveSnippets();
            renderSnippets();
            showToast(`📥 Imported ${newSnippets.length} snippets!`);
        } catch (err) {
            console.error('Import error:', err);
            showToast('⚠️ Failed to import file!');
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
}

// ===========================
// Toast Notification
// ===========================
function showToast(message, duration = 3000) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
}

// ===========================
// Utilities
// ===========================
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===========================
// Initialize on Load
// ===========================
document.addEventListener('DOMContentLoaded', init);
