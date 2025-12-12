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
 * Supports both enum keys (QAT, UAT, PROD) and full URLs
 * Default to QAT if TEST_ENV not specified
 * 
 * Usage: 
 *   TEST_ENV=QAT npm test
 *   TEST_ENV=UAT npm test
 *   TEST_ENV=PROD npm test
 */
function getEnvironmentUrl(): string {
  const envKey = process.env.TEST_ENV?.toUpperCase();
  
  // If TEST_ENV matches an enum key (QAT, UAT, PROD), return the corresponding URL
  if (envKey && ENV[envKey]) {
    return ENV[envKey];
  }
  
  // If TEST_ENV is a full URL, use it directly
  if (process.env.TEST_ENV && process.env.TEST_ENV.startsWith('http')) {
    return process.env.TEST_ENV;
  }
  
  // Default to QAT environment
  return ENV.QAT;
}

export const CURRENT_ENV = getEnvironmentUrl();

// API endpoints (if needed in future)
export const API_ENDPOINTS = {
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  payments: '/api/payments'
};