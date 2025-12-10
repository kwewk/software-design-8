import { Link, Outlet } from "@tanstack/react-router";
import { useAppUsers, useDeleteAppUser } from '../api';
import type { ReactElement } from "react";
import type { AppUser } from "../types";

export type AppUsersResponse = {
	message: string;
	data: Array<AppUser>;
}

export function AppUserListPage(): ReactElement {
	const { data: appUsersResponse, isLoading, isError, error } = useAppUsers();
	const deleteAppUserMutation = useDeleteAppUser();

	const handleDelete = (id: string): void => {
		if (window.confirm('Are you sure you want to delete this app user?')) {
			deleteAppUserMutation.mutate(id);
		}
	};

	if (isLoading) return <div className="flex items-center justify-center h-screen text-4xl font-bold">Loading...</div>;

	if (isError) return <div className="flex items-center justify-center h-screen text-4xl font-bold">Error loading app users: {error.message}</div>;

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">App Users</h1>
				<Link
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					to="/appUsers/new"
				>
					Create New App User
				</Link>
			</div>
			<Outlet />
			<table className="min-w-full bg-white">
				<thead>
				<tr>
					<th className="py-2 px-4 border-b">ID</th>
					<th className="py-2 px-4 border-b">Name</th>
					<th className="py-2 px-4 border-b">Is Registered</th>
					<th className="py-2 px-4 border-b">Actions</th>
				</tr>
				</thead>
				<tbody>
				{(appUsersResponse as unknown as AppUsersResponse)?.data.map(
					(appUser: AppUser) => (
						<tr key={appUser.id}>
							<td className="py-2 px-4 border-b">{appUser.id}</td>
							<td className="py-2 px-4 border-b">{appUser.userName}</td>
							<td className="py-2 px-4 border-b text-center">
								{appUser.isRegistered ? '✓' : '—'}
							</td>
							<td className="py-2 px-4 border-b text-center">
								<Link
									className="text-indigo-600 hover:text-indigo-900 mr-4"
									to={`/appUsers/${String(appUser.id)}`}
								>
									Edit
								</Link>
								<button
									className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
									disabled={deleteAppUserMutation.isPending}
									onClick={() => {
										handleDelete(String(appUser.id));
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