import { auth, driver } from 'neo4j-driver';

export const db = driver(
  import.meta.env.DB_URI,
  auth.basic(import.meta.env.DB_USERNAME, import.meta.env.DB_PASSWORD)
);
