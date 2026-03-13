export type CreateUserResponse = {
	newClient: {
		id: string;
		name: string;
		email: string;
		passwordHash: string;
		phone: string;
		address: string;
		role: string;
		picture: string | null;
	};
};
