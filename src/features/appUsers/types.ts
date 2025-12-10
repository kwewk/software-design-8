export type AppUser = {
	id: number;
	userName: string;
	isRegistered: boolean;
	recipes?: Array<{
		id: number;
		description: string;
		cookingTime: number;
		meal?: {
			id: number;
			name: string;
			mealType: string;
		};
	}>;
}