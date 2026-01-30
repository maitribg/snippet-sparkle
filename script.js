// ===========================
// State Management
// ===========================
let snippets = [];
let editingSnippetId = null;
let copyingSnippet = null;
let isDarkMode = false;
let sortableInstance = null;
let currentUser = null;
let unsubscribeSnapshot = null;

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
const authBtn = document.getElementById('authBtn');
const authBtnText = document.getElementById('authBtnText');
const userProfile = document.getElementById('userProfile');
const userPhoto = document.getElementById('userPhoto');
const userName = document.getElementById('userName');

// ===========================
// Auto-load Sample Data
// ===========================
async function loadSampleData() {
    try {
        console.log('📦 Loading sample data...');
        const response = await fetch('snippets-data.json');
        
        if (!response.ok) {
            console.warn('⚠️ Sample data file not found');
            return;
        }
        
        const data = await response.json();
        
        // Support both formats
        let sampleSnippets = [];
        if (Array.isArray(data)) {
            sampleSnippets = data;
        } else if (data && Array.isArray(data.snippets)) {
            sampleSnippets = data.snippets;
        }
        
        if (sampleSnippets.length > 0) {
            snippets = sampleSnippets;
            saveSnippets();
            console.log(`✅ Loaded ${sampleSnippets.length} sample snippets!`);
            showToast(`✨ Welcome! Loaded ${sampleSnippets.length} sample snippets!`);
        }
    } catch (err) {
        console.warn('⚠️ Could not load sample data:', err);
        // Fail silently - user can add their own snippets
    }
}

// ===========================
// Initialize App
// ===========================
async function init() {
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
    
    // Initialize Firebase if configured
    if (typeof initializeFirebase === 'function') {
        initializeFirebase();
    }
    
    // Set up auth state listener
    if (isFirebaseConfigured && auth) {
        auth.onAuthStateChanged(handleAuthStateChange);
    } else {
        console.log('📱 Running in localStorage-only mode');
        
        // Load snippets from localStorage
        loadSnippets();
        
        // Auto-load sample data on first visit
        if (snippets.length === 0) {
            await loadSampleData();
        }
        
        renderSnippets();
    }
    
    loadTheme();
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
// Firebase Authentication
// ===========================
function handleAuthStateChange(user) {
    currentUser = user;
    
    if (user) {
        // User is signed in
        console.log('✅ User signed in:', user.email);
        updateAuthUI(true);
        
        // Show user info
        userName.textContent = user.displayName || user.email;
        userPhoto.src = user.photoURL || 'https://via.placeholder.com/40';
        
        // Load snippets from Firestore
        loadSnippetsFromFirestore();
    } else {
        // User is signed out
        console.log('👋 User signed out');
        updateAuthUI(false);
        
        // Unsubscribe from Firestore listener
        if (unsubscribeSnapshot) {
            unsubscribeSnapshot();
            unsubscribeSnapshot = null;
        }
        
        // Load from localStorage as fallback
        loadSnippets();
        renderSnippets();
    }
}

function updateAuthUI(isSignedIn) {
    if (isSignedIn) {
        authBtnText.textContent = '🚪 Sign Out';
        userProfile.classList.remove('hidden');
        userProfile.classList.add('flex');
    } else {
        authBtnText.textContent = '🔐 Sign In';
        userProfile.classList.add('hidden');
        userProfile.classList.remove('flex');
    }
}

async function handleAuth() {
    if (!isFirebaseConfigured) {
        showToast('⚠️ Firebase not configured. Using localStorage only.');
        return;
    }
    
    if (currentUser) {
        // Sign out
        try {
            await auth.signOut();
            showToast('👋 Signed out successfully!');
        } catch (error) {
            console.error('Sign out error:', error);
            showToast('❌ Sign out failed!');
        }
    } else {
        // Sign in with Google
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await auth.signInWithPopup(provider);
            showToast('✨ Welcome! Your snippets will sync across devices!');
        } catch (error) {
            console.error('Sign in error:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                showToast('⚠️ Sign in cancelled');
            } else {
                showToast('❌ Sign in failed!');
            }
        }
    }
}

// ===========================
// Firestore Operations
// ===========================
function loadSnippetsFromFirestore() {
    if (!currentUser || !db) return;
    
    const snippetsRef = db.collection('users').doc(currentUser.uid).collection('snippets');
    
    // Real-time listener
    unsubscribeSnapshot = snippetsRef.orderBy('order').onSnapshot((snapshot) => {
        snippets = [];
        snapshot.forEach((doc) => {
            snippets.push({ id: doc.id, ...doc.data() });
        });
        
        console.log('📥 Loaded', snippets.length, 'snippets from Firestore');
        renderSnippets();
        
        // Backup to localStorage
        saveSnippets();
    }, (error) => {
        console.error('Firestore error:', error);
        showToast('⚠️ Sync error. Using local data.');
        loadSnippets();
        renderSnippets();
    });
}

async function saveSnippetToFirestore(snippet) {
    if (!currentUser || !db) {
        return false;
    }
    
    try {
        const snippetsRef = db.collection('users').doc(currentUser.uid).collection('snippets');
        
        if (snippet.id) {
            // Update existing
            await snippetsRef.doc(snippet.id).set(snippet, { merge: true });
        } else {
            // Create new
            const docRef = await snippetsRef.add(snippet);
            snippet.id = docRef.id;
        }
        
        console.log('💾 Saved to Firestore:', snippet.id);
        return true;
    } catch (error) {
        console.error('Firestore save error:', error);
        showToast('⚠️ Cloud sync failed. Saved locally.');
        return false;
    }
}

async function deleteSnippetFromFirestore(snippetId) {
    if (!currentUser || !db) {
        return false;
    }
    
    try {
        await db.collection('users').doc(currentUser.uid).collection('snippets').doc(snippetId).delete();
        console.log('🗑️ Deleted from Firestore:', snippetId);
        return true;
    } catch (error) {
        console.error('Firestore delete error:', error);
        return false;
    }
}

async function updateSnippetOrderInFirestore() {
    if (!currentUser || !db) {
        return;
    }
    
    try {
        const batch = db.batch();
        const snippetsRef = db.collection('users').doc(currentUser.uid).collection('snippets');
        
        snippets.forEach((snippet, index) => {
            const docRef = snippetsRef.doc(snippet.id);
            batch.update(docRef, { order: index });
        });
        
        await batch.commit();
        console.log('✨ Updated snippet order in Firestore');
    } catch (error) {
        console.error('Firestore order update error:', error);
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
    
    // Auth button
    authBtn.addEventListener('click', handleAuth);
    
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
async function handleSnippetSubmit(e) {
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
            
            // Save to Firestore if logged in
            if (currentUser) {
                await saveSnippetToFirestore(snippet);
            }
        }
        showToast('✨ Snippet updated!');
    } else {
        // Create new snippet
        const newSnippet = {
            id: generateId(),
            title,
            message,
            order: snippets.length,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Save to Firestore if logged in
        if (currentUser) {
            await saveSnippetToFirestore(newSnippet);
        } else {
            // Add locally if not logged in
            snippets.push(newSnippet);
        }
        
        showToast('✨ Snippet created!');
    }
    
    // Save to localStorage as backup
    saveSnippets();
    
    // Re-render if not using real-time listener
    if (!currentUser) {
        renderSnippets();
    }
    
    closeSnippetModal();
}

async function deleteSnippet(id) {
    if (confirm('Are you sure you want to delete this snippet? 🗑️')) {
        // Delete from Firestore if logged in
        if (currentUser) {
            await deleteSnippetFromFirestore(id);
        } else {
            // Delete locally if not logged in
            snippets = snippets.filter(s => s.id !== id);
            saveSnippets();
            renderSnippets();
        }
        
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
        onEnd: async function(evt) {
            // Reorder snippets array
            const movedSnippet = snippets.splice(evt.oldIndex, 1)[0];
            snippets.splice(evt.newIndex, 0, movedSnippet);
            
            // Update order in Firestore if logged in
            if (currentUser) {
                await updateSnippetOrderInFirestore();
            }
            
            // Always save to localStorage as backup
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

async function importSnippets(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async function(event) {
        try {
            const imported = JSON.parse(event.target.result);
            
            // Support multiple formats:
            // 1. Direct array: [{ id, title, message }, ...]
            // 2. Object with snippets property: { snippets: [...] }
            let importedSnippets = [];
            
            if (Array.isArray(imported)) {
                importedSnippets = imported;
            } else if (imported && Array.isArray(imported.snippets)) {
                importedSnippets = imported.snippets;
            } else {
                showToast('⚠️ Invalid file format!');
                return;
            }
            
            // Validate snippets
            const validSnippets = importedSnippets.filter(s => 
                s.id && s.title && s.message
            );
            
            if (validSnippets.length === 0) {
                showToast('⚠️ No valid snippets found!');
                return;
            }
            
            // Merge with existing (avoid duplicates by ID)
            const existingIds = new Set(snippets.map(s => s.id));
            const newSnippets = validSnippets.filter(s => !existingIds.has(s.id));
            
            if (newSnippets.length === 0) {
                showToast('⚠️ All snippets already exist!');
                return;
            }
            
            // Add new snippets
            snippets = [...snippets, ...newSnippets];
            
            // Save to localStorage immediately
            saveSnippets();
            
            // If using Firebase, also save there
            if (currentUser && db) {
                for (const snippet of newSnippets) {
                    await saveSnippetToFirestore(snippet);
                }
            }
            
            // Re-render only if not using real-time listener
            if (!currentUser) {
                renderSnippets();
            }
            
            showToast(`✨ Imported ${newSnippets.length} new snippet${newSnippets.length > 1 ? 's' : ''}!`);
        } catch (err) {
            console.error('Import error:', err);
            showToast('❌ Failed to import file! Check the format.');
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
