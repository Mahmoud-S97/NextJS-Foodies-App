const sql = require('better-sqlite3');
const db = sql('meals.db');

export const getMeals = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // throw new Error('Loading meals failed!');
    return db.prepare(' select * from meals').all();
}