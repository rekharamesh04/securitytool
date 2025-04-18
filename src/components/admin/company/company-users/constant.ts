export const fetchUrl = '/admin/company/company-users';
export const defaultValues = {
    company: {},
    name: '',
    email: '',
    password: '',
    status: true,
    isAdmin: false,
}

export default interface CompanyUserModel {
    _id?: string;
    company: any;
    name: string;
    email: string;
    password: string;
    status: boolean;
    isAdmin: boolean;
}
