import pgPromise from 'pg-promise';
import promise from 'bluebird';
import config from '../index';

const pg = pgPromise({ promiseLib: promise, noWarnings: true });
const db = pg(config.SCHOOLINKA_URL);

export { db };