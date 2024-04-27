import { auth, driver } from 'neo4j-driver';

export const db = driver(
  import.meta.env.NEO4J_DB_URI,
  auth.basic(import.meta.env.NEO4J_USERNAME, import.meta.env.NEO4J_PASSWORD)
);
