// utils/commonUtils.ts
import { Page, Locator } from '@playwright/test';

export class CommonUtils {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Highlight an element before interacting with it (for visual debugging)
   */
  async highlight(locator: Locator) {
    await locator.evaluate((el: HTMLElement) => {
      el.style.border = '3px solid red';
      el.style.backgroundColor = 'yellow';
    });
    await this.page.waitForTimeout(300);
    await locator.evaluate((el: HTMLElement) => {
      el.style.border = '';
      el.style.backgroundColor = '';
    });
  }

  /**
   * Click with optional highlight
   */
  async click(locator: Locator, highlight: boolean = true) {
    if (highlight) await this.highlight(locator);
    await locator.waitFor({ state: 'visible', timeout: 30000 });
    await locator.click();
  }

  /**
   * Fill input field with optional highlight
   */
  async fill(locator: Locator, text: string, highlight: boolean = true) {
    if (highlight) await this.highlight(locator);
    await locator.waitFor({ state: 'visible', timeout: 30000 });
    await locator.fill(text);
  }

  /**
   * Type text character by character (for testing auto-complete, etc.)
   */
  async type(locator: Locator, text: string, delay: number = 100) {
    await locator.waitFor({ state: 'visible', timeout: 30000 });
    await locator.type(text, { delay });
  }

  /**
   * Wait for element to be visible
   */
  async waitForVisible(locator: Locator, timeout: number = 30000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(locator: Locator, timeout: number = 30000) {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Get text content from element
   */
  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible', timeout: 30000 });
    return (await locator.textContent()) || '';
  }

  /**
   * Get all text contents from multiple elements
   */
  async getAllTexts(locator: Locator): Promise<string[]> {
    await locator.first().waitFor({ state: 'visible', timeout: 30000 });
    return await locator.allTextContents();
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Get element count
   */
  async getCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  /**
   * Select dropdown option by value
   */
  async selectOption(locator: Locator, value: string) {
    await locator.waitFor({ state: 'visible', timeout: 30000 });
    await locator.selectOption(value);
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for DOM content to load
   */
  async waitForDOMLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(filename: string) {
    await this.page.screenshot({ 
      path: `screenshots/${filename}-${Date.now()}.png`, 
      fullPage: true 
    });
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Press keyboard key
   */
  async pressKey(key: string) {
    await this.page.keyboard.press(key);
  }

  /**
   * Wait for specific time (use sparingly)
   */
  async wait(milliseconds: number) {
    await this.page.waitForTimeout(milliseconds);
  }
}
