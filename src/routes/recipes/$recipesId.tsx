import { createFileRoute } from '@tanstack/react-router';
import { RecipeDetailPage } from '../../features/recipes/pages/RecipeDetailPage';

export const Route = createFileRoute('/recipes/$recipesId')({
	component: RecipeDetailPage,
});