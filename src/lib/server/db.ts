import { dev } from '$app/environment';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg_pkg from 'pg';
import {
	LOCAL_POSTGRES_USER,
	LOCAL_POSTGRES_PASSWORD,
	LOCAL_POSTGRES_DATABASE,
	LOCAL_POSTGRES_HOST,
	DATABASE_URL
} from '$env/static/private';
const { Pool } = pg_pkg;

let connectionString: string;
if (dev) {
	// Note: dev will be false for playwright testing
	connectionString =
		'postgres://' +
		LOCAL_POSTGRES_USER +
		':' +
		LOCAL_POSTGRES_PASSWORD +
		'@' +
		LOCAL_POSTGRES_HOST +
		':' +
		5432 +
		'/' +
		LOCAL_POSTGRES_DATABASE;
} else {
	connectionString = DATABASE_URL + '?sslmode=require';
}

const pool = new Pool({
	connectionString: connectionString
});

export const db = drizzle(pool);
