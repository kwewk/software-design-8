import { Link, Outlet } from "@tanstack/react-router";
import { useRecipes, useDeleteRecipe } from '../api';
import type { ReactElement } from "react";
import type { Recipe } from "../types";

export type RecipesResponse = {
	message: string;
	data: Array<Recipe>;
}

export function RecipeListPage(): ReactElement {
	const { data: recipesResponse, isLoading, isError, error } = useRecipes();
	const deleteRecipeMutation = useDeleteRecipe();

	const handleDelete = (id: string): void => {
		if (window.confirm('Are you sure you want to delete this recipe?')) {
			deleteRecipeMutation.mutate(id);
		}
	};

	if (isLoading) return <div className="flex items-center justify-center h-screen text-4xl font-bold">Loading...</div>;

	if (isError) return <div className="flex items-center justify-center h-screen text-4xl font-bold">Error loading recipes: {error.message}</div>;

	const recipes = (recipesResponse as unknown as RecipesResponse)?.data;
	if (!recipes || !Array.isArray(recipes)) {
		return <div className="flex items-center justify-center h-screen text-4xl font-bold">No recipes data available</div>;
	}

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Recipes</h1>
				<Link
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					to="/recipes/new"
				>
					Create New Recipe
				</Link>
			</div>
			<Outlet />
			<table className="min-w-full bg-white">
				<thead>
				<tr>
					<th className="py-2 px-4 border-b">Description</th>
					<th className="py-2 px-4 border-b">Cooking Time (min)</th>
					<th className="py-2 px-4 border-b">Meal ID</th>
					<th className="py-2 px-4 border-b">User ID</th>
					<th className="py-2 px-4 border-b">Actions</th>
				</tr>
				</thead>
				<tbody>
				{recipes.map(
					(recipe: Recipe) => (
						<tr key={recipe.id}>
							<td className="py-2 px-4 border-b">
								{recipe.description.length > 50
									? `${recipe.description.substring(0, 50)}...`
									: recipe.description}
							</td>
							<td className="py-2 px-4 border-b text-center">{recipe.cookingTime}</td>
							<td className="py-2 px-4 border-b text-center">{recipe.meal.name}</td>
							<td className="py-2 px-4 border-b text-center">{recipe.user.name}</td>
							<td className="py-2 px-4 border-b text-center">
								<Link
									className="text-indigo-600 hover:text-indigo-900 mr-4"
									to={`/recipes/${String(recipe.id)}`}
								>
									Edit
								</Link>
								<button
									className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
									disabled={deleteRecipeMutation.isPending}
									onClick={() => {
										handleDelete(String(recipe.id));
									}}
								>
									Delete
								</button>
							</td>
						</tr>
					)
				)}
				</tbody>
			</table>
		</div>
	);
}