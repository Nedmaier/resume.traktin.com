# Locales

The page markup contains translation keys in `data-i18n` attributes. Each
locale JSON file must contain the same keys.

To add Hebrew:

1. Copy `en.json` to `he.json` and translate every value.
2. Add `he` to `ACTIVE_LANGUAGES` in `script.js`.
3. Add `/he` and `/he/` rewrites to `vercel.json`.

Hebrew is already configured as `he-IL` with right-to-left (`rtl`) direction.
