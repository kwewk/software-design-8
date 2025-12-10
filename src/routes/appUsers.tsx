import { createFileRoute } from '@tanstack/react-router';
import { AppUserListPage } from '../features/appUsers/pages/AppUserListPage';

export const Route = createFileRoute('/appUsers')({
	component: AppUserListPage,
});