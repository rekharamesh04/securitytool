// components/IssuesTab.tsx
import { Box, Typography, Divider } from "@mui/material";

export default function IssuesTab() {
    return (
        <Box>
        <Typography variant="h4">Issues Content</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography>
            This is where issues related to the datastore would be displayed.
        </Typography>
        </Box>
    );
}
