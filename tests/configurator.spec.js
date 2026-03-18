const { test, expect } = require('@playwright/test');

test('E2E Configurator Flow & PDF Generation', async ({ page }) => {
    // 1. TIMEOUT: Allow ample time for PDF generation
    test.setTimeout(120000);

    // Capture Browser Console for Debugging
    page.on('console', msg => console.log(`BROWSER: ${msg.text()}`));

    // --- Step 1: Visit & Fill Customer Data ---
    await page.goto('/');
    await expect(page.locator('span:has-text("Machine Configurator")').first()).toBeVisible({ timeout: 20000 });

    await page.locator('#cust-name').fill('Playwright Test User');
    await page.locator('#cust-company').fill('Adroit Test Corp');
    await page.locator('#cust-phone').fill('1234567890');

    await page.click('button:has-text("Choose Machine Type")');

    // --- Step 2: Machine Selection ---
    await expect(page).toHaveURL(/.*\/machinetype/);
    await page.click('button:has-text("Unoflex Monolayer")');

    // Click first Select button
    await page.locator('button:has-text("Select")').first().click();

    // --- Step 3: Robust Navigation Logic (The Fix) ---
    // Wait explicitly for the URL to change to EITHER 'selection' OR 'addons'
    // This prevents the race condition where we check logic before routing completes.
    await expect(page).toHaveURL(/.*(\/selection|\/addons)/, { timeout: 10000 });

    // Now safely check where we are
    if (page.url().includes('/selection')) {
        console.log('Navigate: Landed on Selection. Clicking Next...');
        const nextBtn = page.locator('button:has-text("Go to Optional Add-ons")');
        await nextBtn.waitFor({ state: 'visible' });
        await nextBtn.click();
    } else {
        console.log('Navigate: Preset skipped Selection (Auto-redirect).');
    }

    // --- Step 4: Verify Add-ons & Move Next ---
    await expect(page).toHaveURL(/.*\/addons/);

    const summaryBtn = page.locator('button:has-text("Go to Summary")');
    await summaryBtn.click();

    // --- Step 5: Summary & PDF ---
    await expect(page).toHaveURL(/.*\/summary/);

    console.log("Triggering PDF Generation...");
    const pdfBtn = page.locator('button:has-text("Download Official PDF")');
    await expect(pdfBtn).toBeVisible();

    // Use force:true to click even if toast/overlays are covering it slightly
    await pdfBtn.click({ force: true });

    // --- Step 6: Wait for Success or Failure ---
    const successToast = page.locator('div[role="status"]:has-text("Quotation PDF downloaded")').first();
    const errorToast = page.locator('div[role="status"]:has-text("Export Error")').first();

    await Promise.race([
        successToast.waitFor({ state: "visible", timeout: 60000 }),
        errorToast.waitFor({ state: "visible", timeout: 60000 }),
    ]).catch(() => console.log("Timed out waiting for final toast status."));

    // Hard Failure if error toast appears
    if (await errorToast.isVisible()) {
        const err = await errorToast.innerText();
        throw new Error(`PDF Generation Failed: ${err}`);
    }

    await expect(successToast).toBeVisible();
    console.log("TEST SUCCESS: PDF Generated.");
});