import { useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMeal, useUpdateMeal } from '../api';
import { type ReactElement, useEffect } from "react";
import type { Meal } from "../types.ts";
import { MealName } from "../types.ts";

const mealSchema = z.object({
	name: z.string().min(2, "Name is too short"),
	mealType: z.nativeEnum(MealName, {
		errorMap: () => ({ message: "Please select a meal type" })
	}),
	photo: z.string().nullable().optional(),
});

type MealResponse = {
	message: string;
	data: Meal;
}

type MealFormData = z.infer<typeof mealSchema>;

export function MealDetailPage(): ReactElement {
	const { mealsId } = useParams({ from: '/meals/$mealsId' });
	const { data: mealResponse, isLoading, isError } = useMeal(mealsId);
	const meal = (mealResponse as unknown as MealResponse)?.data;
	const updateMealMutation = useUpdateMeal();

	const { register, handleSubmit, reset, formState: { errors } } = useForm<MealFormData>({
		resolver: zodResolver(mealSchema),
	});

	useEffect(() => {
		if (meal) {
			reset({
				name: meal.name,
				mealType: meal.mealType,
				photo: meal.photo
			});
		}
	}, [meal, reset]);

	const onSubmit = (data: MealFormData): void => {
		updateMealMutation.mutate({ id: mealsId, data });
	};

	if (isLoading) return <div>Loading meal details...</div>;
	if (isError || !meal) return <div>Meal not found or failed to load.</div>;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Edit Meal:</h1>
			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label className="block font-medium" htmlFor="Name">Name</label>
					<input id="Name" {...register('name')} className="w-full p-2 border rounded" />
					{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
				</div>

				<div>
					<label className="block font-medium" htmlFor="mealName">Meal Type</label>
					<select id="mealName" {...register('mealType')} className="w-full p-2 border rounded">
						<option value="">Select meal type...</option>
						<option value={MealName.breakfast}>{MealName.breakfast}</option>
						<option value={MealName.lunch}>{MealName.lunch}</option>
						<option value={MealName.snack}>{MealName.snack}</option>
						<option value={MealName.dinner}>{MealName.dinner}</option>
					</select>
					{errors.mealType && <p className="text-red-500 text-sm mt-1">{errors.mealType.message}</p>}
				</div>

				<div>
					<label className="block font-medium" htmlFor="Photo">Photo URL</label>
					<input id="Photo" {...register('photo')} className="w-full p-2 border rounded" />
					{errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo.message}</p>}
				</div>

				<button
					className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 cursor-pointer"
					disabled={updateMealMutation.isPending}
					type="submit"
				>
					{updateMealMutation.isPending ? 'Saving...' : 'Save Changes'}
				</button>
			</form>
		</div>
	);
}