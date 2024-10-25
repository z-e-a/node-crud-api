import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/?(*.)+(test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {},
  restoreMocks: true,
  resetMocks: true,
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};

export default config;
