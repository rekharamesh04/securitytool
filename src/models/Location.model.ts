export interface LocationModel {
    _id?: string;
    company: any;
    dashboardUrl?: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;
    status: boolean;
}