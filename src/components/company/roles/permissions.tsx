import { PermissionModel } from '@/models/Permission.model';
import axiosInstance from '@/utils/axiosInstance';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';

interface FormSelectProps {
    value?: any;
    onChange?: (selectedIds: string[]) => void;
}

const PermissionSelect: React.FC<FormSelectProps> = ({ value, onChange }) => {
    const [permissions, setPermissions] = useState<PermissionModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // State for pagination
    const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
        page: 0,
        pageSize: 5,
    });

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await axiosInstance.get('/admin/user/all_permissions');
                setPermissions(response.data);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, []);

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 250 },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={permissions}
                columns={columns}
                pagination
                pageSizeOptions={[5, 10, 25]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                checkboxSelection
                loading={loading}
                getRowId={(row) => row._id}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    if (onChange) {
                        const selectedIds = newRowSelectionModel as string[];
                        onChange(selectedIds);
                    }
                }}
                rowSelectionModel={value}
            />
        </div>
    );
};

export default PermissionSelect;