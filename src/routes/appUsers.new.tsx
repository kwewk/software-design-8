import { createFileRoute } from '@tanstack/react-router';
import { AppUserCreatePage } from '../features/appUsers/pages/AppUserCreatePage';

export const Route = createFileRoute('/appUsers/new')({
	component: AppUserCreatePage,
});