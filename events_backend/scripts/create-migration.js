#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Obter argumentos da linha de comando
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Erro: Forneça uma descrição para a migration');
  console.log('📝 Uso: npm run migration:create "sua_descricao_aqui"');
  console.log('📝 Exemplo: npm run migration:create "create_users_table"');
  process.exit(1);
}

const description = args[0];

// Validar descrição
if (!/^[a-zA-Z0-9_]+$/.test(description)) {
  console.error('❌ Erro: A descrição deve conter apenas letras, números e underscores');
  console.log('📝 Exemplo válido: create_users_table');
  process.exit(1);
}

// Gerar timestamp
const now = new Date();
const timestamp = now.toISOString()
  .replace(/[-:]/g, '')
  .replace(/\.\d{3}Z$/, '')
  .replace('T', '');

// Nome do arquivo
const fileName = `${timestamp}_${description}.sql`;
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', fileName);

// Template da migration (estilo Alembic)
const migrationTemplate = `"""${description}

Revision ID: ${timestamp}
Create Date: ${now.toISOString()}

"""

-- UP Migration
-- Adicione aqui suas mudanças SQL




-- DOWN Migration
-- Adicione aqui o SQL para reverter as mudanças




`;

// Criar diretório se não existir
const migrationDir = path.dirname(migrationPath);
if (!fs.existsSync(migrationDir)) {
  fs.mkdirSync(migrationDir, { recursive: true });
}

// Escrever arquivo
try {
  fs.writeFileSync(migrationPath, migrationTemplate);
  console.log('✅ Migration criada com sucesso!');
  console.log(`📁 Arquivo: ${fileName}`);
  console.log(`📍 Local: supabase/migrations/${fileName}`);
  console.log('');
  console.log('🔧 Próximos passos:');
  console.log('1. Edite o arquivo criado com suas mudanças SQL');
  console.log('2. Execute: npm run migration:apply');
  console.log('3. Para reverter: npm run migration:rollback ' + fileName);
  console.log('');
  console.log('📝 Para abrir o arquivo:');
  console.log(`code supabase/migrations/${fileName}`);
} catch (error) {
  console.error('❌ Erro ao criar migration:', error.message);
  process.exit(1);
}
