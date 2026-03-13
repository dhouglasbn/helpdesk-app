import type { ServiceData } from "./service-data";

export type TechInTicketData = {
	id: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	picturePath: string;
};

export type TicketData = {
	id: string;
	clientId: string;
	tech: TechInTicketData;
	status: string;
	createdAt: string;
	updatedAt: string;
	services: ServiceData[];
	totalPrice: string;
};
