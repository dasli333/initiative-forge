import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ConditionData {
  name: {
    en: string;
    pl: string;
  };
  description: string;
  id: string;
}

/**
 * Escapes single quotes in a string for SQL
 */
function escapeSqlString(str: string): string {
  return str.replace(/'/g, "''");
}

/**
 * Converts a condition object to a SQL INSERT statement
 */
function conditionToSql(condition: ConditionData): string {
  const nameJson = JSON.stringify(condition.name);
  const escapedName = escapeSqlString(nameJson);
  const escapedDescription = escapeSqlString(condition.description);
  const escapedId = escapeSqlString(condition.id);

  return `('${escapedId}', '${escapedName}'::jsonb, '${escapedDescription}')`;
}

/**
 * Main function to generate the SQL migration file
 */
function generateConditionsSeedMigration(): void {
  console.log("🚀 Starting conditions seed generation...");

  // Read the conditions JSON file
  const conditionsJsonPath = path.join(__dirname, "../src/schemas/data/conditions.json");
  const conditionsJson = fs.readFileSync(conditionsJsonPath, "utf-8");
  const conditions: ConditionData[] = JSON.parse(conditionsJson);

  console.log(`📚 Loaded ${conditions.length} conditions from JSON`);

  // Generate SQL INSERT statements
  const sqlValues = conditions.map(conditionToSql).join(",\n");

  // Create the full migration file content
  const migrationContent = `-- migration: seed_conditions.sql
-- purpose: populate conditions table with D&D 5e condition data
-- notes: contains ${conditions.length} conditions from D&D 5e
--        uses custom id values from JSON for consistency
--        uses ON CONFLICT DO NOTHING for safe re-runs

-- ====================
-- seed conditions table
-- ====================

INSERT INTO conditions (id, name, description) VALUES
${sqlValues}
ON CONFLICT (id) DO NOTHING;
`;

  // Write the migration file
  const migrationPath = path.join(__dirname, "../supabase/migrations/20251018000002_seed_conditions.sql");
  fs.writeFileSync(migrationPath, migrationContent, "utf-8");

  console.log(`✅ Migration file created: ${migrationPath}`);
  console.log(`📊 Total conditions: ${conditions.length}`);
  console.log("✨ Done!");
}

// Run the script
try {
  generateConditionsSeedMigration();
} catch (error) {
  console.error("❌ Error generating migration:", error);
  process.exit(1);
}
