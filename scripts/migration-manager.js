#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');
const PROJECT_DIR = path.join(__dirname, '..');

// Funções utilitárias
function ensureMigrationsDir() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
  }
}

// Função para executar SQL no Supabase remoto
function executeSupabaseSQL(sql) {
  try {
    const tempFile = path.join(PROJECT_DIR, '.temp_query.sql');
    fs.writeFileSync(tempFile, sql);
    
    // Usar supabase db push para aplicar migrations
    const result = execSync(`supabase db push --linked`, {
      cwd: PROJECT_DIR,
      encoding: 'utf8'
    });
    
    // Limpar arquivo temporário
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Erro ao executar SQL:', error.message);
    return null;
  }
}

// Função para verificar se tabela de migrations existe e criar se necessário
function ensureMigrationsTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      filename TEXT NOT NULL,
      checksum TEXT
    );
    
    -- Criar índice para performance
    CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at ON schema_migrations(applied_at);
  `;
  
  return executeSupabaseSQL(createTableSQL) !== null;
}

// Função para obter migrations aplicadas do banco
function getAppliedMigrations() {
  if (!ensureMigrationsTable()) {
    console.error('❌ Erro ao criar/verificar tabela de migrations');
    return [];
  }
  
  const querySQL = `
    SELECT version, applied_at, filename, checksum 
    FROM schema_migrations 
    ORDER BY applied_at;
  `;
  
  try {
    const tempFile = path.join(PROJECT_DIR, '.temp_query.sql');
    fs.writeFileSync(tempFile, querySQL);
    
    // Para consultas, usar supabase db pull para verificar estado
    const result = execSync(`supabase db pull --linked`, {
      cwd: PROJECT_DIR,
      encoding: 'utf8'
    });
    
    // Limpar arquivo temporário
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    
    // Parsear resultado (simplificado - assume formato de tabela)
    const applied = [];
    const lines = result.split('\n');
    
    for (const line of lines) {
      if (line.includes('|') && !line.includes('---') && !line.includes('version')) {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 4 && parts[1]) {
          applied.push({
            version: parts[1],
            appliedAt: parts[2],
            filename: parts[3],
            checksum: parts[4] || null
          });
        }
      }
    }
    
    return applied;
  } catch (error) {
    console.warn('⚠️  Aviso: Erro ao consultar migrations aplicadas:', error.message);
    return [];
  }
}

// Função para registrar migration aplicada
function recordMigration(filename, version, checksum) {
  const insertSQL = `
    INSERT INTO schema_migrations (version, filename, checksum)
    VALUES ('${version}', '${filename}', '${checksum}')
    ON CONFLICT (version) DO NOTHING;
  `;
  
  return executeSupabaseSQL(insertSQL) !== null;
}

// Função para remover migration do registro
function removeMigrationRecord(version) {
  const deleteSQL = `
    DELETE FROM schema_migrations 
    WHERE version = '${version}';
  `;
  
  return executeSupabaseSQL(deleteSQL) !== null;
}

function getMigrationFiles() {
  ensureMigrationsDir();
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql') && !file.startsWith('.'))
    .sort();
}

function parseMigrationFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extrair seção UP (tudo até a seção DOWN)
  const downMarker = '-- DOWN Migration';
  const downIndex = content.indexOf(downMarker);
  
  let upSQL = '';
  let downSQL = '';
  
  if (downIndex !== -1) {
    upSQL = content.substring(0, downIndex).trim();
    downSQL = content.substring(downIndex).trim();
  } else {
    upSQL = content.trim();
  }
  
  // Limpar comentários e linhas vazias da seção UP
  upSQL = upSQL
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('--');
    })
    .join('\n')
    .trim();
    
  // Extrair apenas comandos SQL da seção DOWN (sem comentários)
  downSQL = downSQL
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      return trimmed && 
             !trimmed.startsWith('--') && 
             !trimmed.startsWith('-- ') &&
             (trimmed.toUpperCase().startsWith('DROP') ||
              trimmed.toUpperCase().startsWith('ALTER') ||
              trimmed.toUpperCase().startsWith('DELETE') ||
              trimmed.toUpperCase().startsWith('UPDATE'));
    })
    .join('\n')
    .trim();
  
  return { upSQL, downSQL };
}

function executeSQL(sql, description) {
  if (!sql || sql.trim() === '') {
    console.log('⚠️  Nenhum SQL para executar');
    return true;
  }
  
  try {
    console.log(`🔄 Executando: ${description}`);
    
    // Para banco remoto, usar supabase db push
    console.log('🚀 Enviando migration para o banco remoto...');
    
    execSync(`supabase db push --linked`, { 
      cwd: PROJECT_DIR,
      stdio: 'pipe'
    });
    
    console.log('✅ Migration enviada com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar migration:', error.message);
    return false;
  }
}

// Função para extrair versão do nome do arquivo
function extractVersion(filename) {
  const match = filename.match(/^(\d{14})_/);
  return match ? match[1] : filename;
}

// Função para calcular checksum
function calculateChecksum(content) {
  return require('crypto').createHash('md5').update(content).digest('hex');
}

// Comandos principais
function applyMigrations() {
  console.log('🚀 Aplicando migrations...\n');
  
  const migrationFiles = getMigrationFiles();
  const appliedMigrations = getAppliedMigrations();
  
  if (migrationFiles.length === 0) {
    console.log('📭 Nenhuma migration encontrada');
    return;
  }
  
  const appliedVersions = appliedMigrations.map(m => m.version);
  const pendingMigrations = migrationFiles.filter(file => {
    const version = extractVersion(file);
    return !appliedVersions.includes(version);
  });
  
  if (pendingMigrations.length === 0) {
    console.log('✅ Todas as migrations já foram aplicadas');
    showStatus();
    return;
  }
  
  console.log(`📋 ${pendingMigrations.length} migration(s) pendente(s):\n`);
  
  for (const file of pendingMigrations) {
    console.log(`📄 Aplicando: ${file}`);
    
    const filePath = path.join(MIGRATIONS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { upSQL } = parseMigrationFile(filePath);
    const version = extractVersion(file);
    const checksum = calculateChecksum(fileContent);
    
    if (executeSQL(upSQL, `Migration ${file}`)) {
      if (recordMigration(file, version, checksum)) {
        console.log(`✅ ${file} aplicada com sucesso\n`);
      } else {
        console.warn(`⚠️  ${file} aplicada mas não foi registrada no banco`);
      }
    } else {
      console.error(`❌ Falha ao aplicar ${file}`);
      break;
    }
  }
  
  console.log('🎉 Migrations aplicadas com sucesso!');
}

function rollbackMigration(fileName) {
  if (!fileName) {
    console.error('❌ Erro: Forneça o nome do arquivo da migration');
    console.log('📝 Uso: npm run migration:rollback nome_da_migration.sql');
    return;
  }
  
  console.log(`🔄 Fazendo rollback da migration: ${fileName}\n`);
  
  const appliedMigrations = getAppliedMigrations();
  const version = extractVersion(fileName);
  const appliedMigration = appliedMigrations.find(m => m.version === version);
  
  if (!appliedMigration) {
    console.error('❌ Migration não foi aplicada ou não existe no banco');
    return;
  }
  
  const filePath = path.join(MIGRATIONS_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.error('❌ Arquivo de migration não encontrado');
    return;
  }
  
  const { downSQL } = parseMigrationFile(filePath);
  
  if (!downSQL || downSQL.trim() === '') {
    console.error('❌ Nenhum SQL de rollback encontrado na migration');
    console.log('💡 Adicione comandos na seção "-- DOWN Migration" do arquivo');
    return;
  }
  
  if (executeSQL(downSQL, `Rollback ${fileName}`)) {
    if (removeMigrationRecord(version)) {
      console.log(`✅ Rollback de ${fileName} realizado com sucesso!`);
    } else {
      console.warn(`⚠️  Rollback executado mas não foi removido do registro`);
    }
  } else {
    console.error(`❌ Falha no rollback de ${fileName}`);
  }
}

function showStatus() {
  console.log('📊 Status das Migrations\n');
  
  const migrationFiles = getMigrationFiles();
  const appliedMigrations = getAppliedMigrations();
  
  if (migrationFiles.length === 0) {
    console.log('📭 Nenhuma migration encontrada');
    return;
  }
  
  console.log('┌─────────────────────────────────────────────────────────────────┐');
  console.log('│                         MIGRATIONS STATUS                       │');
  console.log('├─────────────────────────────────────────────────────────────────┤');
  
  const appliedVersions = appliedMigrations.map(m => m.version);
  
  migrationFiles.forEach(file => {
    const version = extractVersion(file);
    const applied = appliedMigrations.find(m => m.version === version);
    const status = applied ? '✅ APLICADA' : '⏳ PENDENTE';
    const date = applied ? new Date(applied.appliedAt).toLocaleString('pt-BR') : '-';
    
    console.log(`│ ${file.padEnd(35)} │ ${status.padEnd(12)} │`);
    if (applied) {
      console.log(`│ ${''.padEnd(35)} │ ${date.padEnd(12)} │`);
    }
    console.log('├─────────────────────────────────────────────────────────────────┤');
  });
  
  const applied = appliedMigrations.length;
  const total = migrationFiles.length;
  const pending = total - applied;
  
  console.log(`│ TOTAL: ${total} | APLICADAS: ${applied} | PENDENTES: ${pending}`.padEnd(65) + '│');
  console.log('└─────────────────────────────────────────────────────────────────┘');
  
  console.log('\n📋 Migrations no banco de dados:');
  if (appliedMigrations.length > 0) {
    appliedMigrations.forEach(m => {
      console.log(`   • ${m.filename} (${new Date(m.appliedAt).toLocaleString('pt-BR')})`);
    });
  } else {
    console.log('   Nenhuma migration aplicada');
  }
}

function resetMigrations() {
  console.log('🔄 Resetando todas as migrations...\n');
  
  const appliedMigrations = getAppliedMigrations();
  
  if (appliedMigrations.length === 0) {
    console.log('✅ Nenhuma migration para resetar');
    return;
  }
  
  console.log('⚠️  Esta operação fará rollback de TODAS as migrations aplicadas!');
  console.log('💡 Use "npm run migration:rollback filename.sql" para rollback individual\n');
  
  // Fazer rollback de todas as migrations em ordem reversa (mais recente primeiro)
  const sortedMigrations = [...appliedMigrations].sort((a, b) => 
    new Date(b.appliedAt) - new Date(a.appliedAt)
  );
  
  for (const migration of sortedMigrations) {
    console.log(`🔄 Rollback: ${migration.filename}`);
    
    const filePath = path.join(MIGRATIONS_DIR, migration.filename);
    if (fs.existsSync(filePath)) {
      const { downSQL } = parseMigrationFile(filePath);
      
      if (downSQL && downSQL.trim() !== '') {
        if (executeSQL(downSQL, `Rollback ${migration.filename}`)) {
          if (removeMigrationRecord(migration.version)) {
            console.log(`✅ ${migration.filename} revertida`);
          } else {
            console.warn(`⚠️  ${migration.filename} revertida mas não removida do registro`);
          }
        } else {
          console.error(`❌ Falha ao reverter ${migration.filename}`);
          break;
        }
      } else {
        console.warn(`⚠️  ${migration.filename} não tem SQL de rollback`);
      }
    } else {
      console.warn(`⚠️  Arquivo ${migration.filename} não encontrado`);
    }
  }
  
  console.log('🎉 Reset completo!');
}

// Processar argumentos da linha de comando
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'apply':
    applyMigrations();
    break;
  case 'rollback':
    rollbackMigration(arg);
    break;
  case 'status':
    showStatus();
    break;
  case 'reset':
    resetMigrations();
    break;
  default:
    console.log('🔧 Migration Manager - Comandos disponíveis:\n');
    console.log('📝 npm run migration:create "description"  - Criar nova migration');
    console.log('🚀 npm run migration:apply                - Aplicar migrations pendentes');
    console.log('↩️  npm run migration:rollback filename.sql - Reverter migration específica');
    console.log('📊 npm run migration:status               - Ver status das migrations');
    console.log('🔄 npm run migration:reset                - Resetar todas as migrations');
    console.log('');
    console.log('💡 Exemplos:');
    console.log('   npm run migration:create "create_users_table"');
    console.log('   npm run migration:rollback 20240831123456_create_users_table.sql');
}
