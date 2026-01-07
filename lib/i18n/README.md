# Internationalization (i18n) Guide

## Architecture

This project uses a **centralized translation system** for better maintainability and scalability.

## Key Principles

### 1. **Separation of Concerns**
- **Data translations**: Handled by Shopify API (via `language` parameter in queries)
- **UI translations**: Handled by centralized translation files

### 2. **Why Centralized Translations?**

#### ✅ Benefits:
- **Single source of truth**: All translations in one place
- **Easier maintenance**: Update translations without touching component code
- **Reusability**: Share translations across components (e.g., "No image")
- **Type safety**: TypeScript ensures translation keys exist
- **Better organization**: Grouped by feature/page
- **Non-developer friendly**: Translators can work with JSON files

#### ❌ Problems with Component-Level Translations:
- Duplication (same text in multiple files)
- Hard to find all instances of a translation
- Inconsistent translations
- Harder to maintain as app grows

## Usage

### Basic Usage

```tsx
import { useLanguage } from '@/lib/contexts/language-context';
import { useTranslations } from '@/lib/i18n/translations';

function MyComponent() {
  const { language } = useLanguage();
  const { t } = useTranslations(language);
  
  return <h1>{t('home.heroTitle')}</h1>;
}
```

### Direct Access (for nested objects)

```tsx
import { useLanguage } from '@/lib/contexts/language-context';
import { translations } from '@/lib/i18n/translations';

function Header() {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <nav>
      <Link href="/products">{t.header.nav.shop}</Link>
    </nav>
  );
}
```

## Translation Structure

Translations are organized by feature:

```
translations/
  ├── common/          # Shared across app
  ├── home/            # Home page
  ├── header/          # Header component
  ├── cart/            # Cart drawer
  ├── products/        # Products page
  └── ...
```

## Adding New Translations

1. Add to `lib/i18n/translations.ts`
2. Use dot notation: `feature.key` or `feature.nested.key`
3. Add translations for all languages (en, es, fr)

## Best Practices

1. ✅ **Use centralized translations** for UI text
2. ✅ **Use API language parameter** for data from Shopify
3. ✅ **Group by feature** for better organization
4. ✅ **Reuse common translations** (e.g., `common.noImage`)
5. ✅ **Keep translation keys descriptive** (`home.heroTitle` not `home.title1`)

## Migration from Component-Level Translations

To migrate existing component-level translations:

1. Move translation objects to `lib/i18n/translations.ts`
2. Update components to use `useTranslations` hook
3. Remove local translation objects

Example migration:
```tsx
// Before (in component)
const translations = { en: {...}, es: {...} }

// After (using centralized)
import { useTranslations } from '@/lib/i18n/translations';
const { t } = useTranslations(language);
```

