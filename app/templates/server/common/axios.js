import axios from 'axios';
import * as AxiosLogger from 'axios-logger';

axios.interceptors.request.use(AxiosLogger.requestLogger, AxiosLogger.errorLogger);

axios.interceptors.response.use(AxiosLogger.responseLogger, AxiosLogger.errorLogger);
