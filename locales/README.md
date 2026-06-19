# Locales

The page markup contains translation keys in `data-i18n` attributes. Each
locale JSON file must contain the same keys.

Hebrew is configured as `he-IL` with right-to-left (`rtl`) direction.

To add another language:

1. Copy `en.json` to a new locale file and translate every value.
2. Add the language settings and code to `script.js`.
3. Add matching rewrites to `vercel.json`.
