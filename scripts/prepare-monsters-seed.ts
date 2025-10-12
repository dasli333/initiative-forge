import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface MonsterData {
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
 * Converts a monster object to a SQL INSERT statement
 */
function monsterToSql(monster: MonsterData): string {
  const name = escapeSqlString(monster.name.en);
  const dataJson = JSON.stringify(monster);
  const escapedData = escapeSqlString(dataJson);

  return `('${name}', '${escapedData}'::jsonb)`;
}

/**
 * Main function to generate the SQL migration file
 */
function generateMonstersSeedMigration(): void {
  console.log('🚀 Starting monsters seed generation...');

  // Read the monsters JSON file
  const monstersJsonPath = path.join(__dirname, '../src/schemas/data/monsters-legendary.json');
  const monstersJson = fs.readFileSync(monstersJsonPath, 'utf-8');
  const monsters: MonsterData[] = JSON.parse(monstersJson);

  console.log(`📚 Loaded ${monsters.length} monsters from JSON`);

  // Generate SQL INSERT statements
  const sqlValues = monsters.map(monsterToSql).join(',\n');

  // Create the full migration file content
  const migrationContent = `-- migration: seed_monsters.sql
-- purpose: populate monsters table with SRD data
-- notes: contains ${monsters.length} monsters from D&D 5e System Reference Document
--        uses ON CONFLICT DO NOTHING for safe re-runs

-- ====================
-- seed monsters table
-- ====================

INSERT INTO monsters (name, data) VALUES
${sqlValues}
ON CONFLICT DO NOTHING;
`;

  // Write the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/20251012000000_seed_monsters.sql');
  fs.writeFileSync(migrationPath, migrationContent, 'utf-8');

  console.log(`✅ Migration file created: ${migrationPath}`);
  console.log(`📊 Total monsters: ${monsters.length}`);
  console.log('✨ Done!');
}

// Run the script
try {
  generateMonstersSeedMigration();
} catch (error) {
  console.error('❌ Error generating migration:', error);
  process.exit(1);
}
