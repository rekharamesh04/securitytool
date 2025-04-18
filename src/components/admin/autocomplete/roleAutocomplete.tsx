'use client';

import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axiosInstance from "@/utils/axiosInstance";

interface Role {
    _id: number;
    name: string;
}

interface RoleAutocompleteProps {
    setValue: any;
    value: any;
}

const RoleAutocomplete: React.FC<RoleAutocompleteProps> = (props) => {
    const [companies, setCompanies] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { setValue, value } = props;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get("/admin/user/roles");
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
            getOptionLabel={(option: Role) => option.name || ""}
            getOptionKey={(option: Role) => option._id.toString()}
            loading={loading}
            onChange={(_, data) => {
                setValue("role", { _id: data?._id, name: data?.name });
            }}
            value={value}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select Role"
                    variant="outlined"
                    fullWidth
                />
            )}
        />
    );
};

export default RoleAutocomplete;
