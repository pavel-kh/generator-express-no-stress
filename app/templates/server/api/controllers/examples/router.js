import * as express from 'express';
import controller from './controller';
import handleErrorAsync from "../../../common/errors";

export default express
  .Router()
  .post('/', handleErrorAsync(controller.create))
  .get('/', handleErrorAsync(controller.all))
  .get('/:id', handleErrorAsync(controller.byId));
