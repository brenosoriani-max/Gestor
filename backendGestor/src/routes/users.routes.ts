import { Router } from 'express';
import { createUserFactory } from '../modules/users/factories/CreateUserFactory';
import { findByIdUserFactory } from '../modules/users/factories/FindByIdUserFactory';
import { findAllUserFactory } from '../modules/users/factories/FindAllUseractory';
import { findUserByEmailFactory } from '../modules/users/factories/FindUserByEmailFactory';
import { updateUserFactory } from '../modules/users/factories/UpdateUserFactory';
import { loginFactory } from '../modules/users/factories/LoginFactory';
import { deleteUserFactory } from '../modules/users/factories/DeleteUserFactory';
import { resetPassowrdFactory } from '../modules/users/factories/ResetPassowordFactory';

const router = Router();

router.post('/users', createUserFactory);

router.get('/users', findAllUserFactory);

router.get('/users/:id', findByIdUserFactory);

router.get('/user', findUserByEmailFactory);

router.patch('/users/:id', updateUserFactory);

router.post('/login', loginFactory);

router.delete('/users/:id', deleteUserFactory);

router.post('/reset-password', resetPassowrdFactory);

export default router;
