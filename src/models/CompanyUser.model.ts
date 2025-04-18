export interface CompanyUserModel {
    company: any;
    name: string;
    email: string;
    password: string;
    status: boolean;
    isAdmin: boolean;
    _id?: string;
}