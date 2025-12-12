// tests/config/environment.ts

/**
 * Environment Configuration
 * Manages different environment URLs for testing
 */

export enum Environment {
  QAT = 'QAT',
  UAT = 'UAT',
  PROD = 'PROD'
}

// Environment URLs mapping
export const ENV: Record<string, string> = {
  QAT: 'https://portal.qat.anddone.com/#/login',
  UAT: 'https://portal.uat.anddone.com/#/login',
  PROD: 'https://portal.anddone.com/#/login'
};

/**
 * Get current environment URL
 * Default to QAT if TEST_ENV not specified
 * 
 * Usage: TEST_ENV=UAT npm test
 */
export const CURRENT_ENV = process.env.TEST_ENV || ENV.QAT;

// API endpoints (if needed in future)
export const API_ENDPOINTS = {
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  payments: '/api/payments'
};