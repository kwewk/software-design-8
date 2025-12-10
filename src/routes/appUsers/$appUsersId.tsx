import { createFileRoute } from '@tanstack/react-router';
import { AppUserDetailPage } from '../../features/appUsers/pages/AppUserDetailPage';

export const Route = createFileRoute('/appUsers/$appUsersId')({
	component: AppUserDetailPage,
});