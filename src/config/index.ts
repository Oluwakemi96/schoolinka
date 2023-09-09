import { devEnv, prodEnv } from './env/index';
 
const { SCHOOLINKA_NODE_ENV } = process.env;

const config = SCHOOLINKA_NODE_ENV === 'development' ? devEnv 
  : prodEnv 
    

export default config;