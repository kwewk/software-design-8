import { createFileRoute } from '@tanstack/react-router';
import { MealListPage } from '../features/meals/pages/MealListPage';

export const Route = createFileRoute('/meals')({
	component: MealListPage,
});