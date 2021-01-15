export function generateTableQuery (tableName: string, colNames: Array<string>, args?: string): string {
  return `SELECT \`${colNames.join('`, `')}\` FROM \`${tableName}\` ${args}`
}

export function generateFormQueries (tableName: string, primaryKey: string, colNames: Array<string>): Queries {
  return {
    select: `SELECT \`${colNames.join('`, `')}\` FROM \`${tableName}\` WHERE \`${primaryKey}\` = ?`,
    insert: `INSERT INTO \`${tableName}\` (\`${colNames.join('`, `')}\`) VALUES (${colNames.map(() => '?').join()})`,
    update: `UPDATE \`${tableName}\` SET ${colNames.map(name => `\`${name}\` = ?`).join()} WHERE \`${primaryKey}\` = ?`,
    delete: `DELETE FROM \`${tableName}\` WHERE \`${primaryKey}\` = ?`
  }
}

interface Queries {
    select: string
    insert: string
    update: string
    delete: string
}
