'use server';

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

const isInvalidText = (text) => {
    return !text || text.trim() === '';
}

export const shareMeal = async (prevState, formData) => {

    const meal = {
        title: formData.get('title'),
        image: formData.get('image'),
        summary: formData.get('summary'),
        instructions: formData.get('instructions'),
        creator: formData.get('name'),
        creator_email: formData.get('email')
    }

    const errors = {};

    if (isInvalidText(meal.title)) errors.title = 'Title field is required.';
    if (isInvalidText(meal.summary)) errors.summary = 'Summary field is required.';
    if (isInvalidText(meal.instructions)) errors.instructions = 'Instructions field is required.';
    if (isInvalidText(meal.creator)) errors.creator = 'Creator name field is required.';
    if (isInvalidText(meal.creator_email)) errors.creator_email = 'Email field is required.';
    if (!isInvalidText(meal.creator_email) && !meal.creator_email.includes('@')) errors.creator_email = 'Invalid email.'
    if (!meal.image || meal.image.size === 0) errors.image = 'No meal image uploaded.'

    if (Object.keys(errors).length > 0) {
        return errors;
    }

    await saveMeal(meal);
    revalidatePath('/meals');
    redirect('/meals');
}