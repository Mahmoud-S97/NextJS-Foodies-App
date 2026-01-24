import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
const sql = require('better-sqlite3');
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
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

    const bufferedImage = await meal.image.arrayBuffer();

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(bufferedImage),
        ContentType: meal.image.type
    });

    await s3.send(command);

    meal.image = fileName;

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