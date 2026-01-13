# 🗓️ Lejáratkezelő - Expiration Tracker

Modern, prémium webalkalmazás termékek lejárati idejének nyomon követésére.

## ✨ Funkciók

- 🔐 **Bejelentkezés és regisztráció** - Saját fiók létrehozása
- 📸 **Vonalkód szkennelés** - Kamerával történő termék azonosítás
- 📦 **Batch tracking** - Több lejárati dátum ugyanahhoz a termékhez
- 🎨 **Prémium design** - Glassmorphism, animációk, gradientek
- 📊 **Intelligens dashboard** - Vizuális statisztikák és riasztások
- 🏷️ **Kategóriák** - Élelmiszer, Gyógyszer, Kozmetikum, stb.

## 🚀 Telepítés

```bash
# Függőségek telepítése
npm install

# Fejlesztői szerver indítása
npm run dev

# Build production-re
npm run build
```

## 🌐 Deployment

### Vercel (Ajánlott)
1. Regisztrálj a [vercel.com](https://vercel.com) oldalon
2. Importáld ezt a GitHub repository-t
3. Kattints a "Deploy" gombra
4. Kész! 🎉

### Netlify
1. Regisztrálj a [netlify.com](https://netlify.com) oldalon
2. "New site from Git" → Válaszd ki ezt a repo-t
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy! 🚀

## 📱 PWA Support

Az alkalmazás Progressive Web App, így telepíthető mobilra:
- Nyisd meg böngészőben
- Kattints a "Telepítés" gombra
- Használd mint natív appot!

## 🛠️ Technológiák

- **React** - UI framework
- **Vite** - Build tool
- **html5-qrcode** - Barcode scanner
- **Open Food Facts API** - Termék adatbázis
- **LocalStorage** - Adattárolás

## 📄 Licenc

MIT License - Használd szabadon! ❤️
