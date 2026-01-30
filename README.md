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

## 🚀 How to Use

1. **Open `index.html`** in any modern browser
2. **Click "✨ Add Snippet"** to create your first snippet
3. **Use placeholders** like `[NAME]`, `[COMPANY]`, `[ROLE]` in your message
4. **Click "📋 Copy"** on any snippet to fill in the details and copy to clipboard
5. **Drag cards** to reorder them
6. **Export your snippets** to back them up or share with others

## 💾 How Storage Works

**Your snippets are stored in your browser's localStorage:**
- ✅ **Persistent**: Survives page refreshes and browser restarts
- ✅ **Private**: Stored locally on YOUR device only
- ✅ **No server needed**: Works completely offline
- ✅ **Works when deployed**: localStorage works on any website
- ✅ **Per-browser**: Each browser has its own storage

### Why localStorage?
- No backend or database needed
- Fast and instant
- Privacy-focused (your data never leaves your device)
- Free and unlimited for typical usage

### Backup Your Data
Use the **"📤 Export"** button to download your snippets as a JSON file:
- Safe backup in case you clear browser data
- Transfer snippets between computers/browsers
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
