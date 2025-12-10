import { useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppUser, useUpdateAppUser } from '../api';
import { type ReactElement, useEffect } from "react";
import type { AppUser } from "../types.ts";

const appUserSchema = z.object({
	userName: z.string().min(2, "Name is too short"),
	isRegistered: z.boolean(),
});

type AppUserResponse = {
	message: string;
	data: AppUser;
}

type AppUserFormData = z.infer<typeof appUserSchema>;

export function AppUserDetailPage(): ReactElement {
	const { appUsersId } = useParams({ from: '/appUsers/$appUsersId' });
	const { data: appUserResponse, isLoading, isError } = useAppUser(appUsersId);
	const appUser = (appUserResponse as unknown as AppUserResponse)?.data;
	const updateAppUserMutation = useUpdateAppUser();

	const { register, handleSubmit, reset, formState: { errors } } = useForm<AppUserFormData>({
		resolver: zodResolver(appUserSchema),
	});

	useEffect(() => {
		if (appUser) {
			reset({ userName: appUser.userName, isRegistered: appUser.isRegistered });
		}
	}, [appUser, reset]);

	const onSubmit = (data: AppUserFormData): void => {
		updateAppUserMutation.mutate({ id: appUsersId, data });
	};

	if (isLoading) return <div>Loading app user details...</div>;
	if (isError || !appUser) return <div>App user not found or failed to load.</div>;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Edit App User:</h1>
			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label className="block font-medium" htmlFor="Name">Name</label>
					<input id="Name" {...register('userName')} className="w-full p-2 border rounded" />
					{errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>}
				</div>

				<div className="flex items-center gap-2">
					<input
						id="IsRegistered"
						type="checkbox"
						{...register('isRegistered')}
						className="w-4 h-4"
					/>
					<label className="font-medium" htmlFor="IsRegistered">Is Registered</label>
					{errors.isRegistered && <p className="text-red-500 text-sm">{errors.isRegistered.message}</p>}
				</div>

				<button
					className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 cursor-pointer"
					disabled={updateAppUserMutation.isPending}
					type="submit"
				>
					{updateAppUserMutation.isPending ? 'Saving...' : 'Save Changes'}
				</button>
			</form>
		</div>
	);
}