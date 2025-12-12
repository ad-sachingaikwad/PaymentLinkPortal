// Pages/Login/LoginPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../pages/basePage';
import { CURRENT_ENV } from '../../tests/config/environment';
import loginData from '../../testData/LoginTestData.json';

/**
 * LoginPage - Handles all login page interactions
 * Extends BasePage to inherit common methods
 */
export class LoginPage extends BasePage {
  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly validationMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize page-specific locators using XPath for Angular formControlName
    // XPath is more reliable for Angular applications
    this.usernameInput = page.locator('xpath=//input[contains(@formcontrolname,"userName")]');
    this.passwordInput = page.locator('xpath=//input[contains(@formcontrolname,"password")]');
    this.loginButton = page.locator('xpath=//span[contains(text(),"Login")]');
    // Try multiple possible error selectors (Angular Material, Bootstrap, custom)
    this.validationMessage = page.locator('.error-text, mat-error, .mat-error, .alert, .alert-danger, .text-danger, [class*="error"], [class*="invalid"]').first();
  }

  /**
   * Navigate to login page
   */
  async navigate() {
    await this.navigateTo(CURRENT_ENV);
    // Wait for page to load (Angular apps need time to render)
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000); // Give Angular time to initialize
  }

  /**
   * Perform login with username and password
   */
  async login(username: string, password: string) {
    console.log(`Logging in with username: ${username}`);
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForPageLoad();
  }

  /**
   * Login with credentials from test data
   */
  async loginWithTestData(index: number = 0) {
    const credentials = loginData[index];
    await this.login(credentials.username, credentials.password);
  }

  /**
   * Quick login method - navigates and logs in
   */
  async quickLogin(username: string, password: string) {
    await this.navigate();
    await this.login(username, password);
  }

  /**
   * Login with first user from test data
   */
  async loginAsDefaultUser() {
    await this.navigate();
    await this.loginWithTestData(0);
  }

 

  /**
   * Verify login page is displayed
   */
  async verifyLoginPageDisplayed() {
    await this.waitForVisible(this.usernameInput);
    await this.waitForVisible(this.passwordInput);
    await this.waitForVisible(this.loginButton);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  async isValidationMessageVisisble():Promise<boolean>{
    return this.isVisible(this.validationMessage);
  }

  async getValidationMessageText():Promise<String>{
    return this.getText(this.validationMessage);
  }

  /**
   * Clear login form
   */
  async clearForm() {
    await this.clear(this.usernameInput);
    await this.clear(this.passwordInput);
  }
}
