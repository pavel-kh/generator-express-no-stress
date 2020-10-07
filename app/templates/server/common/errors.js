import l from './logger';

export default (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (error) {
    l.error(`catching async error ${error}`);
    next(error);
  }
};
