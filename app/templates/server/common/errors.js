import l from './logger';

export const handleErrorAsync = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (error) {
    l.error(`catching async error ${error}`);
    next(error);
  }
};
