import { DialogProps } from "@toolpad/core";

export const fetchUrl = '/company/locations';

export interface FormProps
    extends DialogProps<undefined, string | null> {
    id: any;
}

export interface FormModel {
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

export const defaultValues = {
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    latitude: 0,
    longitude: 0,
    status: true,
}