// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { POManager } from '../pages/POManager';
import { CURRENT_ENV } from './config/environment';
import loginData from '../testData/LoginTestData.json';

/**
 * Login Test Suite
 * Demonstrates usage of POManager and BasePage pattern
 */
test.describe('Login Tests', () => {
  let pom: POManager;

  /**
   * Before each test - Initialize POManager
   * Notice how clean this is compared to initializing each page separately
   */
  test.beforeEach(async ({ page }) => {
    pom = new POManager(page);
  });

  test('Verify login page is displayed @smoke', async ({ page }) => {
    // Navigate to login page
    await pom.loginPage.navigate();
    
    // Verify login page elements are visible
    await pom.loginPage.verifyLoginPageDisplayed();
    
    // Additional assertions
    const title = await pom.loginPage.getPageTitle();
    console.log(`Page title: ${title}`);
  });

  test.only('Successful login with valid credentials @smoke @regression', async ({ page }) => {
    // Login using default test data user
    await pom.loginPage.loginAsDefaultUser();
    
    // Wait for navigation after login
    await pom.loginPage.waitForPageLoad();
  });

  test('Login with invalid credentials shows error @regression', async ({ page }) => {
    // Navigate to login page
    await pom.loginPage.navigate();
    
    // Attempt login with invalid credentials
    await pom.loginPage.login('invaliduser', 'invalidpass');
    
    // Wait for validation message to appear (or timeout)
    await page.waitForTimeout(2000);
    
    // Check if validation message is visible
    const isValidationVisible = await pom.loginPage.isValidationMessageVisisble();
    
    if (isValidationVisible) {
      // If error message appears, verify it
      const validationMessage = await pom.loginPage.getValidationMessageText();
      console.log(`Validation message: ${validationMessage}`);
      expect(validationMessage).toBeTruthy();
    } else {
      // If no error message, verify we're still on login page (not logged in)
      const currentUrl = await page.url();
      console.log(`Current URL: ${currentUrl}`);
      expect(currentUrl).toContain('login');
    }
  });

  test('Login with empty credentials @regression', async ({ page }) => {
    // Navigate to login page
    await pom.loginPage.navigate();
    
    // Try to submit with empty fields
    await pom.loginPage.click(pom.loginPage.loginButton);
    await pom.loginPage.isValidationMessageVisisble();   
    
    // Verify still on login page
    await pom.loginPage.verifyLoginPageDisplayed();
  });

  
  test('Clear form functionality @regression', async ({ page }) => {
    // Navigate to login page
    await pom.loginPage.navigate();
    
    // Fill the form
    await pom.loginPage.fill(pom.loginPage.usernameInput, 'testuser');
    await pom.loginPage.fill(pom.loginPage.passwordInput, 'testpass');
    
    // Clear the form
    await pom.loginPage.clearForm();
    
    // Verify fields are empty
    const usernameValue = await pom.loginPage.usernameInput.inputValue();
    const passwordValue = await pom.loginPage.passwordInput.inputValue();
    
    expect(usernameValue).toBe('');
    expect(passwordValue).toBe('');
  });

  /**
   * Example: Using CommonUtils through POManager
   */
  test('Take screenshot on login page @debug', async ({ page }) => {
    await pom.loginPage.navigate();
    
    // Take screenshot using common utils
    await pom.commonUtils.takeScreenshot('login-page');
    
    console.log('Screenshot captured');
  });

  /**
   * Example: Multiple test data users - Data Driven Tests
   */
  for(let i = 0; i < loginData.length; i++) {
    const credentials = loginData[i];
  
    test(`Login with test user ${i + 1}: ${credentials.username} @data-driven`, async ({ page }) => {
      // Data-driven test with different users
      await pom.loginPage.navigate();
      await pom.loginPage.login(credentials.username, credentials.password);
      
      // Verify login success or failure based on expected outcome
      // For simplicity, just waiting for page load here
      await pom.loginPage.waitForPageLoad();
    });
  }
});

/**
 * Test execution commands:
 * 
 * Run all tests:
 * npx playwright test tests/login.spec.ts
 * 
 * Run smoke tests:
 * npx playwright test tests/login.spec.ts --grep @smoke
 * 
 * Run with specific environment:
 * TEST_ENV=UAT npx playwright test tests/login.spec.ts
 * 
 * Run in headed mode:
 * npx playwright test tests/login.spec.ts --headed
 * 
 * Run with specific browser:
 * npx playwright test tests/login.spec.ts --project=chromium
 */
