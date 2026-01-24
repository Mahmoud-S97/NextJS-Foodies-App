import Image from 'next/image';
import classes from './page.module.css';
import { getMeal } from '@/lib/meals';
import { notFound } from 'next/navigation';
import { S3_BASE_URL } from '@/services/aws/s3';

export const generateMetadata = async ({ params }) => {
    const meal = getMeal(params.mealSlug);
    if (!meal) {
        notFound();
    }
    return {
        title: meal.title,
        description: meal.summary
    }
}

const MealDetailsPage = ({ params }) => {

    const meal = getMeal(params.mealSlug);

    if (!meal) {
        notFound();
    }

    meal.instructions = meal.instructions.replace(/\n/g, '<br />');

    return (
        <>
            <header className={classes.header}>
                <div className={classes.image}>
                    <Image src={`${S3_BASE_URL}/${meal.image}`} fill alt={meal.title} />
                </div>
                <div className={classes.headerText}>
                    <h1>{meal.title}</h1>
                    <p className={classes.creator}>
                        by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
                    </p>
                    <p className={classes.summary}>{meal.summary}</p>
                </div>
            </header>
            <main>
                <p className={classes.instructions} dangerouslySetInnerHTML={{
                    __html: meal.instructions
                }}></p>
            </main>
        </>
    )
}

export default MealDetailsPage;