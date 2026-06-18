import { jest } from '@jest/globals';
import path from 'path';

jest.unstable_mockModule('swagger-jsdoc', () => ({
  default: jest.fn().mockReturnValue({ info: { title: 'Mock Swagger' } }),
}));

describe('Swagger Config', () => {
  let swaggerJsdoc;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();

    swaggerJsdoc = (await import('swagger-jsdoc')).default;
  });

  it('should initialize swagger configuration with correct APIs and definitions', async () => {
    const swaggerSpec = (await import('../../src/config/swagger.js')).default;

    expect(swaggerJsdoc).toHaveBeenCalled();
    const callArgs = swaggerJsdoc.mock.calls[0][0];

    expect(callArgs.definition.openapi).toBe('3.0.0');
    expect(callArgs.definition.info.title).toBe('Truck Management System');

    // Check if APIs are constructed correctly (ending with index.js for routes)
    expect(callArgs.apis).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/api\/authentication\/index\.js$/),
        expect.stringMatching(/api\/truckManagement\/index\.js$/),
      ])
    );

    expect(swaggerSpec).toEqual({ info: { title: 'Mock Swagger' } });
  });
});
