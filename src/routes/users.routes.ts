import { Hono } from 'hono';
import { UserController } from '../controllers/users.controller';

const usersRoutes = new Hono();

const userController = new UserController();

usersRoutes.get('/', userController.getAllUsers);
usersRoutes.get('/:id', userController.getUserById);
usersRoutes.post('/', userController.createUser);
usersRoutes.put('/:id', userController.updateUser);
usersRoutes.delete('/:id', userController.deleteUser);

export { usersRoutes };
