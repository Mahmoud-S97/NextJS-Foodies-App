// 'use client'

import {use} from 'react';

const MealDetailsPage = async ({ params }) => {

    const {mealSlug} =  await params;
    console.log('MealSlug: ', mealSlug);

    return (
        <main>
            <h1>Meals' Details Page!</h1>
            <h3>{mealSlug}</h3>
        </main>
    )
}

export default MealDetailsPage;