# Design System - Hunan Shengtongda Materials Technology

## Overview
Complete design system for the industrial B2B website, featuring modern industrial aesthetics with dark theme.

## Color System

### Primary Colors
```css
--color-primary: #06b6d4;        /* Cyan - Main brand color */
--color-primary-dark: #0891b2;   /* Darker cyan */
--color-primary-light: #22d3ee;   /* Lighter cyan */
```

### Accent Colors
```css
--color-secondary: #f97316;       /* Orange */
--color-accent: #a855f7;          /* Purple */
```

### Status Colors
```css
--color-success: #22c55e;         /* Green */
--color-warning: #f59e0b;         /* Amber */
--color-error: #ef4444;           /* Red */
--color-info: #3b82f6;            /* Blue */
```

### Neutral Colors
```css
--color-background: #ffffff;
--color-background-dark: #020617; /* Deep navy */
--color-surface: #f8fafc;
--color-surface-dark: #1e293b;    /* Slate 800 */
--color-border: #e2e8f0;
--color-border-dark: rgba(255, 255, 255, 0.1);
```

### Text Colors
```css
--color-text-primary: #0f172a;
--color-text-primary-dark: #f8fafc;
--color-text-secondary: #64748b;
--color-text-secondary-dark: #94a3b8;
--color-text-muted: #94a3b8;
```

## Typography

### Font Family
```css
--font-family-display: 'Space Grotesk', sans-serif;
--font-family-body: 'Space Grotesk', sans-serif;
```

### Font Sizes
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
--font-size-5xl: 3rem;       /* 48px */
```

### Heading Styles
- **H1 (Extra Large)**: 48px, Bold, Line-height 1.1
- **H2 (Large)**: 30px, Semibold, Line-height 1.2
- **H3 (Medium)**: 20px, Semibold, Line-height 1.3

## Spacing System

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;       /* 32px */
--spacing-2xl: 3rem;      /* 48px */
--spacing-3xl: 4rem;      /* 64px */
```

## Border Radius

```css
--border-radius-sm: 0.375rem;   /* 6px */
--border-radius-md: 0.5rem;     /* 8px */
--border-radius-lg: 0.75rem;    /* 12px */
--border-radius-xl: 1rem;        /* 16px */
--border-radius-2xl: 1.5rem;     /* 24px */
--border-radius-full: 9999px;
```

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.3);
--shadow-neon: 0 0 20px rgba(6, 182, 212, 0.3);
```

## Transitions

```css
--transition-fast: 0.15s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.6s ease;
```

## Components

### Product Image Container
**Purpose**: Display product images with white background

```html
<div class="product-image-container">
  <img src="product.jpg" alt="Product" />
</div>
```

### Buttons

#### Primary Button
```html
<button class="btn-primary">Get Started</button>
```

#### Secondary Button
```html
<button class="btn-secondary">Learn More</button>
```

### Glass Panel
```html
<div class="glass-panel">
  Content here
</div>
```

### Card
```html
<div class="card">
  Card content
</div>
```

## Product Image Background
**Critical Requirement**: All product images MUST be displayed on white background

```css
--product-image-bg: #ffffff;
```

Usage:
```html
<div class="product-image-container">
  <img src="product.jpg" alt="Product" />
</div>
```

## Layout

### Container
```html
<div class="container">
  Content
</div>
```

### Section Padding
```html
<section class="section-padding">
  Section content
</section>
```

## Responsive Breakpoints

| Breakpoint | Width |
|------------|-------|
| sm         | 640px |
| md         | 768px |
| lg         | 1024px |
| xl         | 1280px |
| 2xl        | 1536px |
