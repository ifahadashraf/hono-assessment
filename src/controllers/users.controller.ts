import { type Context } from 'hono';
import { UsersRepository } from '../repository/users.repository';
import { UserCreateRequestSchema, UserUpdateRequestSchema } from '../types/users';

export class UserController {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  getAllUsers = async (c: Context) => {
    try {
      const page = parseInt(c.req.query('page') || '1', 10);
      const limit = parseInt(c.req.query('limit') || '10', 10);

      const users = await this.usersRepository.getUsers(page, limit);
      const totalUsers = this.usersRepository.getTotalUsersCount();
      const totalPages = Math.ceil(totalUsers / limit);

      return c.json({
        data: users,
        meta: {
          total: totalUsers,
          page,
          limit,
          totalPages,
        },
      });
    } catch (error) {
      console.log(error);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }
  }

  getUserById = async (c: Context) => {
    try {
      const user = await this.usersRepository.getUserById(c.req.param('id'));
      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }
      return c.json(user);
    } catch (error) {
      console.log(error);
      return c.json({ error: 'Failed to fetch user' }, 500);
    }
  }

  createUser = async (c: Context) => {
    try {
      const body = await c.req.json();

      const { data: userData, error } = UserCreateRequestSchema.safeParse(body);

      if (error) {
        return c.json({ error: error }, 400);
      }

      const userFound = await this.usersRepository.getUserByEmail(body.email);

      if (userFound) {
        return c.json({ error: 'User with this email already exists' }, 400);
      }

      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
      };

      await this.usersRepository.addUser(newUser);
      return c.json(newUser, 201);
    } catch (error) {
      console.log(error);
      return c.json({ error: 'Failed to add user' }, 500);
    }
  }

  updateUser = async (c: Context) => {
    try {
      const updatedUser = await c.req.json();

      const { data: userUpdate, error } = UserUpdateRequestSchema.safeParse(updatedUser);

      if (error) {
        return c.json({ error: error }, 400);
      }

      await this.usersRepository.updateUser(c.req.param('id'), userUpdate);
      return c.json({ message: 'User updated successfully' });
    } catch (error) {
      console.log(error);
      return c.json({ error: 'Failed to update user' }, 500);
    }
  }

  deleteUser = async (c: Context) => {
    try {
      await this.usersRepository.deleteUser(c.req.param('id'));
      return c.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.log(error);
      return c.json({ error: 'Failed to delete user' }, 500);
    }
  }
}
