import type { ServiceData } from "./service-data";

export type techInTicketData = {
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
	tech: techInTicketData;
	status: string;
	createdAt: string;
	updatedAt: string;
	services: ServiceData[];
	totalPrice: string;
};
