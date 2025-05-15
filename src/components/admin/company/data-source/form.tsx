"use client";

import axiosInstance from "@/utils/axiosInstance";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNotifications } from "@toolpad/core";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { defaultValues, fetchUrl, FormModel, FormProps } from "./constant";
import CompanyAutocomplete from "../../autocomplete/companyAutocomplete";
import { Theme } from "@mui/material/styles";
import { alpha } from "@mui/system";
import theme from "@/theme/theme";


// Extended validation schema for AWS S3
const validationSchema = yup.object().shape({
  company: yup.object().required("Company is required"),
  datastore: yup.string().required("Datastore is required"),
  account: yup.string().when(["datastore", "subCategory"], ([datastore, subCategory], schema) => {
    return datastore === "AWS" && subCategory === "S3"
      ? schema.notRequired()
      : schema.required("Account is required");
  }),
  subCategory: yup.string().required("Sub-category is required"),
  selectedSubCategory: yup.string().required("selectedSubCategory is required"),

  data: yup.string().required("Data is required"),
  status: yup.boolean().required(),

  awsAccessKeyId: yup.string().when(["datastore", "subCategory"], ([datastore, subCategory], schema) => {
    return datastore === "AWS" && subCategory === "S3"
      ? schema.required("AWS Access Key ID is required")
      : schema.notRequired();
  }),
  awsSecretAccessKey: yup.string().when(["datastore", "subCategory"], ([datastore, subCategory], schema) => {
    return datastore === "AWS" && subCategory === "S3"
      ? schema.required("AWS Secret Access Key is required")
      : schema.notRequired();
  }),
  awsRegion: yup.string().when(["datastore", "subCategory"], ([datastore, subCategory], schema) => {
    return datastore === "AWS" && subCategory === "S3"
      ? schema.required("AWS Region is required")
      : schema.notRequired();
  }),
  s3BucketName: yup.string().when(["datastore", "subCategory"], ([datastore, subCategory], schema) => {
    return datastore === "AWS" && subCategory === "S3"
      ? schema.required("S3 Bucket Name is required")
      : schema.notRequired();
  }),
});

// Define database types
const DATABASE_TYPES = [
  "MySQL",
  "PostgreSQL",
  "MsSQL",
  "MongoDB",
  "Oracle",
  "SQL Server",
];

// Connection string examples
const CONNECTION_STRING_EXAMPLES: Record<string, string> = {
  MySQL: "jdbc:mysql://hostname:3306/database",
  PostgreSQL: "jdbc:postgresql://hostname:5432/database",
  MongoDB: "mongodb://username:password@hostname:27017/database",
  Oracle: "jdbc:oracle:thin:@hostname:1521:SID",
  "SQL Server": "jdbc:sqlserver://hostname:1433;databaseName=database",
  "AWS RDS": "jdbc:mysql://rds-instance.aws.com:3306/database",
  "AWS Redshift": "jdbc:redshift://redshift-instance.aws.com:5439/database",
  "AWS DynamoDB": "dynamodb.us-east-1.amazonaws.com",
  "AWS S3": "s3://bucket-name/path/to/file",
  "Azure SQL Database":
    "Server=tcp:server.database.windows.net,1433;Database=myDB;",
  "Azure Cosmos DB":
    "AccountEndpoint=https://account.documents.azure.com:443/;AccountKey=key;",
  "Azure Blob Storage":
    "DefaultEndpointsProtocol=https;AccountName=account;AccountKey=key;",
  "Google Cloud SQL":
    "jdbc:mysql://google/instance-name?cloudSqlInstance=project:region:instance&socketFactory=com.google.cloud.sql.mysql.SocketFactory",
  "Google BigQuery":
    "jdbc:bigquery://https://www.googleapis.com/bigquery/v2:443;ProjectId=project;OAuthType=0;OAuthServiceAcctEmail=service-account-email;OAuthPvtKeyPath=key.p12;",
  "Google Cloud Storage": "gs://bucket-name/path/to/file",
  Gmail: "imaps://imap.gmail.com:993",
  Outlook: "imaps://outlook.office365.com:993",
};

const getConnectionStringExample = (
  datastore: string,
  subCategory?: string
) => {
  if (
    subCategory &&
    CONNECTION_STRING_EXAMPLES[`${datastore} ${subCategory}`]
  ) {
    return CONNECTION_STRING_EXAMPLES[`${datastore} ${subCategory}`];
  }
  return CONNECTION_STRING_EXAMPLES[datastore] || "";
};

export default function DataSourceForm({ id, open, onClose }: FormProps) {
  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const router = useRouter();
  const notifications = useNotifications();

  // Datastore options
  const DATASTORE_OPTIONS = [
    {
      group: "Cloud Services",
      items: ["AWS", "Azure", "Google Cloud", "IBM_Cloud"],
    },
    {
      group: "Databases",
      items: DATABASE_TYPES,
    },
    {
      group: "Email Services",
      items: ["Gmail", "Outlook", "Yahoo Mail", "ProtonMail", "Zoho Mail"],
    },
  ];

  // Define sub-categories only for non-database items
  const DATASTORE_SUB_CATEGORIES: Record<string, string[]> = {
    AWS: ["S3", "EC2", "RDS", "DynamoDB", "Redshift"],
    Azure: ["Blob Storage", "SQL Database", "Cosmos DB", "MySQL", "PostgreSQL"],
    "Google Cloud": [
      "Cloud SQL",
      "Cloud Spanner",
      "Cloud Storage",
      "Cloud Bigtable",
      "BigQuery",
      "Cloud Memorystore for Redis",
      "Cloud Memorystore for Memcached",
    ],
    IBM_Cloud: [
      "IBM Cloud Databases for PostgreSQL",
      "IBM Cloud Databases for MySQL",
      "IBM Db2 on Cloud",
      "Db2 Warehouse on Cloud",
      "IBM Cloud Databases for MongoDB",
      "IBM Cloud Databases for Redis",
      "IBM Cloud Databases for Elasticsearch",
      "IBM Cloud Databases for Cassandra",
      "IBM Cloud Databases for etcd",
      "IBM Cloudant",
      "IBM Informix",
      "COS Storage",
    ],
    Gmail: ["Emails", "Contacts", "Attachments"],
    Outlook: ["Emails", "Contacts", "Calendar"],
  };

  // Define RDS database engine options
  const RDS_ENGINE_OPTIONS = [
    "MySQL",
    "PostgreSQL",
    "MariaDB",
    "Oracle",
    "SQL Server",
    "Aurora MySQL",
    "Aurora PostgreSQL",
  ];

  const COSMOS_DB_API_OPTIONS = [
    "Core (SQL) API",
    "MongoDB API",
    "Cassandra API",
    "Gremlin API",
    "Table API",
  ];

  const GOOGLE_CLOUD_SQL = ["MySQL", "PostgreSQL", "SQL Server"];

  const flattenedOptions = DATASTORE_OPTIONS.flatMap((group) =>
    group.items.map((item) => ({
      label: item,
      group: group.group,
    }))
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormModel>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  });

  const company = watch("company");
  const datastore = watch("datastore");
  const isDatabase = DATABASE_TYPES.includes(datastore);
  const isAWSS3 = datastore === "AWS" && selectedSubCategory === "S3";
  const isAWSEC2 = datastore === "AWS" && selectedSubCategory === "EC2";
  const isAWSRDS = datastore === "AWS" && selectedSubCategory === "RDS";
  const isAWSDynamoDB =
    datastore === "AWS" && selectedSubCategory === "DynamoDB";
  const isAWSRedshift =
    datastore === "AWS" && selectedSubCategory === "Redshift";
  const isAzureService = datastore === "Azure" && selectedSubCategory !== null;
  const isAzureCosmosDB =
    datastore === "Azure" && selectedSubCategory === "Cosmos DB";
  const isGoogleCloudSQL =
    datastore === "Google Cloud" && selectedSubCategory === "Cloud SQL";
  const isGoogleCloudSpanner =
    datastore === "Google Cloud" && selectedSubCategory === "Cloud Spanner";
  const isGoogleRedis =
    datastore === "Google Cloud" &&
    selectedSubCategory === "Cloud Memorystore for Redis";
  const isGoogleBigQuery =
    datastore === "Google Cloud" && selectedSubCategory === "BigQuery";
  const isGoogleBigtable =
    datastore === "Google Cloud" && selectedSubCategory === "Cloud Bigtable";
  const isGoogleMemcached =
    datastore === "Google Cloud" &&
    selectedSubCategory === "Cloud Memorystore for Memcached";
  const isGoogleCloudStorage =
    datastore === "Google Cloud" && selectedSubCategory === "Cloud Storage";
  const isIBMPostSql =
    datastore === "IBM_Cloud" &&
    selectedSubCategory === "IBM Cloud Databases for PostgreSQL";
  const isIBMMySql =
    datastore === "IBM_Cloud" &&
    selectedSubCategory === "IBM Cloud Databases for MySQL";
  const isIBMDb2 =
    datastore === "IBM_Cloud" &&
    selectedSubCategory === "IBM Db2 on Cloud";
  const isIBMMongo =
    datastore === "IBM_Cloud" &&
    selectedSubCategory === "IBM Cloud Databases for MongoDB";
  const isIBMRedis =
    datastore === "IBM_Cloud" &&
    selectedSubCategory === "IBM Cloud Databases for Redis";
  const isIBMElastic =
    datastore === "IBM_Cloud" &&
    selectedSubCategory === "IBM Cloud Databases for Elasticsearch";
  const isIBMCassandra =
    datastore === "IBM_Cloud" &&
    selectedSubCategory === "IBM Cloud Databases for Cassandra";
  const isIBMEtcd =
    datastore === "IBM_Cloud" &&
    selectedSubCategory === "IBM Cloud Databases for etcd";
  const isIBMCloudant =
    datastore === "IBM_Cloud" &&
    selectedSubCategory === "IBM Cloudant";
  const isIBMCos =
    datastore === "IBM_Cloud" &&
    selectedSubCategory === "COS Storage";
  const isIBMInformix =
    datastore === "IBM_Cloud" &&
    selectedSubCategory === "IBM Informix";
  const isGoogleEmail =
    datastore === "Gmail" ||
    datastore === "Outlook" ||
    datastore === "Yahoo Mail" ||
    datastore === "ProtonMail" ||
    datastore === "Zoho Mail";

  // Fetch and prefill data for editing
  const bindData = useCallback(
    async (id: any) => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${fetchUrl}/${id}`);
        const data = response.data.data;

        if (data.datastore === "AWS" && data.subCategory === "S3") {
          try {
            const accountData = JSON.parse(data.account);
            reset({
              ...data,
              company: data.company,
              awsAccessKeyId: accountData.awsAccessKeyId,
              awsSecretAccessKey: accountData.awsSecretAccessKey,
              awsRegion: accountData.awsRegion,
              s3BucketName: accountData.s3BucketName,
            });
          } catch {
            reset({
              ...data,
              company: data.company,
            });
          }
        } else {
          reset({
            ...data,
            company: data.company,
          });
        }

        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        const { response } = error;
        if (response && response.status == 403) {
          router.push("/forbidden");
        }
      }
    },
    [router, reset]
  );

  useEffect(() => {
    if (id && id !== "new") {
      bindData(id);
    }
  }, [id, bindData]);

  // Update sub-categories when datastore changes (only for non-databases)
  useEffect(() => {
    if (datastore && DATASTORE_SUB_CATEGORIES[datastore] && !isDatabase) {
      setSubCategories(DATASTORE_SUB_CATEGORIES[datastore]);
    } else {
      setSubCategories([]);
      setSelectedSubCategory(null);
    }
  }, [datastore, isDatabase]);

  // Submit form data
  const onSubmit = async (data: FormModel) => {
    try {
      const url = id !== "new" ? `${fetchUrl}/${id}` : `${fetchUrl}/`;
      const method = id !== "new" ? "put" : "post";

      const response = await axiosInstance.request({ url, method, data });
      if (response.status === 200 || response.status === 201) {
        const { data } = response;
        notifications.show(data.message, { severity: "success" });
      }

      onClose("true");
    } catch (error) {
      console.error("Error saving data source:", error);
      onClose("false");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={() => onClose(null)}
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxWidth: "800px", // Slightly wider dialog
        },
      }}
    >
      <DialogTitle
        sx={{ bgcolor: "primary.main", color: "white", fontWeight: 600 }}
      >
        {/* {id !== "new" ? 'Update Data Source' : 'Create Data Source'} */}

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6">
            {id !== "new" ? "Update Data Source" : "Create Data Source"}
          </Typography>
          <IconButton
            onClick={() => onClose(null)}
            sx={{
              color: (theme: Theme) =>
                theme.palette.mode === "light" ? "white" : "white",
              backgroundColor: (theme: Theme) =>
                theme.palette.mode === "light" ? "#ed1a26" : "#282B73",
              borderRadius: "8px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: alpha(theme.palette.text.secondary, 0.2),
                transform: "rotate(90deg)",
              },
            }}
          >
            <Icon>close</Icon>
          </IconButton>
        </Stack>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 3,
              "& > *": {
                flex: 1,
                minWidth: 0, // Prevents overflow
              },
            }}
          >
            {/* Company Field (40% width) */}
            <Box sx={{ flex: "0 1 40%", width: "100%" }}>
              <CompanyAutocomplete
                setValue={setValue}
                value={company}
              />
            </Box>

            {/* Datastore Field (60% width) */}
            <Box sx={{ flex: "0 1 60%" }}>
              <Autocomplete
                options={flattenedOptions}
                groupBy={(option) => option.group}
                getOptionLabel={(option) => option.label}
                value={datastore ? { label: datastore, group: "" } : null}
                onChange={(_, newValue) => {
                  setValue("datastore", newValue?.label || "");
                  setSelectedSubCategory(null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Datastore"
                    fullWidth
                    error={!!errors.datastore}
                    helperText={errors.datastore?.message}
                  />
                )}
              />
            </Box>
          </Box>

          {!isDatabase && subCategories.length > 0 && (
            <Autocomplete
              options={subCategories}
              getOptionLabel={(option) => option}
              onChange={(_, newValue) => {
                setSelectedSubCategory(newValue);
                setValue("subCategory", newValue || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Service/Component"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          )}

          {isIBMInformix ? (
            <>
            <TextField
              label="DATABASE"
              fullWidth
              margin="normal"
              // {...register("google_service_account")}
              // error={!!errors.google_service_account}
              // helperText={errors.google_service_account?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Eg: https://s3.us-south.cloud-object-storage.appdomain.cloud"
            />

            <TextField
              label="HOSTNAME"
              fullWidth
              margin="normal"
              // {...register("google_project_id")}
              // error={!!errors.google_project_id}
              // helperText={errors.google_project_id?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Eg: your-api-key"
            />

            <TextField
              label="PORT"
              fullWidth
              margin="normal"
              // {...register("google_private_key_id")}
              // error={!!errors.google_private_key_id}
              // helperText={errors.google_private_key_id?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Eg: crn:v1:bluemix:public:cloud-object-storage:global:a/"
            />

            <TextField
              label="PROTOCOL"
              fullWidth
              margin="normal"
              // {...register("google_private_key")}
              // error={!!errors.google_private_key}
              // helperText={errors.google_private_key?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Eg: your-access-key-id"
            />

            <TextField
              label="userID"
              fullWidth
              margin="normal"
              // {...register("google_client_email")}
              // error={!!errors.google_client_email}
              // helperText={errors.google_client_email?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Eg: your-secret-access-key"
            />

            <TextField
              label="password"
              fullWidth
              margin="normal"
              // {...register("google_client_id")}
              // error={!!errors.google_client_id}
              // helperText={errors.google_client_id?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Eg: your-bucket-name"
            />
            <TextField
              label="Server"
              fullWidth
              margin="normal"
              // {...register("google_client_id")}
              // error={!!errors.google_client_id}
              // helperText={errors.google_client_id?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Eg: your-bucket-name"
            />
          </>
          )
          : isIBMCos ? (
            <>
            <TextField
              label="IBM_COS_ENDPOINT"
              fullWidth
              margin="normal"
              // {...register("google_service_account")}
              // error={!!errors.google_service_account}
              // helperText={errors.google_service_account?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Eg: https://s3.us-south.cloud-object-storage.appdomain.cloud"
            />

            <TextField
              label="IBM_COS_API_KEY_ID"
              fullWidth
              margin="normal"
              // {...register("google_project_id")}
              // error={!!errors.google_project_id}
              // helperText={errors.google_project_id?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Eg: your-api-key"
            />

            <TextField
              label="IBM_COS_RESOURCE_CRN"
              fullWidth
              margin="normal"
              // {...register("google_private_key_id")}
              // error={!!errors.google_private_key_id}
              // helperText={errors.google_private_key_id?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Eg: crn:v1:bluemix:public:cloud-object-storage:global:a/"
            />

            <TextField
              label="IBM_COS_ACCESS_KEY_ID"
              fullWidth
              margin="normal"
              // {...register("google_private_key")}
              // error={!!errors.google_private_key}
              // helperText={errors.google_private_key?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Eg: your-access-key-id"
            />

            <TextField
              label="IBM_COS_SECRET_ACCESS_KEY"
              fullWidth
              margin="normal"
              // {...register("google_client_email")}
              // error={!!errors.google_client_email}
              // helperText={errors.google_client_email?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Eg: your-secret-access-key"
            />

            <TextField
              label="IBM_COS_BUCKET_NAME"
              fullWidth
              margin="normal"
              // {...register("google_client_id")}
              // error={!!errors.google_client_id}
              // helperText={errors.google_client_id?.message}
              InputLabelProps={{ shrink: true }}
              placeholder="Eg: your-bucket-name"
            />
          </>
          )
          : isIBMCloudant ? (
            <TextField
              label="Connection String"
              fullWidth
              margin="normal"
              // {...register("azureConnectionString")}
              // error={!!errors.azureConnectionString}
              // helperText={
              //   errors.azureConnectionString?.message
              // }
              InputLabelProps={{ shrink: true }}
              multiline
              rows={3}
              placeholder="Eg: https://<username>:<password>@<host>"
            />
          )
          : isIBMEtcd ? (
            <TextField
              label="Connection String"
              fullWidth
              margin="normal"
              // {...register("azureConnectionString")}
              // error={!!errors.azureConnectionString}
              // helperText={
              //   errors.azureConnectionString?.message
              // }
              InputLabelProps={{ shrink: true }}
              multiline
              rows={3}
              placeholder="Eg: https://<username>:<password>@<host>:<port>"
            />
          )
          : isIBMCassandra ? (
            <TextField
              label="Connection String"
              fullWidth
              margin="normal"
              // {...register("azureConnectionString")}
              // error={!!errors.azureConnectionString}
              // helperText={
              //   errors.azureConnectionString?.message
              // }
              InputLabelProps={{ shrink: true }}
              multiline
              rows={3}
              placeholder="Eg: cassandra://<username>:<password>@<host1>,<host2>,<host3>:<port>/?ssl=true"
            />
          )
          : isIBMElastic ? (
            <TextField
              label="Connection String"
              fullWidth
              margin="normal"
              // {...register("azureConnectionString")}
              // error={!!errors.azureConnectionString}
              // helperText={
              //   errors.azureConnectionString?.message
              // }
              InputLabelProps={{ shrink: true }}
              multiline
              rows={3}
              placeholder="Eg: https://<username>:<password>@<hostname>:<port>"
            />
          )
          : isIBMRedis ? (
            <TextField
              label="Connection String"
              fullWidth
              margin="normal"
              // {...register("azureConnectionString")}
              // error={!!errors.azureConnectionString}
              // helperText={
              //   errors.azureConnectionString?.message
              // }
              InputLabelProps={{ shrink: true }}
              multiline
              rows={3}
              placeholder="Eg: rediss://<username>:<password>@<host>:<port>"
            />
          )
          : isIBMMongo ? (
            <TextField
              label="Connection String"
              fullWidth
              margin="normal"
              // {...register("azureConnectionString")}
              // error={!!errors.azureConnectionString}
              // helperText={
              //   errors.azureConnectionString?.message
              // }
              InputLabelProps={{ shrink: true }}
              multiline
              rows={3}
              placeholder="Eg: mongodb+srv://<username>:<password>@<hostname>/<database>?tls=true&retryWrites=true&w=majority"
            />
          )
          : isIBMDb2 ? (
            <TextField
              label="Connection String"
              fullWidth
              margin="normal"
              // {...register("azureConnectionString")}
              // error={!!errors.azureConnectionString}
              // helperText={
              //   errors.azureConnectionString?.message
              // }
              InputLabelProps={{ shrink: true }}
              multiline
              rows={3}
              placeholder="Eg: jdbc:db2://<hostname>:<port>/<database>:user=<username>;password=<password>;sslConnection=true;"
            />
          )
          : isIBMMySql ? (
            <TextField
              label="Connection String"
              fullWidth
              margin="normal"
              // {...register("azureConnectionString")}
              // error={!!errors.azureConnectionString}
              // helperText={
              //   errors.azureConnectionString?.message
              // }
              InputLabelProps={{ shrink: true }}
              multiline
              rows={3}
              placeholder="Eg: mysql://<username>:<password>@<hostname>:<port>/<database>?ssl-mode=REQUIRED"
            />
          )
          : isIBMPostSql ? (
            <TextField
              label="Connection String"
              fullWidth
              margin="normal"
              // {...register("azureConnectionString")}
              // error={!!errors.azureConnectionString}
              // helperText={
              //   errors.azureConnectionString?.message
              // }
              InputLabelProps={{ shrink: true }}
              multiline
              rows={3}
              placeholder="Eg: postgresql://<username>:<password>@<hostname>:<port>/<database>?sslmode=require"
            />
          ) : isGoogleBigtable ? (
            <>
              <TextField
                label="type"
                fullWidth
                margin="normal"
                // {...register("google_service_account")}
                // error={!!errors.google_service_account}
                // helperText={errors.google_service_account?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: service_account"
              />

              <TextField
                label="project_id"
                fullWidth
                margin="normal"
                // {...register("google_project_id")}
                // error={!!errors.google_project_id}
                // helperText={errors.google_project_id?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: your-gcp-project-id"
              />

              <TextField
                label="private_key_id"
                fullWidth
                margin="normal"
                // {...register("google_private_key_id")}
                // error={!!errors.google_private_key_id}
                // helperText={errors.google_private_key_id?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: abcdef1234567890abcdef1234567890abcdef12"
              />

              <TextField
                label="private_key"
                fullWidth
                margin="normal"
                // {...register("google_private_key")}
                // error={!!errors.google_private_key}
                // helperText={errors.google_private_key?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: --BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9...==\n-----END PRIVATE KEY--\n"
              />

              <TextField
                label="client_email"
                fullWidth
                margin="normal"
                // {...register("google_client_email")}
                // error={!!errors.google_client_email}
                // helperText={errors.google_client_email?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: your-service-account@your-project-id.iam.gserviceaccount.com"
              />

              <TextField
                label="client_id"
                fullWidth
                margin="normal"
                // {...register("google_client_id")}
                // error={!!errors.google_client_id}
                // helperText={errors.google_client_id?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: 123456789012345678901"
              />

              <TextField
                label="auth_uri"
                fullWidth
                margin="normal"
                // {...register("google_auth_uri")}
                // error={!!errors.google_auth_uri}
                // helperText={errors.google_auth_uri?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://accounts.google.com/o/oauth2/auth"
              />

              <TextField
                label="token_uri"
                fullWidth
                margin="normal"
                // {...register("google_token_uri")}
                // error={!!errors.google_token_uri}
                // helperText={errors.google_token_uri?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://oauth2.googleapis.com/token"
              />

              <TextField
                label="auth_provider_x509_cert_url"
                fullWidth
                margin="normal"
                // {...register("google_auth_provider_x509_cert_url")}
                // error={!!errors.google_auth_provider_x509_cert_url}
                // helperText={errors.google_auth_provider_x509_cert_url?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://www.googleapis.com/oauth2/v1/certs"
              />

              <TextField
                label="client_x509_cert_url"
                fullWidth
                margin="normal"
                // {...register("google_client_x509_cert_url")}
                // error={!!errors.google_client_x509_cert_url}
                // helperText={errors.google_client_x509_cert_url?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project-id.iam.gserviceaccount.com"
              />
            </>
          ) : isGoogleCloudStorage ? (
            <>
              <TextField
                label="type"
                fullWidth
                margin="normal"
                // {...register("google_service_account")}
                // error={!!errors.google_service_account}
                // helperText={errors.google_service_account?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: service_account"
              />

              <TextField
                label="project_id"
                fullWidth
                margin="normal"
                // {...register("google_project_id")}
                // error={!!errors.google_project_id}
                // helperText={errors.google_project_id?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: your-gcp-project-id"
              />

              <TextField
                label="private_key_id"
                fullWidth
                margin="normal"
                // {...register("google_private_key_id")}
                // error={!!errors.google_private_key_id}
                // helperText={errors.google_private_key_id?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: abcdef1234567890abcdef1234567890abcdef12"
              />

              <TextField
                label="private_key"
                fullWidth
                margin="normal"
                // {...register("google_private_key")}
                // error={!!errors.google_private_key}
                // helperText={errors.google_private_key?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: --BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9...==\n-----END PRIVATE KEY--\n"
              />

              <TextField
                label="client_email"
                fullWidth
                margin="normal"
                // {...register("google_client_email")}
                // error={!!errors.google_client_email}
                // helperText={errors.google_client_email?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: your-service-account@your-project-id.iam.gserviceaccount.com"
              />

              <TextField
                label="client_id"
                fullWidth
                margin="normal"
                // {...register("google_client_id")}
                // error={!!errors.google_client_id}
                // helperText={errors.google_client_id?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: 123456789012345678901"
              />

              <TextField
                label="auth_uri"
                fullWidth
                margin="normal"
                // {...register("google_auth_uri")}
                // error={!!errors.google_auth_uri}
                // helperText={errors.google_auth_uri?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://accounts.google.com/o/oauth2/auth"
              />

              <TextField
                label="token_uri"
                fullWidth
                margin="normal"
                // {...register("google_token_uri")}
                // error={!!errors.google_token_uri}
                // helperText={errors.google_token_uri?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://oauth2.googleapis.com/token"
              />

              <TextField
                label="auth_provider_x509_cert_url"
                fullWidth
                margin="normal"
                // {...register("google_auth_provider_x509_cert_url")}
                // error={!!errors.google_auth_provider_x509_cert_url}
                // helperText={errors.google_auth_provider_x509_cert_url?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://www.googleapis.com/oauth2/v1/certs"
              />

              <TextField
                label="client_x509_cert_url"
                fullWidth
                margin="normal"
                // {...register("google_client_x509_cert_url")}
                // error={!!errors.google_client_x509_cert_url}
                // helperText={errors.google_client_x509_cert_url?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project-id.iam.gserviceaccount.com"
              />
            </>
          ) : isGoogleBigQuery ? (
            <>
              <TextField
                label="type"
                fullWidth
                margin="normal"
                // {...register("google_service_account")}
                // error={!!errors.google_service_account}
                // helperText={errors.google_service_account?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: service_account"
              />

              <TextField
                label="project_id"
                fullWidth
                margin="normal"
                // {...register("google_project_id")}
                // error={!!errors.google_project_id}
                // helperText={errors.google_project_id?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: your-gcp-project-id"
              />

              <TextField
                label="private_key_id"
                fullWidth
                margin="normal"
                // {...register("google_private_key_id")}
                // error={!!errors.google_private_key_id}
                // helperText={errors.google_private_key_id?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: abcdef1234567890abcdef1234567890abcdef12"
              />

              <TextField
                label="private_key"
                fullWidth
                margin="normal"
                // {...register("google_private_key")}
                // error={!!errors.google_private_key}
                // helperText={errors.google_private_key?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: --BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9...==\n-----END PRIVATE KEY--\n"
              />

              <TextField
                label="client_email"
                fullWidth
                margin="normal"
                // {...register("google_client_email")}
                // error={!!errors.google_client_email}
                // helperText={errors.google_client_email?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: your-service-account@your-project-id.iam.gserviceaccount.com"
              />

              <TextField
                label="client_id"
                fullWidth
                margin="normal"
                // {...register("google_client_id")}
                // error={!!errors.google_client_id}
                // helperText={errors.google_client_id?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: 123456789012345678901"
              />

              <TextField
                label="auth_uri"
                fullWidth
                margin="normal"
                // {...register("google_auth_uri")}
                // error={!!errors.google_auth_uri}
                // helperText={errors.google_auth_uri?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://accounts.google.com/o/oauth2/auth"
              />

              <TextField
                label="token_uri"
                fullWidth
                margin="normal"
                // {...register("google_token_uri")}
                // error={!!errors.google_token_uri}
                // helperText={errors.google_token_uri?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://oauth2.googleapis.com/token"
              />

              <TextField
                label="auth_provider_x509_cert_url"
                fullWidth
                margin="normal"
                // {...register("google_auth_provider_x509_cert_url")}
                // error={!!errors.google_auth_provider_x509_cert_url}
                // helperText={errors.google_auth_provider_x509_cert_url?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://www.googleapis.com/oauth2/v1/certs"
              />

              <TextField
                label="client_x509_cert_url"
                fullWidth
                margin="normal"
                // {...register("google_client_x509_cert_url")}
                // error={!!errors.google_client_x509_cert_url}
                // helperText={errors.google_client_x509_cert_url?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project-id.iam.gserviceaccount.com"
              />
            </>
          ) : isGoogleEmail ? (
            <>
              <TextField
                label="Email Address"
                fullWidth
                margin="normal"
                // {...register("redshiftUser")}
                // error={!!errors.redshiftUser}
                // helperText={errors.redshiftUser?.message}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Password"
                fullWidth
                margin="normal"
                // {...register("redshiftPassword")}
                // error={!!errors.redshiftPassword}
                // helperText={errors.redshiftPassword?.message}
                InputLabelProps={{ shrink: true }}
              />
            </>
          ) : isGoogleMemcached ? (
            <>
              <TextField
                label="Host"
                fullWidth
                margin="normal"
                // {...register("redshiftHost")}
                // error={!!errors.redshiftHost}
                // helperText={errors.redshiftHost?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="your-memcached-node-ip-1"
              />

              <TextField
                label="Port"
                fullWidth
                margin="normal"
                // {...register("redshiftPort")}
                // error={!!errors.redshiftPort}
                // helperText={errors.redshiftPort?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="6379"
              />

              <TextField
                label="VPC Network"
                fullWidth
                margin="normal"
                // {...register("redshiftPassword")}
                // error={!!errors.redshiftPassword}
                // helperText={errors.redshiftPassword?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: projects/your-project-id/global/networks/your-vpc-network"
              />
            </>
          ) : isGoogleRedis ? (
            <>
              <TextField
                label="Host"
                fullWidth
                margin="normal"
                // {...register("redshiftHost")}
                // error={!!errors.redshiftHost}
                // helperText={errors.redshiftHost?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="your-redis-instance-ip"
              />

              <TextField
                label="Port"
                fullWidth
                margin="normal"
                // {...register("redshiftPort")}
                // error={!!errors.redshiftPort}
                // helperText={errors.redshiftPort?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="6379"
              />

              <TextField
                label="Password"
                fullWidth
                margin="normal"
                // {...register("redshiftPassword")}
                // error={!!errors.redshiftPassword}
                // helperText={errors.redshiftPassword?.message}
                InputLabelProps={{ shrink: true }}
              />
            </>
          ) : isGoogleCloudSpanner ? (
            <>
              <TextField
                label="type"
                fullWidth
                margin="normal"
                // {...register("google_service_account")}
                // error={!!errors.google_service_account}
                // helperText={errors.google_service_account?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: service_account"
              />

              <TextField
                label="project_id"
                fullWidth
                margin="normal"
                // {...register("google_project_id")}
                // error={!!errors.google_project_id}
                // helperText={errors.google_project_id?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: your-gcp-project-id"
              />

              <TextField
                label="private_key_id"
                fullWidth
                margin="normal"
                // {...register("google_private_key_id")}
                // error={!!errors.google_private_key_id}
                // helperText={errors.google_private_key_id?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: abcdef1234567890abcdef1234567890abcdef12"
              />

              <TextField
                label="private_key"
                fullWidth
                margin="normal"
                // {...register("google_private_key")}
                // error={!!errors.google_private_key}
                // helperText={errors.google_private_key?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: --BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9...==\n-----END PRIVATE KEY--\n"
              />

              <TextField
                label="client_email"
                fullWidth
                margin="normal"
                // {...register("google_client_email")}
                // error={!!errors.google_client_email}
                // helperText={errors.google_client_email?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: your-service-account@your-project-id.iam.gserviceaccount.com"
              />

              <TextField
                label="client_id"
                fullWidth
                margin="normal"
                // {...register("google_client_id")}
                // error={!!errors.google_client_id}
                // helperText={errors.google_client_id?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: 123456789012345678901"
              />

              <TextField
                label="auth_uri"
                fullWidth
                margin="normal"
                // {...register("google_auth_uri")}
                // error={!!errors.google_auth_uri}
                // helperText={errors.google_auth_uri?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://accounts.google.com/o/oauth2/auth"
              />

              <TextField
                label="token_uri"
                fullWidth
                margin="normal"
                // {...register("google_token_uri")}
                // error={!!errors.google_token_uri}
                // helperText={errors.google_token_uri?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://oauth2.googleapis.com/token"
              />

              <TextField
                label="auth_provider_x509_cert_url"
                fullWidth
                margin="normal"
                // {...register("google_auth_provider_x509_cert_url")}
                // error={!!errors.google_auth_provider_x509_cert_url}
                // helperText={errors.google_auth_provider_x509_cert_url?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://www.googleapis.com/oauth2/v1/certs"
              />

              <TextField
                label="client_x509_cert_url"
                fullWidth
                margin="normal"
                // {...register("google_client_x509_cert_url")}
                // error={!!errors.google_client_x509_cert_url}
                // helperText={errors.google_client_x509_cert_url?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="Eg: https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project-id.iam.gserviceaccount.com"
              />
            </>
          ) : isGoogleCloudSQL ? (
            <>
              <Autocomplete
                options={GOOGLE_CLOUD_SQL}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cosmos DB API"
                    fullWidth
                    margin="normal"
                    // error={!!errors.cosmosDbApi}
                    // helperText={errors.cosmosDbApi?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
              <TextField
                label="Connection String"
                fullWidth
                margin="normal"
                // {...register("azureConnectionString")}
                // error={!!errors.azureConnectionString}
                // helperText={
                //   errors.azureConnectionString?.message ||
                //   `Example: ${getConnectionStringExample("Azure", selectedSubCategory)}`
                // }
                placeholder={getConnectionStringExample(
                  "Azure",
                  selectedSubCategory
                )}
                InputLabelProps={{ shrink: true }}
                multiline
                rows={3}
              />
            </>
          ) : isAzureCosmosDB ? (
            <>
              <Autocomplete
                options={COSMOS_DB_API_OPTIONS}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cosmos DB API"
                    fullWidth
                    margin="normal"
                    // error={!!errors.cosmosDbApi}
                    // helperText={errors.cosmosDbApi?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
              <TextField
                label="Connection String"
                fullWidth
                margin="normal"
                // {...register("azureConnectionString")}
                // error={!!errors.azureConnectionString}
                // helperText={
                //   errors.azureConnectionString?.message ||
                //   `Example: ${getConnectionStringExample("Azure", selectedSubCategory)}`
                // }
                placeholder={getConnectionStringExample(
                  "Azure",
                  selectedSubCategory
                )}
                InputLabelProps={{ shrink: true }}
                multiline
                rows={3}
              />
            </>
          ) : isAzureService ? (
            <TextField
              label="Connection String"
              fullWidth
              margin="normal"
              // {...register("azureConnectionString")}
              // error={!!errors.azureConnectionString}
              // helperText={
              //   errors.azureConnectionString?.message ||
              //   `Example: ${getConnectionStringExample("Azure", selectedSubCategory)}`
              // }
              placeholder={getConnectionStringExample(
                "Azure",
                selectedSubCategory
              )}
              InputLabelProps={{ shrink: true }}
              multiline
              rows={3}
            />
          ) : isAzureService ? (
            <TextField
              label="Connection String"
              fullWidth
              margin="normal"
              // {...register("azureConnectionString")}
              // error={!!errors.azureConnectionString}
              // helperText={
              //   errors.azureConnectionString?.message ||
              //   `Example: ${getConnectionStringExample("Azure", selectedSubCategory)}`
              // }
              placeholder={getConnectionStringExample(
                "Azure",
                selectedSubCategory
              )}
              InputLabelProps={{ shrink: true }}
              multiline
              rows={3}
            />
          ) : isAWSRedshift ? (
            <>
              <TextField
                label="Host"
                fullWidth
                margin="normal"
                // {...register("redshiftHost")}
                // error={!!errors.redshiftHost}
                // helperText={errors.redshiftHost?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="your-cluster-name.123456789012.us-east-1.redshift.amazonaws.com"
              />

              <TextField
                label="Port"
                fullWidth
                margin="normal"
                // {...register("redshiftPort")}
                // error={!!errors.redshiftPort}
                // helperText={errors.redshiftPort?.message}
                InputLabelProps={{ shrink: true }}
                placeholder="5439"
              />

              <TextField
                label="Database"
                fullWidth
                margin="normal"
                // {...register("redshiftDatabase")}
                // error={!!errors.redshiftDatabase}
                // helperText={errors.redshiftDatabase?.message}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Username"
                fullWidth
                margin="normal"
                // {...register("redshiftUser")}
                // error={!!errors.redshiftUser}
                // helperText={errors.redshiftUser?.message}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Password"
                fullWidth
                margin="normal"
                // {...register("redshiftPassword")}
                // error={!!errors.redshiftPassword}
                // helperText={errors.redshiftPassword?.message}
                InputLabelProps={{ shrink: true }}
              />
            </>
          ) : isAWSDynamoDB ? (
            <>
              <TextField
                label="Access Key ID"
                fullWidth
                margin="normal"
                // {...register("dynamoAccessKeyId")}
                // error={!!errors.dynamoAccessKeyId}
                // helperText={errors.dynamoAccessKeyId?.message}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Secret Access Key"
                fullWidth
                margin="normal"
                // {...register("dynamoSecretAccessKey")}
                // error={!!errors.dynamoSecretAccessKey}
                // helperText={errors.dynamoSecretAccessKey?.message}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Region"
                fullWidth
                margin="normal"
                // {...register("dynamoRegion")}
                // error={!!errors.dynamoRegion}
                // helperText={
                //   errors.dynamoRegion?.message || "Example: us-east-1"
                // }
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Table Name"
                fullWidth
                margin="normal"
                // {...register("dynamoTable")}
                // error={!!errors.dynamoTable}
                // helperText={errors.dynamoTable?.message}
                InputLabelProps={{ shrink: true }}
              />
            </>
          ) : isAWSS3 ? (
            <>
              <TextField
                label="AWS Access Key ID"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!errors.awsAccessKeyId}
                helperText={errors.awsAccessKeyId?.message}
                {...register("awsAccessKeyId")}
              />

              <TextField
                label="AWS Secret Access Key"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!errors.awsSecretAccessKey}
                helperText={errors.awsSecretAccessKey?.message}
                {...register("awsSecretAccessKey")}
              />

              <TextField
                label="AWS Region"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!errors.awsRegion}
                helperText={errors.awsRegion?.message || "Example: us-east-1"}
                {...register("awsRegion")}
              />

              <TextField
                label="S3 Bucket Name"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!errors.s3BucketName}
                helperText={errors.s3BucketName?.message}
                {...register("s3BucketName")}
              />
            </>
          ) : isAWSEC2 ? (
            <>
              <TextField
                label="Host"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                // error={!!errors.ec2Host}
                // helperText={errors.ec2Host?.message}
                // {...register("ec2Host")}
              />

              <TextField
                label="Port"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                // error={!!errors.ec2Port}
                // helperText={errors.ec2Port?.message}
                // {...register("ec2Port")}
              />

              <TextField
                label="Username"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                // error={!!errors.ec2Username}
                // helperText={errors.ec2Username?.message}
                // {...register("ec2Username")}
              />

              <TextField
                label="Key Path"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                // error={!!errors.ec2KeyPath}
                // helperText={errors.ec2KeyPath?.message}
                // {...register("ec2KeyPath")}
              />
            </>
          ) : isAWSRDS ? (
            <>
              <Autocomplete
                options={RDS_ENGINE_OPTIONS}
                getOptionLabel={(option) => option}
                // onChange={(_, newValue) =>
                //   setValue("rdsEngine", newValue || "")
                // }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Database Engine"
                    fullWidth
                    margin="normal"
                    // error={!!errors.rdsEngine}
                    // helperText={errors.rdsEngine?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />

              <TextField
                label="Connection String"
                fullWidth
                margin="normal"
                {...register("account")}
                error={!!errors.account}
                helperText={
                  errors.account?.message ||
                  `Example: ${getConnectionStringExample(watch("rdsEngine") || "MySQL")}`
                }
                placeholder={getConnectionStringExample(
                  watch("rdsEngine") || "MySQL"
                )}
                InputLabelProps={{ shrink: true }}
              />
            </>
          ) : isDatabase ? (
            <TextField
              label="Connection String"
              fullWidth
              margin="normal"
              {...register("account")}
              error={!!errors.account}
              helperText={
                errors.account?.message ||
                `Example: ${getConnectionStringExample(datastore, selectedSubCategory ?? "")}`
              }
              InputLabelProps={{ shrink: true }}
            />
          ) : null}

          {/* <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={(watch("data") || "").split(",").filter(Boolean)}
            onChange={(_, newValue) => {
              setValue("data", newValue.join(","));
            }}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={option}
                    {...tagProps}
                    sx={{
                      backgroundColor: "#e3f2fd",
                      color: "#0d47a1",
                      fontWeight: 500,
                      borderRadius: "8px",
                      paddingX: "4px",
                      margin: "2px",
                      boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
                      "& .MuiChip-deleteIcon": {
                        color: "#0d47a1",
                        ":hover": {
                          color: "#1565c0",
                        },
                      },
                    }}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Data"
                margin="normal"
                error={!!errors.data}
                helperText={errors.data?.message}
              />
            )}
          /> */}

          {/* <FormControlLabel
            control={
              <Switch
                {...register('status')}
                checked={watch('status')}
                onChange={(e) => setValue('status', e.target.checked)}
                color="primary"
              />
            }
            label={watch('status') ? 'Active' : 'Inactive'}
          /> */}
        </DialogContent>
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            backgroundColor: (theme: Theme) =>
              theme.palette.mode === "light" ? "#f7f7f7" : "black",
            padding: "16px 24px",
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                boxShadow: "none",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                fontSize: "0.8rem",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                },
              }}
            >
              {id !== "new" ? "Update" : "Create"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={() => reset()}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                borderColor: (theme: Theme) =>
                  theme.palette.mode === "light" ? "#282B73" : "#282B73",
                color: (theme: Theme) =>
                  theme.palette.mode === "light" ? "#333" : "white",
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                fontSize: "0.8rem",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: "translateY(-2px)",
                  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </form>
    </Dialog>
  );
}
