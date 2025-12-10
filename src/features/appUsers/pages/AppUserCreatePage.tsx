import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateAppUser } from '../api';
import type { ReactElement } from "react";
import type { AppUser } from "../types.ts";
import { isAxiosError } from "axios";

const appUserSchema = z.object({
	userName: z.string().min(2, "Name is too short"),
	isRegistered: z.boolean(),
});

type AppUserFormData = z.infer<typeof appUserSchema>;

export function AppUserCreatePage(): ReactElement {
	const createAppUserMutation = useCreateAppUser();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<AppUserFormData>({
		resolver: zodResolver(appUserSchema),
	});

	const onSubmit = (data: AppUserFormData): void => {
		createAppUserMutation.mutate(data as Omit<AppUser, "ID">, {
			onSuccess: () => { reset(); },
			onError: (error: unknown) => {
				if (isAxiosError(error)) {
					if (error.response?.status === 409) {
						alert("A user with this name already exists.");
						return;
					}
				}
				alert("Unexpected error occurred.");
			},
		});
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Create New App User</h1>
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
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 cursor-pointer"
					disabled={createAppUserMutation.isPending}
					type="submit"
				>
					{createAppUserMutation.isPending ? 'Creating...' : 'Create App User'}
				</button>
			</form>
		</div>
	);
}