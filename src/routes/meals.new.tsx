import { createFileRoute } from '@tanstack/react-router';
import { MealCreatePage } from '../features/meals/pages/MealCreatePage';

export const Route = createFileRoute('/meals/new')({
	component: MealCreatePage,
});