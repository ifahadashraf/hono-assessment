import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    "^.+\\.spec.(js|jsx|ts|tsx)$": "ts-jest",
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/"
  ],
};

export default config;
