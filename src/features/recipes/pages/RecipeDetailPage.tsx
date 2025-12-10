import { useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRecipe, useUpdateRecipe } from '../api';
import { type ReactElement, useEffect } from "react";
import type { Recipe } from "../types.ts";

const recipeSchema = z.object({
	description: z.string().min(10, "Description is too short"),
	cookingTime: z.number().positive("Cooking time must be positive"),
	mealId: z.number().positive("Meal ID is required"),
});

type RecipeResponse = {
	message: string;
	data: Recipe;
}

type RecipeFormData = z.infer<typeof recipeSchema>;

export function RecipeDetailPage(): ReactElement {
	const { recipesId } = useParams({ from: '/recipes/$recipesId' });
	const { data: recipeResponse, isLoading, isError } = useRecipe(recipesId);
	const recipe = (recipeResponse as unknown as RecipeResponse)?.data;
	const updateRecipeMutation = useUpdateRecipe();

	const { register, handleSubmit, reset, formState: { errors } } = useForm<RecipeFormData>({
		resolver: zodResolver(recipeSchema),
	});

	useEffect(() => {
		if (recipe) {
			reset({
				description: recipe.description,
				cookingTime: recipe.cookingTime,
				mealId: Number(recipe.meal.id),
			});
		}
	}, [recipe, reset]);

	const onSubmit = (data: RecipeFormData): void => {
		console.log('Submitting update:', data);
		updateRecipeMutation.mutate({ id: recipesId, data });
	};

	if (isLoading) return <div>Loading recipe details...</div>;
	if (isError || !recipe) return <div>Recipe not found or failed to load.</div>;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>
			<div className="mb-4 p-4 bg-gray-100 rounded">
				<p className="text-sm text-gray-600">
					<strong>Author:</strong> {recipe.user.name} (ID: {recipe.user.id})
				</p>
				<p className="text-sm text-gray-600 mt-1">
					User cannot be changed after creation
				</p>
			</div>

			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label className="block font-medium" htmlFor="description">Description</label>
					<textarea
						id="description"
						{...register('description')}
						className="w-full p-2 border rounded"
						rows={4}
					/>
					{errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
				</div>

				<div>
					<label className="block font-medium" htmlFor="cookingTime">Cooking Time (minutes)</label>
					<input
						id="cookingTime"
						type="number"
						{...register('cookingTime', { valueAsNumber: true })}
						className="w-full p-2 border rounded"
					/>
					{errors.cookingTime && <p className="text-red-500 text-sm mt-1">{errors.cookingTime.message}</p>}
				</div>

				<div>
					<label className="block font-medium" htmlFor="mealId">Meal ID</label>
					<input
						id="mealId"
						type="number"
						{...register('mealId', { valueAsNumber: true })}
						className="w-full p-2 border rounded"
					/>
					{errors.mealId && <p className="text-red-500 text-sm mt-1">{errors.mealId.message}</p>}
					<p className="text-sm text-gray-500 mt-1">
						Current meal: {recipe.meal.name} (ID: {recipe.meal.id})
					</p>
				</div>

				<button
					className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 cursor-pointer"
					disabled={updateRecipeMutation.isPending}
					type="submit"
				>
					{updateRecipeMutation.isPending ? 'Saving...' : 'Save Changes'}
				</button>

				{updateRecipeMutation.isError && (
					<p className="text-red-500 mt-2">
						Error: {updateRecipeMutation.error?.message}
					</p>
				)}
			</form>
		</div>
	);
}