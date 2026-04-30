// Script di test automatizzato per le API StreetCats
// Esegui con: node testAPI.js

const BASE_URL = 'http://localhost:3000';

// Colori per output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(type, message) {
  const icons = { success: '✓', error: '✗', info: '→', test: '●' };
  const color = type === 'success' ? colors.green : type === 'error' ? colors.red : colors.blue;
  console.log(`${color}${icons[type] || '→'} ${message}${colors.reset}`);
}

async function request(method, endpoint, body = null, token = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json().catch(() => ({}));
  
  return { status: response.status, data };
}

async function runTests() {
  console.log('\n' + '='.repeat(50));
  console.log('   TEST API STREETCATS');
  console.log('='.repeat(50) + '\n');
  
  let token = null;
  let catId = null;
  let commentId = null;
  let testsPassed = 0;
  let testsFailed = 0;
  
  // ========== TEST AUTENTICAZIONE ==========
  console.log(colors.yellow + '\n[AUTENTICAZIONE]' + colors.reset);
  
  // Test 1: Signup nuovo utente di test
  log('test', 'Test 1: Registrazione utente test...');
  let res = await request('POST', '/signup', {
    userName: 'test_api_user',
    password: 'testpass123',
    email: 'testapi@example.com'
  });
  
  if (res.status === 201 || res.status === 400) {
    log('success', `Signup: ${res.status === 201 ? 'Utente creato' : 'Utente già esistente'}`);
    testsPassed++;
  } else {
    log('error', `Signup fallito: ${JSON.stringify(res.data)}`);
    testsFailed++;
  }
  
  // Test 2: Login
  log('test', 'Test 2: Login utente...');
  res = await request('POST', '/auth', {
    email: 'testapi@example.com',
    password: 'testpass123'
  });
  
  if (res.status === 200 && res.data.token) {
    token = res.data.token;
    log('success', `Login OK - Token ottenuto`);
    testsPassed++;
  } else {
    log('error', `Login fallito: ${JSON.stringify(res.data)}`);
    testsFailed++;
  }
  
  // Test 3: Profilo con token
  log('test', 'Test 3: Profilo utente autenticato...');
  res = await request('GET', '/profile', null, token);
  
  if (res.status === 200 && res.data.email === 'testapi@example.com') {
    log('success', `Profilo OK - email: ${res.data.email}`);
    testsPassed++;
  } else {
    log('error', `Profilo fallito: ${JSON.stringify(res.data)}`);
    testsFailed++;
  }
  
  // ========== TEST GATTI ==========
  console.log(colors.yellow + '\n[GATTI]' + colors.reset);
  
  // Test 4: Lista gatti (pubblico)
  log('test', 'Test 4: Lista gatti (pubblico)...');
  res = await request('GET', '/cats');
  
  if (res.status === 200 && Array.isArray(res.data)) {
    log('success', `Lista gatti OK - ${res.data.length} gatti trovati`);
    testsPassed++;
  } else {
    log('error', `Lista gatti fallita: ${JSON.stringify(res.data)}`);
    testsFailed++;
  }
  
  // Test 5: Crea gatto (autenticato)
  log('test', 'Test 5: Crea nuovo gatto...');
  res = await request('POST', '/cats', {
    name: 'Whiskers',
    description: 'Gatto nero molto simpatico',
    color: 'nero',
    size: 'medio',
    neutered: true,
    address: 'Via Test 123, Milano',
    latitude: 45.4642,
    longitude: 9.1900
  }, token);
  
  if (res.status === 201 && res.data.id) {
    catId = res.data.id;
    log('success', `Gatto creato OK - ID: ${catId}`);
    testsPassed++;
  } else {
    log('error', `Creazione gatto fallita: ${JSON.stringify(res.data)}`);
    testsFailed++;
  }
  
  // Test 6: Dettaglio gatto
  log('test', `Test 6: Dettaglio gatto ID ${catId}...`);
  res = await request('GET', `/cats/${catId}`);
  
  if (res.status === 200 && res.data.name === 'Whiskers') {
    log('success', `Dettaglio OK - Nome: ${res.data.name}`);
    testsPassed++;
  } else {
    log('error', `Dettaglio fallito: ${JSON.stringify(res.data)}`);
    testsFailed++;
  }
  
  // Test 7: Crea gatto senza autenticazione (deve fallire)
  log('test', 'Test 7: Crea gatto senza auth (deve fallire)...');
  res = await request('POST', '/cats', { name: 'Test' });
  
  if (res.status === 401) {
    log('success', 'Corretto! 401 Unauthorized');
    testsPassed++;
  } else {
    log('error', `Doveva fallire con 401, invece: ${res.status}`);
    testsFailed++;
  }
  
  // Test 8: Modifica gatto
  log('test', 'Test 8: Modifica gatto...');
  res = await request('PUT', `/cats/${catId}`, {
    name: 'Whiskers Aggiornato',
    description: 'Descrizione aggiornata'
  }, token);
  
  if (res.status === 200 && res.data.name === 'Whiskers Aggiornato') {
    log('success', `Modifica OK - Nuovo nome: ${res.data.name}`);
    testsPassed++;
  } else {
    log('error', `Modifica fallita: ${JSON.stringify(res.data)}`);
    testsFailed++;
  }
  
  // ========== TEST COMMENTI ==========
  console.log(colors.yellow + '\n[COMMENTI]' + colors.reset);
  
  // Test 9: Aggiungi commento
  log('test', 'Test 9: Aggiungi commento a gatto...');
  res = await request('POST', `/cats/${catId}/comments`, {
    text: 'Che bel gattino! Lo vedo spesso in zona.'
  }, token);
  
  if (res.status === 201 && res.data.id) {
    commentId = res.data.id;
    log('success', `Commento creato OK - ID: ${commentId}`);
    testsPassed++;
  } else {
    log('error', `Creazione commento fallita: ${JSON.stringify(res.data)}`);
    testsFailed++;
  }
  
  // Test 10: Lista commenti gatto
  log('test', 'Test 10: Lista commenti del gatto...');
  res = await request('GET', `/cats/${catId}/comments`);
  
  if (res.status === 200 && Array.isArray(res.data)) {
    log('success', `Lista commenti OK - ${res.data.length} commenti`);
    testsPassed++;
  } else {
    log('error', `Lista commenti fallita: ${JSON.stringify(res.data)}`);
    testsFailed++;
  }
  
  // Test 11: Modifica commento
  log('test', 'Test 11: Modifica commento...');
  res = await request('PUT', `/comments/${commentId}`, {
    text: 'Commento modificato'
  }, token);
  
  if (res.status === 200) {
    log('success', 'Modifica commento OK');
    testsPassed++;
  } else {
    log('error', `Modifica commento fallita: ${JSON.stringify(res.data)}`);
    testsFailed++;
  }
  
  // Test 12: Elimina commento
  log('test', 'Test 12: Elimina commento...');
  res = await request('DELETE', `/comments/${commentId}`, null, token);
  
  if (res.status === 200) {
    log('success', 'Eliminazione commento OK');
    testsPassed++;
  } else {
    log('error', `Eliminazione commento fallita: ${JSON.stringify(res.data)}`);
    testsFailed++;
  }
  
  // Test 13: Elimina gatto
  log('test', 'Test 13: Elimina gatto...');
  res = await request('DELETE', `/cats/${catId}`, null, token);
  
  if (res.status === 200) {
    log('success', 'Eliminazione gatto OK');
    testsPassed++;
  } else {
    log('error', `Eliminazione gatto fallita: ${JSON.stringify(res.data)}`);
    testsFailed++;
  }
  
  // ========== RIEPILOGO ==========
  console.log('\n' + '='.repeat(50));
  console.log(colors.green + `  PASSATI: ${testsPassed}` + colors.reset);
  console.log(colors.red + `  FALLITI: ${testsFailed}` + colors.reset);
  console.log('='.repeat(50) + '\n');
  
  return testsFailed === 0;
}

// Esegui i test
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Errore durante i test:', err);
    process.exit(1);
  });
