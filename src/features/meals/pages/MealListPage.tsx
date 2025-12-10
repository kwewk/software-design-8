import { Link, Outlet } from "@tanstack/react-router";
import { useMeals, useDeleteMeal } from '../api';
import type { ReactElement } from "react";
import type { Meal } from "../types";

export type MealsResponse = {
	message: string;
	data: Array<Meal>;
}

export function MealListPage(): ReactElement {
	const { data: mealsResponse, isLoading, isError, error } = useMeals();
	const deleteMealMutation = useDeleteMeal();

	const handleDelete = (id: number): void => {
		if (window.confirm('Are you sure you want to delete this meal?')) {
			deleteMealMutation.mutate(String(id));
		}
	};

	if (isLoading) return <div className="flex items-center justify-center h-screen text-4xl font-bold">Loading...</div>;

	if (isError) return <div className="flex items-center justify-center h-screen text-4xl font-bold">Error loading meals: {error.message}</div>;

	const meals = (mealsResponse as unknown as MealsResponse)?.data || [];

	if (meals.length === 0) {
		return (
			<div className="p-4">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">Meals</h1>
					<Link
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
						to="/meals/new"
					>
						Create New Meal
					</Link>
				</div>
				<div className="text-center text-gray-500 mt-8">
					No meals yet. Click "Create New Meal" to add one!
				</div>
			</div>
		);
	}

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Meals</h1>
				<Link
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					to="/meals/new"
				>
					Create New Meal
				</Link>
			</div>
			<Outlet />
			<table className="min-w-full bg-white">
				<thead>
				<tr>
					<th className="py-2 px-4 border-b">Name</th>
					<th className="py-2 px-4 border-b">Meal Type</th>
					<th className="py-2 px-4 border-b">Photo</th>
					<th className="py-2 px-4 border-b">Actions</th>
				</tr>
				</thead>
				<tbody>
				{meals.map((meal: Meal) => (
					<tr key={meal.id}>
						<td className="py-2 px-4 border-b">{meal.name || '—'}</td>
						<td className="py-2 px-4 border-b">{meal.mealType || '—'}</td>
						<td className="py-2 px-4 border-b text-center">
							{meal.photo ? (
								<img
									src={typeof meal.photo === 'string' ? meal.photo : JSON.stringify(meal.photo)}
									alt={meal.name}
									className="w-12 h-12 object-cover rounded mx-auto"
								/>
							) : '—'}
						</td>
						<td className="py-2 px-4 border-b text-center">
							<Link
								className="text-indigo-600 hover:text-indigo-900 mr-4"
								to={`/meals/${String(meal.id)}`}
							>
								Edit
							</Link>
							<button
								className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
								disabled={deleteMealMutation.isPending}
								onClick={() => {
									handleDelete(meal.id);
								}}
							>
								Delete
							</button>
						</td>
					</tr>
				))}
				</tbody>
			</table>
		</div>
	);
}