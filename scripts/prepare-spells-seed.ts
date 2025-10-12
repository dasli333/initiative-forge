import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SpellData {
  name: {
    en: string;
    pl: string;
  };
  [key: string]: unknown;
}

/**
 * Escapes single quotes in a string for SQL
 */
function escapeSqlString(str: string): string {
  return str.replace(/'/g, "''");
}

/**
 * Converts a spell object to a SQL INSERT statement
 */
function spellToSql(spell: SpellData): string {
  const name = escapeSqlString(spell.name.en);
  const dataJson = JSON.stringify(spell);
  const escapedData = escapeSqlString(dataJson);

  return `('${name}', '${escapedData}'::jsonb)`;
}

/**
 * Main function to generate the SQL migration file
 */
function generateSpellsSeedMigration(): void {
  console.log('🚀 Starting spells seed generation...');

  // Read the spells JSON file
  const spellsJsonPath = path.join(__dirname, '../src/schemas/data/spells.json');
  const spellsJson = fs.readFileSync(spellsJsonPath, 'utf-8');
  const spells: SpellData[] = JSON.parse(spellsJson);

  console.log(`📚 Loaded ${spells.length} spells from JSON`);

  // Generate SQL INSERT statements
  const sqlValues = spells.map(spellToSql).join(',\n');

  // Create the full migration file content
  const migrationContent = `-- migration: seed_spells.sql
-- purpose: populate spells table with SRD data
-- notes: contains ${spells.length} spells from D&D 5e System Reference Document
--        uses ON CONFLICT DO NOTHING for safe re-runs

-- ====================
-- seed spells table
-- ====================

INSERT INTO spells (name, data) VALUES
${sqlValues}
ON CONFLICT DO NOTHING;
`;

  // Write the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/20251012000001_seed_spells.sql');
  fs.writeFileSync(migrationPath, migrationContent, 'utf-8');

  console.log(`✅ Migration file created: ${migrationPath}`);
  console.log(`📊 Total spells: ${spells.length}`);
  console.log('✨ Done!');
}

// Run the script
try {
  generateSpellsSeedMigration();
} catch (error) {
  console.error('❌ Error generating migration:', error);
  process.exit(1);
}
