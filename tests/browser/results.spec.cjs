const { test, expect } = require('@playwright/test');

const storageKey = 'ai-readiness-scorecard-v1';
async function openAssessment(page, responses = {}) {
  await page.addInitScript(({ storageKey, responses }) => {
    if (sessionStorage.getItem('qa-seeded')) return;
    sessionStorage.setItem('qa-seeded', 'true');
    localStorage.setItem(storageKey, JSON.stringify({ responses, orgProfile: { organizationName: 'Fictional QA Organization' } }));
  }, { storageKey, responses });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start Free Assessment', exact: true }).click();
}
async function results(page) {
  await page.getByRole('button', { name: 'Show all questions', exact: true }).click();
  await page.getByRole('button', { name: /^Trust\s/ }).click();
  await page.getByRole('button', { name: 'View Results', exact: true }).click();
}
async function expectEmpty(page) {
  await expect(page.getByRole('heading', { name: 'Incomplete', exact: true })).toBeVisible();
  await expect(page.getByText('Answer at least one question to see your AI readiness results.', { exact: true })).toBeVisible();
  await expect(page.getByText('Maturity level', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Leading', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Unprepared', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Overall Score', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Executive summary', { exact: true })).toHaveCount(0);
  await expect(page.getByText('30-60-90 day roadmap', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Talk with 2Nspira', exact: true })).toHaveCount(0);
}

test('empty results show Incomplete; answer prompt returns to assessment', async ({ page }) => {
  await openAssessment(page);
  await results(page);
  await expectEmpty(page);
  await page.getByRole('button', { name: 'Answer a question', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Show all questions', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'View Results', exact: true })).toBeVisible();
});

for (const [label, value, tier] of [['lowest', 1, 'Unprepared'], ['Not sure', 'not_sure', 'Early']]) {
  test(`all 39 ${label} answers render correct tier and resume without stale results`, async ({ page }) => {
    const { ASSESSMENT_CATEGORIES } = await import('../../lib/assessment-config.js');
    const responses = Object.fromEntries(ASSESSMENT_CATEGORIES.flatMap(c => c.questions.map(q => [q.id, value])));
    await openAssessment(page, responses);
    await results(page);
    await expect(page.getByText(tier, { exact: true }).first()).toBeVisible();
    await expect(page.locator('.score-ring').getByText(value === 1 ? '0' : '34', { exact: true })).toBeVisible();
    await expect(page.getByText('Leading', { exact: true })).toHaveCount(0);
    await page.reload();
    await page.getByRole('button', { name: 'Start Free Assessment', exact: true }).click();
    await results(page);
    await expect(page.getByText(tier, { exact: true }).first()).toBeVisible();
    await expect(page.locator('.score-ring').getByText(value === 1 ? '0' : '34', { exact: true })).toBeVisible();
  });
}

test('one lowest answer remains scored; reset removes tier even after reload', async ({ page }) => {
  await openAssessment(page, { sv1: 1 });
  await results(page);
  await expect(page.getByText('Unprepared', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Reset assessment', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Start Free Assessment', exact: true }).click();
  await results(page);
  await expectEmpty(page);
});
