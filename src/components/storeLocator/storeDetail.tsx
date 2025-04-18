import { Button, Card, CardActions, CardContent, Dialog, DialogContent, DialogTitle, Icon, IconButton, Stack, Typography } from "@mui/material";
import { DialogProps } from "@toolpad/core";

interface ViewProps
    extends DialogProps<undefined, string | null> {
    store: any;
}

export default function StoreViewDetail({
    store,
    open,
    onClose,
}: ViewProps) {

    const handleDashboardClick = (store: any) => {
        console.log("store", store)
        window.open(store.dashboardUrl, "_blank");

    }

    return (
        <Dialog fullWidth open={open} onClose={() => onClose(null)}>
            <DialogTitle>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography variant="h5">
                        {store?.name}
                    </Typography>
                    <IconButton onClick={() => onClose(null)}>
                        <Icon>close</Icon>
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent>
                <Card>
                    <CardContent>
                        <Typography>{store?.address}</Typography>
                        <Typography>{store?.phone}</Typography>
                        <Typography>{store?.city}</Typography>
                        <Typography>{store?.state}</Typography>
                        <Typography>{store?.zip}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" onClick={() => handleDashboardClick(store)}>View Dashboard</Button>
                    </CardActions>
                </Card>
            </DialogContent>
        </Dialog>
    )

}