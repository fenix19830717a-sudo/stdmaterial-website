# STD Material Website - i18n Implementation Guide

## Overview
This document describes the internationalization (i18n) implementation for the STD Material website, supporting English (default) and Chinese languages.

## File Structure

### 1. Language Files (`/assets/i18n/`)
- `en.json` - English translations (default)
- `zh.json` - Chinese translations

### 2. Core i18n Module
- `/assets/js/i18n.js` - Main i18n logic

## How It Works

### Language Detection & Storage
1. **Default Language**: English (`en`)
2. **Detection Order**:
   - Check `localStorage` for saved preference (`std-language-preference`)
   - Detect from browser settings (`navigator.language`)
   - Fall back to English
3. **Storage**: User preference saved to `localStorage`

### Language Switching
- Click EN/中文 buttons in the top navigation bar
- Switching updates page content without full page reload
- Current page state is preserved

### Translation System
```javascript
// Usage in HTML
data-i18n="nav.home"           // Translates text content
data-i18n="nav.login" data-i18n-attr="placeholder"  // Translates attribute

// Usage in JavaScript
I18n.t('nav.home');             // Get translation
I18n.switchLanguage('zh');      // Switch language
```

## Adding New Translations

### 1. Add to JSON files
Edit both `/assets/i18n/en.json` and `/assets/i18n/zh.json`:

```json
{
  "newSection": {
    "newKey": "Translation Value"
  }
}
```

### 2. Use in HTML
```html
<span data-i18n="newSection.newKey">Default Text</span>
```

### 3. Use in JavaScript
```javascript
const text = I18n.t('newSection.newKey', 'Fallback');
```

## Product Data i18n

Each product in `/data/products.json` now includes:
- `name` - Chinese name (original)
- `nameEn` - English name
- `description` - Chinese description (original)
- `descriptionEn` - English description

## Files Modified

### Core i18n Files (New)
- `/assets/i18n/en.json` - English translations
- `/assets/i18n/zh.json` - Chinese translations
- `/assets/js/i18n.js` - i18n module

### HTML Files Updated
- `index.html` - Added language switcher, data-i18n attributes
- `about.html` - Updated with i18n support
- `contact.html` - Updated with i18n support
- `product-catalog.html` - Updated with i18n support
- `product-detail.html` - Updated with i18n support
- `news.html` - Updated with i18n support
- `case-studies.html` - Updated with i18n support
- `selection.html` - Updated with i18n support
- `simulator.html` - Updated with i18n support
- `login.html` - Updated with i18n support
- `account.html` - Updated with i18n support

### Data Files Updated
- `/data/products.json` - Added `nameEn` and `descriptionEn` fields

## Language Switcher Component

The language switcher is a fixed UI component in the top navigation:

```html
<div class="lang-switcher">
    <button data-lang="en" class="active">EN</button>
    <button data-lang="zh">中文</button>
</div>
```

**CSS Class**: `.lang-switcher`
- Rounded pill design
- Active language highlighted
- Smooth hover transitions

## Testing

1. **Default Load**: Open site - should display in English
2. **Language Switch**: Click "中文" - should switch to Chinese
3. **Persistence**: Refresh page - should remember selected language
4. **Product Data**: Check product listings display correct language

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6 support
- Uses localStorage for persistence

## Future Enhancements

### Adding New Languages
1. Create new JSON file: `/assets/i18n/[lang-code].json`
2. Add to `supportedLangs` array in `i18n.js`
3. Add button to language switcher

### Dynamic Content
For dynamically loaded content (AJAX), call:
```javascript
I18n.applyTranslations();
```

## Maintenance Notes

- Keep JSON files synchronized (same keys in all languages)
- Use dot notation for nested keys (e.g., "nav.home")
- HTML `data-i18n` attributes should match JSON keys exactly
- Product names/descriptions should be updated in both languages

## Support

For technical issues with i18n implementation, contact the development team.

---
Last Updated: 2026-03-05
Implementation: CTO Subagent
