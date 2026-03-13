import type { ServiceData } from "./service-data";

export type UserInTicketData = {
	id: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	picturePath: string;
};

export type ClientHistoryTicketData = {
	id: string;
	clientId: string;
	tech: UserInTicketData;
	status: string;
	createdAt: string;
	updatedAt: string;
	services: ServiceData[];
	totalPrice: string;
};

export type TechTicketListData = {
	id: string;
	client: UserInTicketData;
	techId: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	services: ServiceData[];
	totalPrice: string;
};
