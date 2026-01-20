import fs from 'node:fs';
const sql = require('better-sqlite3');
const db = sql('meals.db');
import slugify from 'slugify';
import xss from 'xss';

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

export const saveMeal = async (meal) => {
    meal.slug = slugify(meal.title, { lower: true });
    meal.instructions = xss(meal.instructions);

    const extention = meal.image.name.split('.').pop();
    const fileName = `${meal.slug}-${new Date().toISOString()}.${extention}`;

    const stream = fs.createWriteStream(`public/images/${fileName}`);

    const bufferedImage = await meal.image.arrayBuffer();

    stream.write(Buffer.from(bufferedImage, (error) => {
        if (error) {
            throw new Error('Saving image failed!');
        }
    }));

    meal.image = `/images/${fileName}`;

    db.prepare(`
        INSERT INTO meals
            (slug, title, image, summary, instructions, creator, creator_email)
            VALUES (
                @slug,
                @title,
                @image,
                @summary,
                @instructions,
                @creator,
                @creator_email
            )
    `).run(meal);
}