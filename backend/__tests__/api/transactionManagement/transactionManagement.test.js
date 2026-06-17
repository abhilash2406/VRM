import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../src/models/transaction.js', () => ({
  default: {
    findAll: jest.fn(),
  },
}));

const transactions = await import('../../../src/models/transaction.js');
const controller = await import('../../../src/api/transactionManagement/controller.js');

describe('Transaction Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Controller Functions', () => {
    it('should list transactions successfully', async () => {
      const mockData = [{ id: '1', amount: 1000, type: 'card' }];
      transactions.default.findAll.mockResolvedValue(mockData);

      const req = {};
      const res = { send: jest.fn() };
      const next = jest.fn();

      await controller.TransactionList(req, res, next);

      expect(transactions.default.findAll).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'transaction listed',
        data: mockData,
      });
    });

    it('should handle errors in TransactionList', async () => {
      const errorMsg = 'Database error';
      transactions.default.findAll.mockRejectedValue(new Error(errorMsg));

      const req = {};
      const res = { send: jest.fn() };
      const next = jest.fn();

      await controller.TransactionList(req, res, next);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: errorMsg,
      });
    });
  });
});
