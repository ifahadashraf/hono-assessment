import { UserController } from './users.controller';

interface MockedContext {
  req: {
    json: jest.Mock;
    param: jest.Mock;
    query: jest.Mock;
  };
  json: jest.Mock;
}

const getUsers = jest.fn();
const getUserById = jest.fn();
const getUserByEmail = jest.fn();
const addUser = jest.fn();
const updateUser = jest.fn();
const deleteUser = jest.fn();
const getTotalUsersCount = jest.fn();

jest.mock('../repository/users.repository', () => ({
  UsersRepository: jest.fn().mockImplementation(() => ({
    getUsers,
    getUserById,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
    getTotalUsersCount,
  })),
}));

describe('UserController', () => {
  let userController: UserController;
  let mockContext: MockedContext;

  beforeEach(() => {
    userController = new UserController();
    mockContext = {
      req: {
        json: jest.fn(),
        param: jest.fn(),
        query: jest.fn((x: string) => {
          if (x == 'page') return '1';
          if (x == 'limit') return '10';
          return '';
        }),
      },
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all users', async () => {
    const mockUsers = [{ id: '1', name: 'John Doe', email: 'john@example.com' }];
    getTotalUsersCount.mockReturnValue(1);
    getUsers.mockResolvedValue(mockUsers);

    await userController.getAllUsers(mockContext as never);

    expect(mockContext.json).toHaveBeenCalledWith({"data": [{"email": "john@example.com", "id": "1", "name": "John Doe"}], "meta": {"limit": 10, "page": 1, "total": 1, "totalPages": 1}});
  });

  it('should fetch a user by ID', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    getUserById.mockResolvedValue(mockUser);
    mockContext.req.param.mockReturnValue('1');

    await userController.getUserById(mockContext as never);

    expect(mockContext.json).toHaveBeenCalledWith(mockUser);
  });

  it('should return error if user is not found', async () => {
    getUserById.mockResolvedValue(undefined);
    mockContext.req.param.mockReturnValue('1');

    await userController.getUserById(mockContext as never);

    expect(mockContext.json).toHaveBeenCalledWith({ error: 'User not found' }, 404);
  });
});
