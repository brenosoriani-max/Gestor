import { Router } from 'express';

import usersRoutes from './users.routes';
import reportsRoutes from './reports.routes';
import operationsRoutes from './operations.routes';
import categoriesRoutes from './categories.routes';
import banksRoutes from './banks.routes';
import walletsRoutes from './wallets.routes';

const routes = Router();

routes.use(usersRoutes);
routes.use(reportsRoutes);
routes.use(operationsRoutes);
routes.use(categoriesRoutes);
routes.use(banksRoutes);
routes.use(walletsRoutes);
export { routes };
