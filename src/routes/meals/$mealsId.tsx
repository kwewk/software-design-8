import { createFileRoute } from '@tanstack/react-router';
import { MealDetailPage } from '../../features/meals/pages/MealDetailPage';

export const Route = createFileRoute('/meals/$mealsId')({
	component: MealDetailPage,
});