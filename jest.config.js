const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const customJestConfig = {
  // We move the environment-specific configs into "projects"
  projects: [
    {
      displayName: 'frontend',
      testEnvironment: 'jest-environment-jsdom',
      // Run this project for components and hooks
      testMatch: [
        '<rootDir>/src/components/**/*.test.{ts,tsx}', 
        '<rootDir>/src/hooks/**/*.test.{ts,tsx}',
        '<rootDir>/src/util/**/*.test.{ts,tsx}',
        '<rootDir>/src/types/**/*.test.{ts,tsx}'
      ],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      transform: { 
        '^.+\\.(t|j)sx?$': [
          '@swc/jest',
          {
            jsc: {
              transform: {
                react: {
                  runtime: 'automatic', // This fixes "React is not defined"
                },
              },
            },
          },
        ] 
      },
      moduleNameMapper: {
        // Handle module aliases (if you use them in tsconfig.json)
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@styles/(.*)$': '<rootDir>/src/styles/$1',
        '^@type/(.*)$': '<rootDir>/src/types/$1',
        '^@util/(.*)$': '<rootDir>/src/util/$1',
      },
    },
    {
      displayName: 'api',
      testEnvironment: 'node',
      // Run this project for your API routes
      testMatch: [
        '<rootDir>/src/app/api/**/*.test.{ts,tsx}',
        '<rootDir>/src/infrastructure/**/*.test.{ts,tsx}',
      ],
      // You can use a separate setup file if the API needs different globals
      setupFilesAfterEnv: ['<rootDir>/jest.setup.api.js'], 
      transform: { '^.+\\.(t|j)sx?$': ['@swc/jest'] },
      moduleNameMapper: {
        '^@type/(.*)$': '<rootDir>/src/types/$1',
        '^@util/(.*)$': '<rootDir>/src/util/$1',
        '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
      },
    }
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)