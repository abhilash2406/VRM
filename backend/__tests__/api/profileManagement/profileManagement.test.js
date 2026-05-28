import { jest } from '@jest/globals';
import * as controller from '../../../api/profileManagement/controller.js';

describe('Profile Management', () => {
  describe('Controller Functions', () => {
    it('should define core profile operations', () => {
      expect(controller.viewProfile).toBeDefined();
      expect(controller.getUserMessages).toBeDefined();
      expect(controller.getMsgToRead).toBeDefined();
      expect(controller.dltFeedback).toBeDefined();
      expect(controller.ProfilePermissions).toBeDefined();
      expect(controller.changePassword).toBeDefined();
    });
  });
});
