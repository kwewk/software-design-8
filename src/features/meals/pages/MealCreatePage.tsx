import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateMeal } from '../api';
import type { ReactElement } from "react";
import type { Meal } from "../types.ts";
// eslint-disable-next-line no-duplicate-imports
import { MealName } from "../types.ts";
import { isAxiosError } from "axios";

const mealSchema = z.object({
	name: z.string().min(2, "Name is too short"),
	mealType: z.nativeEnum(MealName, {
		errorMap: () => ({ message: "Please select a meal type" })
	}),
	photo: z.string().nullable().optional(),
});

type MealFormData = z.infer<typeof mealSchema>;

export function MealCreatePage(): ReactElement {
	const createMealMutation = useCreateMeal();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<MealFormData>({
		resolver: zodResolver(mealSchema),
	});

	const onSubmit = (data: MealFormData): void => {
		createMealMutation.mutate(data as Omit<Meal, "id">, {
			onSuccess: () => { reset(); },
			onError: (error: unknown) => {
				if (isAxiosError(error)) {
					if (error.response?.status === 409) {
						alert("A meal with this name already exists.");
						return;
					}
				}
				alert("Unexpected error occurred.");
			},
		});
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Create New Meal</h1>
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
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 cursor-pointer"
					disabled={createMealMutation.isPending}
					type="submit"
				>
					{createMealMutation.isPending ? 'Creating...' : 'Create Meal'}
				</button>
			</form>
		</div>
	);
}