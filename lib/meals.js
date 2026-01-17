const sql = require('better-sqlite3');
const db = sql('meals.db');

// Get all meals from the db
export const getMeals = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // throw new Error('Loading meals failed!');
    return db.prepare('SELECT * FROM meals').all();
}

// Get a meal by a provided slug from the db
export const getMeal = (slug) => {
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}