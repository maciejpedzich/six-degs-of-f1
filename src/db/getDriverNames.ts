import { db } from '.';

export async function getDriverNames() {
  const { records } = await db.executeQuery(
    `MATCH (d:Driver)
    RETURN
      (d.forename + " " + d.surname) AS fullname
    ORDER BY
      toUpper(d.surname),
      toUpper(d.forename);`
  );

  const driverNames = records.map((rec) => rec.get('fullname') as string);

  return driverNames;
}
