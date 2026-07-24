const { test, expect } = require('@playwright/test');

/**
 * Drives the full customer -> machinetype -> (selection) -> addons -> summary -> PDF flow
 * for a single model, and asserts the Details modal renders clean spec rows (no
 * "[object Object]"/"[object Array]" garbage from the unified model record's
 * components/addons/basePrice fields leaking into the generic spec table).
 */
async function runConfiguratorFlow(page, { familyLabel, modelCode }) {
  page.on('console', msg => console.log(`BROWSER: ${msg.text()}`));

  await page.goto('/');
  await expect(page.locator('span:has-text("Machine Configurator")').first()).toBeVisible({ timeout: 20000 });

  await page.locator('#cust-name').fill('Playwright Test User');
  await page.locator('#cust-company').fill('Adroit Test Corp');
  await page.locator('#cust-phone').fill('1234567890');

  await page.click('button:has-text("Choose Machine Type")');
  await expect(page).toHaveURL(/.*\/machinetype/);

  await page.click(`button:has-text("${familyLabel}")`);

  const card = page.locator('div.rounded-xl.border').filter({ hasText: modelCode }).first();
  await expect(card).toBeVisible({ timeout: 10000 });

  // Details modal: confirm the spec table renders clean values, not "[object Object]"
  await card.getByRole('button', { name: 'Details' }).click();
  const modalText = await page.locator('text=Technical Specification').locator('..').locator('..').innerText();
  expect(modalText).not.toContain('[object Object]');
  expect(modalText).not.toContain('[object Array]');
  await page.locator('button:has-text("×")').first().click();

  await card.getByRole('button', { name: 'Select' }).click();

  await expect(page).toHaveURL(/.*(\/selection|\/addons)/, { timeout: 10000 });
  if (page.url().includes('/selection')) {
    const nextBtn = page.locator('button:has-text("Go to Optional Add-ons")');
    await nextBtn.waitFor({ state: 'visible' });
    await nextBtn.click();
  }

  await expect(page).toHaveURL(/.*\/addons/);
  await page.locator('button:has-text("Go to Summary")').click();

  await expect(page).toHaveURL(/.*\/summary/);

  const previewBtn = page.locator('button:has-text("Download Proposal")');
  await expect(previewBtn).toBeVisible();
  await previewBtn.click();

  // Two-step preview -> download flow: the quotation renders into an on-screen
  // "Preview — confirm then download" overlay first; the PDF is only produced
  // once the user confirms from there.
  await expect(page.locator('text=Preview — confirm then download')).toBeVisible({ timeout: 20000 });

  const downloadPdfBtn = page.locator('button:has-text("Download PDF")');
  await expect(downloadPdfBtn).toBeVisible();

  const downloadPromise = page.waitForEvent('download', { timeout: 60000 });
  await downloadPdfBtn.click({ force: true });

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  console.log(`TEST SUCCESS [${modelCode}]: PDF Generated -> ${download.suggestedFilename()}`);
}

const scenarios = [
  { name: 'Mono', familyLabel: 'Unoflex Monolayer', modelCode: 'UNOFLEX-20' },
  { name: 'ABA', familyLabel: 'Duoflex ABA / AB', modelCode: 'DUOFLEX-32' },
  { name: '3-Layer', familyLabel: 'Innoflex 3 Layer', modelCode: 'INNOFLEX-1120' },
  { name: '3-Layer DR', familyLabel: 'Innoflex 3 Layer', modelCode: 'INNOFLEX-1370 DR' },
  { name: '3-Layer IBC', familyLabel: 'Innoflex 3 Layer', modelCode: 'INNOFLEX-2370 IBC (75/75/75)' },
  { name: '3-Layer 1620', familyLabel: 'Innoflex 3 Layer', modelCode: 'INNOFLEX-1620' },
];

for (const scenario of scenarios) {
  test(`E2E Configurator Flow & PDF Generation — ${scenario.name}`, async ({ page }) => {
    test.setTimeout(120000);
    await runConfiguratorFlow(page, scenario);
  });
}
