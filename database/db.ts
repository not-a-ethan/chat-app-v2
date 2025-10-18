import sqlite3 from 'sqlite3';
const sqlite = sqlite3.verbose();
const db: any = new sqlite.Database('./database/db.db');

export const getAll: any = async (query: string, params: any) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err: any, row: any) => {
            if (err) {
                reject(err);
            }
            resolve(row);
            });
    });
};

export function changeDB(query: string, parms: any): boolean {
  db.serialize(() => {
      db.run(query, parms, (err: {message: string}) => {
        if (err) {
          console.error('Error proforming query:', err.message);
          return false;
        } else {
          return true;
        }
      });
    });
    
    return true;
};