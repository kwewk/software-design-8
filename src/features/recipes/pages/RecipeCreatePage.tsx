import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRecipe } from '../api';
import type { ReactElement } from "react";
import { isAxiosError } from "axios";

const recipeSchema = z.object({
	description: z.string().min(10, "Description is too short"),
	cookingTime: z.number().positive("Cooking time must be positive"),
	mealId: z.number().positive("Meal ID is required"),
	userId: z.number().positive("User ID is required"),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

export function RecipeCreatePage(): ReactElement {
	const createRecipeMutation = useCreateRecipe();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<RecipeFormData>({
		resolver: zodResolver(recipeSchema),
	});

	const onSubmit = (data: RecipeFormData): void => {
		console.log('Form data:', data); // Для отладки

		createRecipeMutation.mutate(data as any, {
			onSuccess: () => {
				console.log('Recipe created successfully!');
				reset();
			},
			onError: (error: unknown) => {
				console.error('Error creating recipe:', error);
				if (isAxiosError(error)) {
					if (error.response?.status === 409) {
						alert("A recipe with this data already exists.");
						return;
					}
					if (error.response?.status === 404) {
						alert("User or Meal not found. Check IDs.");
						return;
					}
				}
				alert("Unexpected error occurred.");
			},
		});
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Create New Recipe</h1>
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
				</div>

				<div>
					<label className="block font-medium" htmlFor="userId">User ID</label>
					<input
						id="userId"
						type="number"
						{...register('userId', { valueAsNumber: true })}
						className="w-full p-2 border rounded"
					/>
					{errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>}
				</div>

				<button
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 cursor-pointer"
					disabled={createRecipeMutation.isPending}
					type="submit"
				>
					{createRecipeMutation.isPending ? 'Creating...' : 'Create Recipe'}
				</button>

				{createRecipeMutation.isPending && <p className="text-blue-500">Sending...</p>}
				{createRecipeMutation.isSuccess && <p className="text-green-500">Recipe created successfully!</p>}
				{createRecipeMutation.isError && <p className="text-red-500">Error: {createRecipeMutation.error?.message}</p>}
			</form>
		</div>
	);
}