export type Recipe = {
	id: string;
	description: string;
	cookingTime: number;
	user: {
		id: string;
		name: string;
		isRegistered: boolean;
	};
	meal: {
		id: string;
		name: string;
		mealName: string;
	};
}