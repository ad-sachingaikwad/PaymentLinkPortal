# GitHub Actions CI/CD Setup

This project uses GitHub Actions for automated testing and continuous integration.

## 📋 Workflows

### 1. **Playwright Tests CI/CD** (`.github/workflows/playwright.yml`)
**Triggers:**
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main` or `master`
- Manual trigger from GitHub UI

**What it does:**
- ✅ Runs tests on 3 browsers (Chromium, Firefox, WebKit)
- ✅ Generates Allure reports
- ✅ Uploads test artifacts
- ✅ Deploys Allure report to GitHub Pages (on main branch)

---

### 2. **Smoke Tests** (`.github/workflows/smoke-tests.yml`)
**Triggers:**
- Every push to any branch

**What it does:**
- ✅ Runs only `@smoke` tagged tests
- ✅ Fast feedback (runs on Chromium only)
- ✅ Perfect for quick validation

---

### 3. **Nightly Regression Tests** (`.github/workflows/nightly-tests.yml`)
**Triggers:**
- Scheduled: Every night at 2 AM UTC
- Manual trigger

**What it does:**
- ✅ Runs all `@regression` tests
- ✅ Tests on multiple browsers and environments
- ✅ Comprehensive coverage

---

## 🚀 Setup Instructions

### Step 1: Enable GitHub Actions
1. Go to your repository on GitHub
2. Click on **"Actions"** tab
3. Enable workflows if prompted

### Step 2: Configure GitHub Pages (for Allure Reports)
1. Go to **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: Select **`gh-pages`** → **`/ (root)`**
4. Click **Save**
5. After first successful run, your Allure report will be available at:
   ```
   https://YOUR-USERNAME.github.io/PaymentLinkPortal/
   ```

### Step 3: Add Secrets (Optional)
For sensitive data like API keys or different environment URLs:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add secrets:
   - `TEST_ENV` - Custom test environment URL
   - `SLACK_WEBHOOK` - For notifications (if using)

### Step 4: Protect Main Branch (Recommended)
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable:
   - ✅ Require status checks before merging
   - ✅ Require branches to be up to date
   - ✅ Select: "Playwright Tests CI/CD"

---

## 🎯 How to Use

### Run Tests Manually
1. Go to **Actions** tab
2. Select **"Playwright Tests CI/CD"**
3. Click **"Run workflow"**
4. Choose environment (QAT/UAT)
5. Click **"Run workflow"** button

### View Test Reports
After workflow completes:
1. Click on the workflow run
2. Scroll to **Artifacts** section
3. Download:
   - `playwright-report-chromium` - Playwright HTML report
   - `allure-report` - Allure HTML report
   - `screenshots-*` - Screenshots (if tests failed)

### View Allure Report on GitHub Pages
After first successful run on `main` branch:
```
https://YOUR-USERNAME.github.io/PaymentLinkPortal/
```

---

## 📊 Workflow Matrix

| Workflow | Trigger | Browsers | Tags | Duration |
|----------|---------|----------|------|----------|
| CI/CD | Push/PR | All 3 | All tests | ~15 min |
| Smoke | Every push | Chromium | @smoke | ~5 min |
| Nightly | Scheduled | All 3 | @regression | ~30 min |

---

## 🔧 Customize Workflows

### Change Schedule for Nightly Tests
Edit `.github/workflows/nightly-tests.yml`:
```yaml
schedule:
  - cron: '0 2 * * *'  # 2 AM UTC daily
  # - cron: '0 */6 * * *'  # Every 6 hours
  # - cron: '0 9 * * 1-5'  # 9 AM UTC on weekdays
```

### Run Specific Tests
Edit workflow files to add grep patterns:
```yaml
- name: Run specific tests
  run: npx playwright test --grep "@smoke|@critical"
```

### Add Email Notifications
Install email action:
```yaml
- name: Send email on failure
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Test Failed - ${{ github.repository }}
    body: Tests failed on ${{ github.ref }}
```

---

## 🐛 Troubleshooting

### Tests fail in CI but pass locally
- Check environment URLs in workflow
- Verify secrets are configured
- Check browser versions: `npx playwright install --with-deps`

### Allure report not deploying
- Ensure `gh-pages` branch exists
- Check GitHub Pages settings
- Verify `GITHUB_TOKEN` has proper permissions

### Workflow not triggering
- Check branch names in workflow trigger
- Verify `.github/workflows/` directory structure
- Check workflow syntax with GitHub's validator

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [Allure Report](https://docs.qameta.io/allure/)

---

## 📝 Best Practices

1. ✅ Run smoke tests on every commit
2. ✅ Run full suite on PR to main
3. ✅ Schedule regression tests nightly
4. ✅ Keep workflow files simple and maintainable
5. ✅ Use matrix strategy for multi-browser testing
6. ✅ Upload artifacts for debugging
7. ✅ Protect main branch with status checks

---

**Questions?** Check the workflow files for detailed comments and configurations.
