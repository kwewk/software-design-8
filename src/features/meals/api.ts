import type { UseQueryResult } from "@tanstack/react-query";
// eslint-disable-next-line no-duplicate-imports
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { Meal } from './types';

const getMeals = async (): Promise<Array<Meal>> => {
	const response = await apiClient.get('/meals');
	return response.data as Array<Meal>;
}

const getMealById = async (id: string): Promise<Meal> => {
	const response = await apiClient.get(`/meals/${id}`);
	return response.data as Meal;
}

const createMeal = async (newMeal: Omit<Meal, 'id'>): Promise<Meal> => {
	const response = await apiClient.post('/meals', {
		name: newMeal.name,
		mealName: newMeal.mealType,
		photo: newMeal.photo
	});
	return response.data as Meal;
}

const updateMeal = async ({ id, data }: { id: string, data: Partial<Meal> }): Promise<Meal> => {
	const payload: any = {};
	if (data.name) payload.name = data.name;
	if (data.mealType) payload.mealName = data.mealType;
	if (data.photo !== undefined) payload.photo = data.photo;

	const response = await apiClient.patch(`/meals/${id}`, payload);
	return response.data as Meal;
}

const deleteMeal = async (id: string): Promise<void> => {
	await apiClient.delete(`/meals/${id}`);
}

export const useMeals = (): UseQueryResult<Array<Meal>, Error> => useQuery<Array<Meal>>({ queryKey: ['meals'], queryFn: getMeals });

export const useMeal = (id: string): UseQueryResult<Meal, Error> => useQuery<Meal>({ queryKey: ['meals', id], queryFn: () => getMealById(id) });

export const useCreateMeal = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createMeal,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['meals'] });
			await navigate({ to: '/meals' });
		},
	});
};

export const useUpdateMeal = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: updateMeal,
		onSuccess: async (updatedMeal) => {
			await queryClient.invalidateQueries({ queryKey: ['meals'] });
			queryClient.setQueryData(['meals', updatedMeal.id], updatedMeal);
			await navigate({ to: '/meals' });
		},
	});
};

export const useDeleteMeal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteMeal,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['meals'] });
		}
	})
}