import type { ServiceData } from "./service-data";
import type { UserData } from "./userData";

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
