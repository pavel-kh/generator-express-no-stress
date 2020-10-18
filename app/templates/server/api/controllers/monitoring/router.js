import * as express from 'express';
import controller from './controller';
import handleErrorAsync from '../../../common/errors';

export default express.Router()
  .get('/ping', handleErrorAsync(controller.ping));
