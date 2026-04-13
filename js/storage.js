// ============================================================
// storage.js — LocalStorage helpers & data initialisation
// ============================================================

const KEYS = {
  FOODS: 'ft_foods',
  PORTIONS: 'ft_portions',
  LOGS: 'ft_logs',
  TARGETS: 'ft_targets',
  ONBOARDED: 'ft_onboarded'
};

const DEFAULT_TARGETS = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 70,
  fiber: 30
};

const DEFAULT_PORTIONS = {
  fist: 150,
  palm: 100,
  cup: 240,
  piece: 50,
  bowl: 280,
  plate: 350,
  tablespoon: 15,
  teaspoon: 5
};

// ── Raw save/load ───────────────────────────────────────────
function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Storage write failed:', e);
    return false;
  }
}

function loadData(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('Storage read failed:', e);
    return fallback;
  }
}

// ── Foods ──────────────────────────────────────────────────
async function getFoods() {
  const stored = loadData(KEYS.FOODS);
  if (stored) return stored;

  // First run: fetch defaults from data file
  try {
    const base = location.pathname.includes('/food-tracker') ? '/food-tracker' : '.';
    const res = await fetch(`${base}/data/foods-default.json`);
    const defaults = await res.json();
    saveData(KEYS.FOODS, defaults);
    return defaults;
  } catch (e) {
    // Fallback: try relative path
    try {
      const res = await fetch('./data/foods-default.json');
      const defaults = await res.json();
      saveData(KEYS.FOODS, defaults);
      return defaults;
    } catch (e2) {
      console.error('Could not load default foods:', e2);
      return [];
    }
  }
}

function saveFoods(foods) {
  return saveData(KEYS.FOODS, foods);
}

function addFood(food) {
  const foods = loadData(KEYS.FOODS, []);
  food.id = 'custom_' + Date.now();
  food.custom = true;
  foods.push(food);
  saveFoods(foods);
  return food;
}

function updateFood(id, updates) {
  const foods = loadData(KEYS.FOODS, []);
  const idx = foods.findIndex(f => f.id === id);
  if (idx === -1) return false;
  foods[idx] = { ...foods[idx], ...updates };
  saveFoods(foods);
  return true;
}

function deleteFood(id) {
  const foods = loadData(KEYS.FOODS, []);
  saveFoods(foods.filter(f => f.id !== id));
}

// ── Portions ───────────────────────────────────────────────
function getPortions() {
  return loadData(KEYS.PORTIONS, DEFAULT_PORTIONS);
}

function savePortions(portions) {
  return saveData(KEYS.PORTIONS, portions);
}

// ── Targets ────────────────────────────────────────────────
function getTargets() {
  return loadData(KEYS.TARGETS, DEFAULT_TARGETS);
}

function saveTargets(targets) {
  return saveData(KEYS.TARGETS, targets);
}

// ── Daily Logs ─────────────────────────────────────────────
function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function getDateKey(date) {
  if (date instanceof Date) return date.toISOString().split('T')[0];
  return date;
}

function getAllLogs() {
  return loadData(KEYS.LOGS, {});
}

function getDayLog(dateKey = getTodayKey()) {
  const logs = getAllLogs();
  return logs[dateKey] || [];
}

function saveDayLog(entries, dateKey = getTodayKey()) {
  const logs = getAllLogs();
  logs[dateKey] = entries;
  saveData(KEYS.LOGS, logs);
}

function addLogEntry(entry, dateKey = getTodayKey()) {
  const entries = getDayLog(dateKey);
  entry.id = Date.now();
  entry.timestamp = new Date().toISOString();
  entries.push(entry);
  saveDayLog(entries, dateKey);
  return entry;
}

function updateLogEntry(entryId, updates, dateKey = getTodayKey()) {
  const entries = getDayLog(dateKey);
  const idx = entries.findIndex(e => e.id === entryId);
  if (idx === -1) return false;
  entries[idx] = { ...entries[idx], ...updates };
  saveDayLog(entries, dateKey);
  return true;
}

function deleteLogEntry(entryId, dateKey = getTodayKey()) {
  const entries = getDayLog(dateKey);
  saveDayLog(entries.filter(e => e.id !== entryId), dateKey);
}

// ── Export / Import ────────────────────────────────────────
function exportAllData() {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    foods: loadData(KEYS.FOODS, []),
    portions: getPortions(),
    logs: getAllLogs(),
    targets: getTargets()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `foodtrack-backup-${getTodayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importAllData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.foods) saveData(KEYS.FOODS, data.foods);
    if (data.portions) saveData(KEYS.PORTIONS, data.portions);
    if (data.logs) saveData(KEYS.LOGS, data.logs);
    if (data.targets) saveData(KEYS.TARGETS, data.targets);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ── Week summary ───────────────────────────────────────────
function getWeekLogs() {
  const logs = getAllLogs();
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = getDateKey(d);
    week.push({ date: key, entries: logs[key] || [] });
  }
  return week;
}
