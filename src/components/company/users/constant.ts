import { DialogProps } from "@toolpad/core";

export const fetchUrl = '/company/company-users';
export const defaultValues = {
    name: '',
    email: '',
    password: '',
    status: true,
}

export interface FormProps
    extends DialogProps<undefined, string | null> {
    id: any;
}


export interface FormModel {
    name: string;
    email: string;
    password: string;
    status: boolean;
}