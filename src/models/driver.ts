import type { Integer } from 'neo4j-driver';

export interface Driver {
  driverId: Integer;
  forename: string;
  surname: string;
}
