// Pages/basePage.ts
import { Page, Locator, expect } from '@playwright/test';
import { CommonUtils } from '../utils/commonUtils';

export class BasePage {
  readonly page: Page;
  readonly utils: CommonUtils;
  
  // Common elements that may appear across multiple pages
  readonly loadingSpinner: Locator;
  readonly toastMessage: Locator;
  readonly errorMessage: Locator;
  
  // Common table elements (if applicable to multiple pages)
  readonly tableRows: Locator;
  readonly itemsPerPageDropdown: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.utils = new CommonUtils(page);
    
    // Initialize common locators (adjust selectors based on your app)
    this.loadingSpinner = page.locator('.loading, .spinner, [data-testid="loading"]');
    this.toastMessage = page.locator('.toast, .toast-message, .notification');
    this.errorMessage = page.locator('.error-message, .alert-error');
    
    // Table elements (if common across pages)
    this.tableRows = page.locator('table tbody tr');
    this.itemsPerPageDropdown = page.locator('#itemsPerPage, #maxPerPage');
    this.searchInput = page.locator('#searchInput, [placeholder*="Search"]');
    this.searchButton = page.locator('#searchBtn, button:has-text("Search")');
  }

  // ==================== Navigation ====================
  
  /**
   * Navigate to a specific URL
   */
  async navigateTo(url: string) {
    console.log(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for URL to match pattern
   */
  async waitForUrl(url: string | RegExp, timeout: number = 30000) {
    await this.page.waitForURL(url, { timeout });
  }

  // ==================== Basic Interactions ====================
  
  /**
   * Click with auto-highlight
   */
  async click(locator: Locator) {
    await this.utils.click(locator);
  }

  /**
   * Fill input field with auto-highlight
   */
  async fill(locator: Locator, text: string) {
    await this.utils.fill(locator, text);
  }

  /**
   * Type text character by character
   */
  async type(locator: Locator, text: string, delay?: number) {
    await this.utils.type(locator, text, delay);
  }

  /**
   * Select dropdown option
   */
  async selectDropdown(locator: Locator, value: string) {
    await this.utils.selectOption(locator, value);
  }

  /**
   * Clear input field
   */
  async clear(locator: Locator) {
    await locator.clear();
  }

  /**
   * Check checkbox
   */
  async check(locator: Locator) {
    await locator.check();
  }

  /**
   * Uncheck checkbox
   */
  async uncheck(locator: Locator) {
    await locator.uncheck();
  }

  // ==================== Wait Strategies ====================
  
  /**
   * Wait for element to be visible
   */
  async waitForVisible(locator: Locator, timeout?: number) {
    await this.utils.waitForVisible(locator, timeout);
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(locator: Locator, timeout?: number) {
    await this.utils.waitForHidden(locator, timeout);
  }

  /**
   * Wait for loading spinner to disappear
   */
  async waitForLoadingToComplete(timeout: number = 30000) {
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout });
    } catch {
      // Loading spinner might not exist, that's okay
    }
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for DOM content to load
   */
  async waitForDOMLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ==================== Getters ====================
  
  /**
   * Get text content from element
   */
  async getText(locator: Locator): Promise<string> {
    return this.utils.getText(locator);
  }

  /**
   * Get all text contents from multiple elements
   */
  async getAllTexts(locator: Locator): Promise<string[]> {
    return this.utils.getAllTexts(locator);
  }

  /**
   * Get element count
   */
  async getCount(locator: Locator): Promise<number> {
    return this.utils.getCount(locator);
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return this.utils.isVisible(locator);
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return this.utils.isEnabled(locator);
  }

  /**
   * Check if element is checked (for checkboxes/radio buttons)
   */
  async isChecked(locator: Locator): Promise<boolean> {
    return await locator.isChecked();
  }

  // ==================== Toast/Alert Handling ====================
  
  /**
   * Get toast message text
   */
  async getToastMessage(): Promise<string> {
    await this.toastMessage.waitFor({ state: 'visible', timeout: 15000 });
    return await this.toastMessage.textContent() || '';
  }

  /**
   * Wait for specific toast message
   */
  async waitForToastMessage(expectedText: string, timeout: number = 15000) {
    const toast = this.page.locator('.toast, .toast-message').filter({ 
      hasText: new RegExp(expectedText, 'i') 
    });
    await toast.waitFor({ state: 'visible', timeout });
  }

  /**
   * Verify toast message appears and contains expected text
   */
  async verifyToastMessage(expectedText: string) {
    const message = await this.getToastMessage();
    expect(message).toContain(expectedText);
  }

  /**
   * Wait for toast to disappear
   */
  async waitForToastToDisappear(timeout: number = 10000) {
    try {
      await this.toastMessage.waitFor({ state: 'hidden', timeout });
    } catch {
      // Toast might have already disappeared
    }
  }

  // ==================== Table Operations ====================
  
  /**
   * Get table row count
   */
  async getTableRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  /**
   * Wait for table to load
   */
  async waitForTableToLoad(timeout: number = 30000) {
    await this.tableRows.first().waitFor({ state: 'visible', timeout });
  }

  /**
   * Select items per page
   */
  async selectItemsPerPage(count: number) {
    await this.itemsPerPageDropdown.selectOption(count.toString());
    await this.waitForTableToLoad();
  }

  /**
   * Search in table
   */
  async search(searchText: string) {
    await this.fill(this.searchInput, searchText);
    await this.click(this.searchButton);
    await this.waitForLoadingToComplete();
  }

  /**
   * Clear search
   */
  async clearSearch() {
    await this.searchInput.clear();
    await this.click(this.searchButton);
    await this.waitForLoadingToComplete();
  }

  // ==================== Utility Methods ====================
  
  /**
   * Take screenshot
   */
  async takeScreenshot(name: string) {
    await this.utils.takeScreenshot(name);
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(locator: Locator) {
    await this.utils.scrollIntoView(locator);
  }

  /**
   * Press keyboard key
   */
  async pressKey(key: string) {
    await this.utils.pressKey(key);
  }

  /**
   * Wait for specific duration (use sparingly)
   */
  async wait(milliseconds: number) {
    await this.utils.wait(milliseconds);
  }

  /**
   * Refresh the page
   */
  async refresh() {
    await this.page.reload();
    await this.waitForDOMLoad();
  }

  /**
   * Go back in browser history
   */
  async goBack() {
    await this.page.goBack();
    await this.waitForDOMLoad();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
