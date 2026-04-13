# 🥗 FoodTrack

A **personalized food & calorie tracking web app** — fully static, no backend, no database. Runs on GitHub Pages.

## Features

- **Dashboard** with calorie ring, macro progress bars, 7-day chart, macro distribution donut
- **Add Food** — autocomplete search, grams OR portion mode, live nutrition preview, meal labels
- **Daily Log** — grouped by meal, edit quantities, date navigation, totals summary
- **Food Manager** — full CRUD, custom foods, per-food portion sizes, category filtering
- **Settings** — daily targets (calories/protein/carbs/fat/fiber), personalised portion sizes, presets, export/import JSON backup

## Tech Stack

- Vanilla HTML + CSS + JavaScript
- localStorage (zero backend)
- Google Fonts: DM Serif Display + DM Mono + DM Sans
- No frameworks, no build step

## Getting Started

### Local
Open `index.html` directly in your browser (note: the default food database fetches a JSON file, so use a local server for best results):

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

Then open `http://localhost:8000`.

### GitHub Pages
1. Push this folder to a GitHub repo
2. Go to Settings → Pages → Deploy from branch → `main` / `root`
3. Your app lives at `https://yourusername.github.io/food-tracker/`

## File Structure

```
food-tracker/
├── index.html          # Dashboard
├── add-food.html       # Add food to log
├── log.html            # Today's log
├── foods.html          # Food manager
├── settings.html       # Settings + data
├── css/style.css       # Design system
├── js/
│   ├── storage.js      # LocalStorage helpers
│   ├── nutrition.js    # Calculation engine
│   ├── app.js          # Shared UI utilities
│   └── nav.js          # Navigation injection
└── data/
    └── foods-default.json  # 35+ Malaysian/global foods
```

## Default Foods

35 foods pre-loaded including Malaysian staples:
- Nasi Lemak, Roti Canai, Mee Goreng, Char Kuey Teow, Kangkung, Ikan Bakar, Teh Tarik, Milo, Ayam Goreng, Tempeh

## Data Backup

All data lives in your browser's localStorage. Use **Settings → Export** to download a JSON backup and **Import** to restore it on another device.

## Extending

The codebase is structured for future additions:
- `js/storage.js` — add new data keys here
- `js/nutrition.js` — add new calculations
- `data/foods-default.json` — add more default foods
- Future: AI food recognition (pass image to Claude API), cloud sync (Supabase/PocketBase)
