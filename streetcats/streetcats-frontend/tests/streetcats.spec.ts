import { test, expect } from '@playwright/test';
test.describe('Streetcats Tests', () => {

  test('1. Tasti in Home (Non Autenticato)', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Streetcats/i);

    // Verifica che ci sia il link Esplora gatti
    await expect(page.getByRole('link', { name: 'Esplora gatti' })).toBeVisible();

    // Verifica che l'utente non veda i link senza essere autenticato
    await expect(page.getByRole('link', { name: 'Il mio profilo' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Nuova segnalazione' })).not.toBeVisible();
  });

  test('2. Protezione Rotte (Profilo)', async ({ page }) => {
    await page.goto('/profile');
    // Deve reindirizzare a /login automaticamente per Guard
    await expect(page).toHaveURL(/.*login/);
  });

  test('3. Protezione Rotte (Nuova segnalazione)', async ({ page }) => {
    await page.goto('/cats/new');
    // Deve reindirizzare a /login
    await expect(page).toHaveURL(/.*login/);
  });

  test('4. Signup fallito', async ({ page }) => {
    await page.goto('/signup');

    // inviare il form invalido 
    await page.getByPlaceholder('mario_rossi').fill('ab');
    await page.getByPlaceholder('mario@example.com').fill('emailinvalida');
    await page.getByPlaceholder('Almeno 6 caratteri').fill('123');

    await page.getByRole('heading', { name: 'Crea un account' }).click();

    // Verifichiamo che i messaggi di errore di Angular ci siano
    await expect(page.getByText('Minimo 3 caratteri')).toBeVisible();
    await expect(page.getByText('Inserisci un indirizzo email valido')).toBeVisible();
    await expect(page.getByText('Minimo 6 caratteri')).toBeVisible();
  });

  test('5. Signup con Successo', async ({ page }) => {
    await page.goto('/signup');
    const randomUser = `testuser_${Date.now()}`;

    await page.getByPlaceholder('mario_rossi').fill(randomUser);
    await page.getByPlaceholder('mario@example.com').fill(`${randomUser}@example.com`);
    await page.getByPlaceholder('Almeno 6 caratteri').fill('testpass123');

    await page.getByRole('button', { name: "Crea l'account" }).click();

    // Dopo il signup deve reindirizzare alla lista gatti
    await expect(page).toHaveURL(/.*cats/);
    await expect(page.getByRole('link', { name: 'Il mio profilo' })).toBeVisible();
  });

  test('6. Login Fallito', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('mario@example.com').fill('giovannone@gmail.com');
    await page.getByPlaceholder('******').fill('password-sbagliata');
    await page.getByRole('button', { name: "Accedi all'account" }).click();

    // Dovrebbe apparire un messaggio di errore rosso dal backend
    await expect(page.getByText('Credenziali non valide. Riprova.')).toBeVisible();
    await expect(page).toHaveURL(/.*login/);
  });

  test('7. Login con Successo', async ({ page }) => {
    // login
    await page.goto('/login');
    const randomUser = `testuser_${Date.now()}`;

    await page.getByPlaceholder('mario_rossi').fill(randomUser);
    await page.getByPlaceholder('mario@example.com').fill(`${randomUser}@example.com`);
    await page.getByPlaceholder('Almeno 6 caratteri').fill('testpass123');
    await page.getByRole('button', { name: "Accedi all'account" }).click();

    await expect(page).toHaveURL(/.*cats/);
    await expect(page.getByRole('link', { name: 'Nuova segnalazione' })).toBeVisible();
  });

  test('8. Accesso al Profilo', async ({ page }) => {
    await page.goto('/login');
    const randomUser = `testuser_${Date.now()}`;

    await page.getByPlaceholder('mario_rossi').fill(randomUser);
    await page.getByPlaceholder('mario@example.com').fill(`${randomUser}@example.com`);
    await page.getByPlaceholder('Almeno 6 caratteri').fill('testpass123');
    await page.getByRole('button', { name: "Accedi all'account" }).click();

    // Clicca su Profilo
    await page.getByRole('link', { name: 'Il mio profilo' }).click();
    await expect(page).toHaveURL(/.*profile/);

    // Verifica che l'email appaia in pagina
    await expect(page.getByText(`${randomUser}@example.com`)).toBeVisible();
  });

  test('9. Logout', async ({ page }) => {
    await page.goto('/login');
    const randomUser = `testuser_${Date.now()}`;

    await page.getByPlaceholder('mario_rossi').fill(randomUser);
    await page.getByPlaceholder('mario@example.com').fill(`${randomUser}@example.com`);
    await page.getByPlaceholder('Almeno 6 caratteri').fill('testpass123');
    await page.getByRole('button', { name: "Accedi all'account" }).click();

    // Clicca Esci
    await expect(page.getByRole('button', { name: 'Esci' })).toBeVisible();
    await page.getByRole('button', { name: 'Esci' }).click();

    // La navbar deve tornare alla modalità "Accedi"
    await expect(page.getByRole('link', { name: 'Accedi' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Esci' })).not.toBeVisible();
  });

  test('10. Navigazione Dettagli Gatto', async ({ page }) => {
    // Naviga sulla schermata dei gatti
    await page.goto('/cats');

    // aggiungiamo un gatto di test
    await page.goto('/signup');
    const randomUser = `testuser_${Date.now()}`;

    await page.getByPlaceholder('mario_rossi').fill(randomUser);
    await page.getByPlaceholder('mario@example.com').fill(`${randomUser}@example.com`);
    await page.getByPlaceholder('Almeno 6 caratteri').fill('testpass123');
    await page.getByRole('button', { name: "Crea l'account" }).click();
    await expect(page).toHaveURL(/.*cats/);

    // Aggiungiamo un gatto
    await page.getByRole('link', { name: 'Nuova segnalazione' }).click();
    await page.getByPlaceholder('Es. Zorro, Pippo').fill('PIPPOTEST');
    await page.getByPlaceholder('Segni particolari').fill('Che bello sto gatto ');

    await page.locator('app-map').click();
    await page.getByRole('button', { name: 'Pubblica segnalazione' }).click();

    await page.goto('/cats');
    // primo marker di Leaflet visibile in mappa 
    await page.locator('.leaflet-marker-icon').first().click({ force: true });

    // link 'Vai alla pagina del gatto' dentro il popup di Leaflet
    await page.getByRole('link', { name: 'Vai alla pagina del gatto' }).click();

    // pagina del gatto abbia il suo nome
    await expect(page.getByRole('heading', { name: 'PIPPOTEST' })).toBeVisible();
  });

});
