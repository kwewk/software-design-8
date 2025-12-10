import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
// eslint-disable-next-line no-duplicate-imports
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from '@tanstack/react-router';
import apiClient from '../../lib/axios';
import type { AppUser } from './types';

const getAppUsers = async (): Promise<Array<AppUser>> => {
	const response = await apiClient.get('/app-users');
	return response.data as Array<AppUser>;
}

const getAppUserById = async (id: string): Promise<AppUser> => {
	const response = await apiClient.get(`/app-users/${id}`);
	return response.data as AppUser;
}

const createAppUser = async (newAppUser: Omit<AppUser, 'id'>): Promise<AppUser> => {
	const response = await apiClient.post('/app-users', {
		name: newAppUser.userName,
		isRegistered: newAppUser.isRegistered
	});
	return response.data as AppUser;
}

const updateAppUser = async ({ id, data }: { id: string, data: Partial<AppUser> }): Promise<AppUser> => {
	const payload: any = {};
	if (data.userName) payload.name = data.userName;  // userName → name
	if (data.isRegistered !== undefined) payload.isRegistered = data.isRegistered;

	const response = await apiClient.patch(`/app-users/${id}`, payload);  // ← исправлено
	return response.data as AppUser;
}

const deleteAppUser = async (id: string): Promise<void> => {
	await apiClient.delete(`/app-users/${id}`);  // ← исправлено
}

export const useAppUsers = (): UseQueryResult<Array<AppUser>, Error> => useQuery<Array<AppUser>>({ queryKey: ['appUsers'], queryFn: getAppUsers });

export const useAppUser = (id: string): UseQueryResult<AppUser, Error> => useQuery<AppUser>({ queryKey: ['appUsers', id], queryFn: () => getAppUserById(id) });

export const useCreateAppUser = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createAppUser,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['appUsers'] });
			await navigate({ to: '/appUsers' });
		},
	});
};

export const useUpdateAppUser = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: updateAppUser,
		onSuccess: async (updatedAppUser) => {
			await queryClient.invalidateQueries({ queryKey: ['appUsers'] });
			queryClient.setQueryData(['appUsers', updatedAppUser.id], updatedAppUser);
			await navigate({ to: '/appUsers' });
		},
	});
};

export const useDeleteAppUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteAppUser,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['appUsers'] });
		}
	})
}