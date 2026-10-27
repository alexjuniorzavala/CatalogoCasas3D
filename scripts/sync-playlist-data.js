const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const indexFile = path.join(rootDir, 'index.html');
const jsonFile = path.join(rootDir, 'playlist-casas-sdesign.json');

function ensureExists(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} não encontrado: ${filePath}`);
  }
}

function syncPlaylistData() {
  ensureExists(jsonFile, 'JSON da playlist');
  ensureExists(indexFile, 'Arquivo HTML');

  const playlist = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  const serializedJson = JSON.stringify(playlist, null, 2);

  let html = fs.readFileSync(indexFile, 'utf8');
  const pattern = /<script id="playlist-casas-data" type="application\/json">[\s\S]*?<\/script>/i;

  if (!pattern.test(html)) {
    throw new Error('Bloco <script id="playlist-casas-data"> não encontrado em index.html');
  }

  html = html.replace(
    pattern,
    `<script id="playlist-casas-data" type="application/json">${serializedJson}</script>`
  );

  fs.writeFileSync(indexFile, html, 'utf8');

  console.log(`Atualizado ${path.relative(rootDir, indexFile)} com ${playlist?.videos?.length ?? 0} vídeos.`);
}

try {
  syncPlaylistData();
} catch (error) {
  console.error('Erro ao sincronizar imagens da playlist:', error.message);
  process.exit(1);
}
