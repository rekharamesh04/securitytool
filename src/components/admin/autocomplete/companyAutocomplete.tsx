'use client';

import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axiosInstance from "@/utils/axiosInstance";

interface Company {
  _id: number;
  name: string;
}

interface CompanyAutocompleteProps {
  setValue: any;
  value: any;
}

const CompanyAutocomplete: React.FC<CompanyAutocompleteProps> = (props) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { setValue, value } = props;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/admin/company/companies");
        setCompanies(response.data.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Autocomplete
      options={companies}
      getOptionLabel={(option: Company) => option.name || ""}
      getOptionKey={(option: Company) => option._id.toString()}
      loading={loading}
      onChange={(_, data) => {
        setValue("company", { _id: data?._id, name: data?.name });
      }}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Company"
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
};

export default CompanyAutocomplete;
