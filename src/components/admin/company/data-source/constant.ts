import { DialogProps } from "@toolpad/core";

export const fetchUrl = '/admin/company/data-source'; // ✅ your endpoint
export const defaultValues = {
  company: {}, // or an object if you're using a selector
  datastore: '',
  account: '',
  sensitivity: '',
  sensitive_records: '',
  data: '',
  status: true,
};

export interface FormProps extends DialogProps<undefined, string | null> {
  id: any;
}

export interface FormModel {
  company: object;
  datastore: string;
  account?: string;
  subCategory: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsRegion?: string;
  s3BucketName?: string;
  selectedSubCategory: string;
  rdsEngine?: string; // ✅ add this
  data: string;
  status: boolean;
}
