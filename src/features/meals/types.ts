export type Meal = {
	id: number;
	name: string;
	mealType: MealName;
	photo?: any;
	recipes?: Array<{
		id: number;
		description: string;
		cookingTime: number;
		user?: {
			id: number;
			name: string;
		};
	}>;
}

export enum MealName {
	breakfast = 'Сніданок',
	lunch = 'Обід',
	snack = 'Перекус',
	dinner = 'Вечеря'
}