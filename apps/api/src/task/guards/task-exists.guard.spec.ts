import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskExistsGuard } from './task-exists.guard';

describe('TaskExistsGuard', () => {
  let guard: TaskExistsGuard;
  let repository: jest.Mocked<Repository<Task>>;

  beforeEach(async () => {
    // Create mock repository
    const mockRepository = {
      existsBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskExistsGuard,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    guard = module.get<TaskExistsGuard>(TaskExistsGuard);
    repository = module.get(getRepositoryToken(Task));
  });

  // Helper function to create mock execution context
  const createMockContext = (taskId: string): ExecutionContext => {
    const mockRequest = {
      params: { id: taskId },
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
  };

  describe('canActivate', () => {
    it('should return true when task exists', async () => {
      // Arrange
      const mockContext = createMockContext('test-id');
      repository.existsBy.mockResolvedValue(true);

      // Act
      const result = await guard.canActivate(mockContext);

      // Assert
      expect(result).toBe(true);
      expect(repository.existsBy).toHaveBeenCalledWith({ id: 'test-id' });
      expect(repository.existsBy).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      // Arrange
      const mockContext = createMockContext('non-existent-id');
      repository.existsBy.mockResolvedValue(null);

      // Act & Assert
      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.existsBy).toHaveBeenCalledWith({
        id: 'non-existent-id',
      });
      expect(repository.existsBy).toHaveBeenCalledTimes(1);
    });
  });
});
