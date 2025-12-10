import { createFileRoute } from '@tanstack/react-router';
import { RecipeCreatePage } from '../features/recipes/pages/RecipeCreatePage';

export const Route = createFileRoute('/recipes/new')({
	component: RecipeCreatePage,
});