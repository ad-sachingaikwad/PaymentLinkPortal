# PaymentLinkPortal - Project Structure

## 📁 Architecture Overview

This project follows **Page Object Model (POM)** design pattern with best practices for maintainable and scalable test automation.

### Project Structure

```
PaymentLinkPortal/
├── pages/
│   ├── basePage.ts          # Base class with common methods
│   └── POManager.ts          # Centralized page object management
├── Pages/
│   └── Login/
│       └── LoginPage.ts      # Login page object
├── utils/
│   └── commonUtils.ts        # Utility functions
├── tests/
│   ├── config/
│   │   └── environment.ts    # Environment configuration
│   └── login.spec.ts         # Login test suite
└── testData/
    └── LoginTestData.json    # Test data

```

## 🎯 Key Components

### 1. **BasePage** (`pages/basePage.ts`)
Base class that all page objects extend. Contains:
- **Navigation methods**: `navigateTo()`, `getCurrentUrl()`, `waitForUrl()`
- **Interaction methods**: `click()`, `fill()`, `type()`, `selectDropdown()`
- **Wait strategies**: `waitForVisible()`, `waitForLoadingToComplete()`, `waitForPageLoad()`
- **Getter methods**: `getText()`, `getCount()`, `isVisible()`, `isEnabled()`
- **Toast/Alert handling**: `getToastMessage()`, `waitForToastMessage()`
- **Table operations**: `getTableRowCount()`, `search()`, `selectItemsPerPage()`
- **Utility methods**: `takeScreenshot()`, `refresh()`, `pressKey()`

**Why use BasePage?**
- ✅ Eliminates code duplication
- ✅ Consistent behavior across all pages
- ✅ Single place to update common functionality
- ✅ Encapsulates utility functions

### 2. **CommonUtils** (`utils/commonUtils.ts`)
Reusable utility class with:
- Element highlighting for visual debugging
- Enhanced wait strategies
- Screenshot capabilities
- Keyboard/mouse interactions
- Network wait helpers

### 3. **POManager** (`pages/POManager.ts`)
Centralized page object management with lazy initialization.

**Benefits:**
- ✅ Clean test setup - one line instantiation
- ✅ Lazy loading - pages created only when needed
- ✅ Single point of page object management
- ✅ Easy to extend with new pages

**Usage:**
```typescript
const pom = new POManager(page);
await pom.loginPage.navigate();
await pom.loginPage.login('user', 'pass');
```

### 4. **Page Objects** (extend BasePage)
Each page class:
- Extends `BasePage` to inherit common methods
- Defines page-specific locators
- Implements page-specific actions
- Provides high-level methods for test scenarios

**Example:**
```typescript
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  
  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}
```

## 🚀 How to Use

### Writing Tests

```typescript
import { test, expect } from '@playwright/test';
import { POManager } from '../Pages/POManager';

test.describe('My Tests', () => {
  let pom: POManager;

  test.beforeEach(async ({ page }) => {
    pom = new POManager(page);
  });

  test('My test', async ({ page }) => {
    await pom.loginPage.loginAsDefaultUser();
    // Your test logic
  });
});
```

### Adding New Pages

1. **Create page class** (e.g., `pages/Dashboard/DashboardPage.ts`):
```typescript
export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
    // Define locators
  }
  // Add page methods
}
```

2. **Add to POManager**:
```typescript
private _dashboardPage: DashboardPage;

get dashboardPage(): DashboardPage {
  if (!this._dashboardPage) {
    this._dashboardPage = new DashboardPage(this.page);
  }
  return this._dashboardPage;
}
```

3. **Use in tests**:
```typescript
await pom.dashboardPage.verifyDashboardLoaded();
```

## 🔧 Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/login.spec.ts

# Run with tags
npx playwright test --grep @smoke

# Run with specific environment
TEST_ENV=UAT npx playwright test

# Run in headed mode
npx playwright test --headed

# Run with specific browser
npx playwright test --project=chromium
```

## 📝 Best Practices

1. **Always extend BasePage** for new page objects
2. **Use POManager** in tests instead of instantiating pages directly
3. **Keep locators as readonly properties** in page classes
4. **Create descriptive method names** that explain what they do
5. **Use test data files** instead of hardcoding values
6. **Add JSDoc comments** for complex methods
7. **Use tags (@smoke, @regression)** to organize tests
8. **Leverage BasePage methods** instead of duplicating code

## 🎓 Pattern Benefits

- **Maintainability**: Changes to UI require updates in one place
- **Reusability**: Common methods available to all pages
- **Readability**: Tests are clean and easy to understand
- **Scalability**: Easy to add new pages and tests
- **Consistency**: All pages behave the same way

## 📚 Next Steps

1. Create more page objects as you build features
2. Add them to POManager
3. Write comprehensive test suites
4. Set up CI/CD integration
5. Add visual regression testing
6. Implement API test utilities if needed
