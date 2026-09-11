import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { createOperationFactory } from '../modules/operations/factories/CreateOperationFactory';
import { getOperationsByUserFactory } from '../modules/operations/factories/GetOperationsByUserFactory';
import { updateOperationFactory } from '../modules/operations/factories/UpdateOperationFactory';
import { deleteOperationFactory } from '../modules/operations/factories/DeleteOperationFactory';
import { listOperationFactory } from '../modules/operations/factories/ListOperationFactory';

const router = Router();

router.post('/operations', createOperationFactory);

router.get('/operations/:idUser', getOperationsByUserFactory);

router.get('/operations', listOperationFactory);

router.patch('/operations/:idOperation', updateOperationFactory);

router.delete('/operations/:idOperation', deleteOperationFactory);

export default router;
