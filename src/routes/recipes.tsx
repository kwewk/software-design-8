import { createFileRoute } from '@tanstack/react-router';
import { RecipeListPage } from '../features/recipes/pages/RecipeListPage';

export const Route = createFileRoute('/recipes')({
	component: RecipeListPage,
});