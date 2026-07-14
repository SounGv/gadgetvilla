import { test, expect } from '@playwright/test';

test('หน้าแรกโหลดและมีปุ่มช้อป', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /ช้อปเลย/ })).toBeVisible();
});

test('ไปหน้าสินค้าได้', async ({ page }) => {
  await page.goto('/products');
  await expect(page.getByRole('heading', { name: /สินค้าทั้งหมด/ })).toBeVisible();
});

test('ตะกร้าว่างแสดง empty state', async ({ page }) => {
  await page.goto('/cart');
  await expect(page.getByText(/ตะกร้าว่าง/)).toBeVisible();
});
