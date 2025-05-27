import { DialogProps } from "@toolpad/core";

export const fetchUrl = '/admin/company/data-source'; // ✅ your endpoint
export const defaultValues = {
  company: {}, // or an object if you're using a selector
  datastore: '',
  account: '',
  sensitivity: '',
  sensitive_records: '',
  data: '',
  access_key_id: '',
  secret_access_key: '',
  region: '',
  bucket_name: '',
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
  database_engine?: string; // ✅ add this
  data: string;
  access_key_id: string;
  secret_access_key: string;
  region: string;
  bucket_name: string;
  status: boolean;
  // For MongoDB Atlas
  connectionString?: string;
}
