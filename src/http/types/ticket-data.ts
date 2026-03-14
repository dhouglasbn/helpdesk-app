import type { ServiceData } from "./service-data";
import type { UserData } from "./user-data";

export type ClientHistoryTicketData = {
	id: string;
	clientId: string;
	tech: UserData;
	status: string;
	createdAt: string;
	updatedAt: string;
	services: ServiceData[];
	totalPrice: string;
};

export type TechTicketListData = {
	id: string;
	client: UserData;
	techId: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	services: ServiceData[];
	totalPrice: string;
};

export type AdminTicketListData = {
	id: string;
	client: {
		id: string;
		name: string;
		picturePath: string;
	};
	tech: {
		id: string;
		name: string;
		picturePath: string;
	};
	status: string;
	createdAt: string;
	updatedAt: string;
	services: ServiceData[];
	totalPrice: string;
};
