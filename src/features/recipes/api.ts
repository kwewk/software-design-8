import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
// eslint-disable-next-line no-duplicate-imports
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { Recipe } from './types';

const getRecipes = async (): Promise<Array<Recipe>> => {
	const response = await apiClient.get('/recipes');
	return response.data as Array<Recipe>;
}

const getRecipeById = async (id: string): Promise<Recipe> => {
	const response = await apiClient.get(`/recipes/${id}`);
	return response.data as Recipe;
}

const createRecipe = async (newRecipe: Omit<Recipe, 'id'>): Promise<Recipe> => {
	const response = await apiClient.post('/recipes', newRecipe);
	return response.data as Recipe;
}

const updateRecipe = async ({ id, data }: { id: string, data: Partial<Recipe> }): Promise<Recipe> => {
	const response = await apiClient.patch(`/recipes/${id}`, data);
	return response.data as Recipe;
}

const deleteRecipe = async (id: string): Promise<void> => {
	await apiClient.delete(`/recipes/${id}`);
}

export const useRecipes = (): UseQueryResult<Array<Recipe>, Error> => useQuery<Array<Recipe>>({ queryKey: ['recipes'], queryFn: getRecipes });

export const useRecipe = (id: string): UseQueryResult<Recipe, Error> => useQuery<Recipe>({ queryKey: ['recipes', id], queryFn: () => getRecipeById(id) });

export const useCreateRecipe = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createRecipe,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['recipes'] });
			await navigate({ to: '/recipes' });
		},
	});
};

export const useUpdateRecipe = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: updateRecipe,
		onSuccess: async (updatedRecipe) => {
			await queryClient.invalidateQueries({ queryKey: ['recipes'] });
			queryClient.setQueryData(['recipes', updatedRecipe.id], updatedRecipe);
			await navigate({ to: '/recipes' });
		},
	});
};

export const useDeleteRecipe = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteRecipe,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['recipes'] });
		}
	})
}