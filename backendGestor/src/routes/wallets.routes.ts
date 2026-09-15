import { Router } from 'express';
import { createWalletFactory } from '../modules/wallets/factories/CreateWalletFactory';
import { deleteWalletFactory } from '../modules/wallets/factories/DeleteWalletFactory';
import { listWalletsByUserFactory } from '../modules/wallets/factories/ListWalletsByUserFactory';
import { updateWalletFactory } from '../modules/wallets/factories/UpdateWalletFactory';

const routes = Router();

routes.post('/wallets', createWalletFactory);
routes.get('/wallets/:idUser', listWalletsByUserFactory);
routes.patch('/wallets/:id', updateWalletFactory);
routes.delete('/wallets/:id', deleteWalletFactory);

export default routes;
