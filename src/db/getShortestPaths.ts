import type { Path } from 'neo4j-driver';
import type { Edge, Node } from 'vis-network';
import type { Driver } from '@/models/driver';

import { db } from '.';

export async function getShortestPaths(source: string, dest: string) {
  let nodes: Node[] = [];
  let edges: Edge[] = [];
  let numPaths = 0;
  let degsOfSeparation = 0;

  const { records } = await db.executeQuery(
    `MATCH (n:Driver)
    WHERE
      (n.forename + " " + n.surname) = $source
      OR (n.forename + " " + n.surname) = $dest
    WITH collect(n) AS nodes
    UNWIND nodes AS s
    UNWIND nodes AS d
    WITH *
    WHERE
      (s.forename + " " + s.surname) = $source
      AND (d.forename + " " + d.surname) = $dest
    MATCH path = (s)-[:WAS_TEAMMATES_WITH *ALLSHORTEST (r, n | 1)]-(d)
    RETURN path;`,
    { source, dest }
  );

  numPaths = records.length;
  degsOfSeparation =
    records.length > 0 ? (records[0].get('path') as Path).length : 0;

  const pairsOfRelatedDrivers = records.flatMap((rec) =>
    (rec.get('path') as Path).segments.map(
      ({ start, end }) => [start.properties, end.properties] as Driver[]
    )
  );

  nodes = [
    ...new Map(
      pairsOfRelatedDrivers.flatMap((pair) =>
        pair.map(({ driverId, forename, surname }) => [
          driverId.toNumber(),
          forename + ' ' + surname
        ])
      )
    ).entries()
  ].map(([id, label]) => ({ id, label }));

  edges = [
    ...new Set(
      pairsOfRelatedDrivers.map(
        ([from, to]) => from.driverId.toString() + '-' + to.driverId.toString()
      )
    ).values()
  ].map((pair) => {
    const [from, to] = pair.split('-').map(Number);

    return { from, to };
  });

  return { nodes, edges, numPaths, degsOfSeparation };
}
