// שומר GRANT ל-Supabase — גלובלי (כל הפרויקטים). רמי, 20/10/2026.
// מ-30/10/2026 Supabase לא מעניק יותר הרשאות Data API אוטומטית לטבלה חדשה ב-public — גם בפרויקט חדש, ב-preview branch וב-`db reset`.
// טבלה בלי GRANT מפורש ⇐ "permission denied" מ-supabase-js / PostgREST / GraphQL.
// PostToolUse על Write|Edit|MultiEdit: קובץ ב-supabase/migrations/*.sql שיש בו `create table` ב-public בלי `grant … on <הטבלה> … to …`
// באותו קובץ ⇐ אזהרה (לא חסימה) — למודל ולמשתמש.
// `--if-no-global` — לעותק שבריפו (סשני ענן): אם השומר הגלובלי קיים במחשב הזה, לא לרוץ פעמיים.
const fs = require("fs");
const path = require("path");
const os = require("os");

if (process.argv.includes("--if-no-global") && fs.existsSync(path.join(os.homedir(), ".claude", "hooks", "supabase-grant-guard.js"))) process.exit(0);

let raw = "";
process.stdin.on("data", (d) => { raw += d; });
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw || "{}");
    const ti = input.tool_input || {};
    const file = String(ti.file_path || ti.notebook_path || "");
    if (!/supabase[\\/]+migrations[\\/]+[^\\/]+\.sql$/i.test(file)) return;
    let sql = "";
    try { sql = fs.readFileSync(file, "utf8"); } catch { sql = String(ti.content || ""); }
    const missing = tablesWithoutGrant(sql);
    if (!missing.length) return;
    const list = missing.join(", ");
    const msg = `⚠️ Supabase (מ-30/10/2026): במיגרציה ${path.basename(file)} נוצרות טבלאות ב-public בלי GRANT מפורש: ${list}. ` +
      "בלי GRANT באותה מיגרציה — Data API יחזיר permission denied (בפרויקט חדש, preview branch ו-db reset). " +
      "להוסיף לכל טבלה: grant select, insert, update, delete on public.<טבלה> to authenticated; ול-service_role; ול-anon רק אם צריך — לפי ה-RLS של הטבלה.";
    process.stdout.write(JSON.stringify({ systemMessage: msg, hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: msg } }));
  } catch {
    // שומר — לא שובר עבודה.
  }
});

/** הטבלאות ב-public (או בלי סכימה) שנוצרות בקובץ ואין להן `grant … on <טבלה> … to`. */
function tablesWithoutGrant(text) {
  const sql = text.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/--[^\n]*/g, " ");
  const created = new Set();
  const re = /create\s+(?:unlogged\s+)?table\s+(?:if\s+not\s+exists\s+)?((?:"?[\w]+"?\.)?"?[\w]+"?)/gi;
  for (const m of sql.matchAll(re)) {
    const parts = m[1].replace(/"/g, "").split(".");
    const schema = parts.length > 1 ? parts[0].toLowerCase() : "public";
    if (schema !== "public") continue;
    created.add(parts[parts.length - 1].toLowerCase());
  }
  if (!created.size) return [];
  if (/grant\s[^;]*\son\s+all\s+tables\s+in\s+schema\s+public\s[^;]*\bto\b/i.test(sql)) return [];
  const granted = new Set();
  const g = /grant\s[^;]*?\son\s+(?:table\s+)?([^;]*?)\s+to\s/gi;
  for (const m of sql.matchAll(g)) {
    for (const t of m[1].split(",")) {
      const parts = t.trim().replace(/"/g, "").split(".");
      granted.add(parts[parts.length - 1].toLowerCase());
    }
  }
  return [...created].filter((t) => !granted.has(t));
}
