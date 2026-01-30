# # 💖 Snippet Sparkle

A beautiful, responsive web app for managing reusable job application message snippets (LinkedIn DMs, cold emails, follow-ups, etc.)

## ✨ Features

### 🎨 Design
- Barbie-coded pastel palette (pinks, purples, baby blues)
- Smooth gradient background
- Animated hover effects with sparkles
- Light/Dark pastel mode toggle
- Fully responsive for mobile, tablet, and desktop

### 🧰 Functionality
- **Create & Edit** snippets with custom titles and messages
- **Template Placeholders**: Use `[NAME]`, `[COMPANY]`, and `[ROLE]` in your messages
- **Smart Copy**: Fill in placeholder values when copying
- **Drag & Drop**: Reorder snippets with drag-and-drop
- **Import/Export**: Backup and share snippets as JSON files
- **Local Storage**: All snippets persist automatically in your browser

### 📋 Placeholder System
When creating snippets, use these placeholders:
- `[NAME]` - Recipient's name
- `[COMPANY]` - Company name  
- `[ROLE]` - Job role/position

**Example snippet:**
```
Hi [NAME], I saw you're a [ROLE] at [COMPANY]. I'd love to connect and discuss...
```

When you click "Copy", you'll be prompted to fill in these values, and they'll be automatically replaced!

## 🚀 Quick Start

### Option 1: Use Locally (No Setup)

1. **Open `index.html`** in any modern browser
2. **Click "✨ Add Snippet"** to create your first snippet
3. **Use placeholders** like `[NAME]`, `[COMPANY]`, `[ROLE]` in your message
4. **Click "📋 Copy"** on any snippet to fill in the details and copy to clipboard
5. **Drag cards** to reorder them

**Note:** Snippets are stored in your browser's localStorage (device-specific).

### Option 2: Set Up Cloud Sync (Recommended)

Get access to your snippets from **any device** with Firebase:

1. Follow the **[Firebase Setup Guide](FIREBASE_SETUP.md)** (15 minutes)
2. Sign in with Google
3. Your snippets now sync across all devices! ✨

**Benefits of Firebase:**
- 🌍 Access from any device/browser
- 🔄 Real-time sync
- 🔐 Secure Google authentication
- 📱 Works offline
- 👥 Share with others (each user has private snippets)

## 💾 How Storage Works

The app supports **two storage modes**:

### 1. **localStorage Mode** (Default - No Setup)
- ✅ Works immediately, no configuration needed
- ✅ Fast and offline
- ❌ Device/browser specific (can't access from other devices)
- ❌ Lost if you clear browser data

### 2. **Firebase Cloud Mode** (Recommended)
- ✅ **Access from ANY device** (phone, laptop, work computer)
- ✅ **Real-time sync** across all your devices
- ✅ **Never lose data** - stored in the cloud
- ✅ **Offline support** - works without internet, syncs when back online
- ✅ **Secure** - Google authentication, private per user
- 🔧 Requires 15-min setup ([See Setup Guide](FIREBASE_SETUP.md))

### Backup Your Data (Both Modes)
Use the **"📤 Export"** button to download your snippets as a JSON file:
- Safe backup in case of issues
- Transfer snippets between accounts
- Share snippet collections with teammates

## 🛠️ Technical Details

**Built with:**
- HTML5
- TailwindCSS (via CDN)
- Vanilla JavaScript
- Sortable.js for drag-and-drop
- Google Fonts (Pacifico & Quicksand)

**No framework, no build process, no backend!**

## 📱 Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (v88+)
- Firefox (v85+)
- Safari (v14+)

**Note:** If using private/incognito mode, localStorage may be disabled or cleared on exit.

## 🎀 Tips

1. **Create template variations** for different scenarios (cold outreach, follow-ups, thank you notes)
2. **Use all three placeholders** to make messages feel more personalized
3. **Export regularly** to back up your snippets
4. **Reorder snippets** by priority using drag-and-drop
5. **Toggle dark mode** for comfortable nighttime editing

## 📄 License

Free to use and modify for personal or commercial purposes!

---

Made with 💖 and ✨ sparkles
“Snippet Sparkle” that displays customizable message snippets in draggable, reorderable cards. 
