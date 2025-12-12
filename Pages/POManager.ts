// Pages/POManager.ts
import { Page } from '@playwright/test';
import { LoginPage } from './Login/LoginPage';
import { CommonUtils } from '../utils/commonUtils';

/**
 * POManager (Page Object Manager)
 * Centralized management of all page objects
 * 
 * Benefits:
 * - Single instantiation point for all pages
 * - Lazy initialization (pages created only when accessed)
 * - Cleaner test setup
 * - Easy to maintain and extend
 * 
 * Usage in tests:
 * ```typescript
 * const pom = new POManager(page);
 * await pom.loginPage.navigate();
 * await pom.loginPage.login('user', 'pass');
 * ```
 */
export class POManager {
  readonly page: Page;
  
  // Private properties for lazy initialization
  private _loginPage: LoginPage;
  private _commonUtils: CommonUtils;
  
  // Add more page objects as you create them:
  // private _dashboardPage: DashboardPage;
  // private _paymentsPage: PaymentsPage;
  // private _usersPage: UsersPage;

  constructor(page: Page) {
    this.page = page;
    this._loginPage = new LoginPage(this.page); // Initialize to undefined for lazy loading
    this._commonUtils = new CommonUtils(this.page);
  }

  /**
   * Get LoginPage instance
   * Lazy initialization - creates object only when first accessed
   */
  get loginPage(): LoginPage {
    if (!this._loginPage) {
      this._loginPage = new LoginPage(this.page);
    }
    return this._loginPage;
  }

  /**
   * Get CommonUtils instance
   */
  get commonUtils(): CommonUtils {
    if (!this._commonUtils) {
      this._commonUtils = new CommonUtils(this.page);
    }
    return this._commonUtils;
  }

  /**
   * Add more page getters as you create new pages:
   * 
   * get dashboardPage(): DashboardPage {
   *   if (!this._dashboardPage) {
   *     this._dashboardPage = new DashboardPage(this.page);
   *   }
   *   return this._dashboardPage;
   * }
   * 
   * get paymentsPage(): PaymentsPage {
   *   if (!this._paymentsPage) {
   *     this._paymentsPage = new PaymentsPage(this.page);
   *   }
   *   return this._paymentsPage;
   * }
   */
}
