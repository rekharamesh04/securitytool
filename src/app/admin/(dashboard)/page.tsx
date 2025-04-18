"use client";

import GrafanaDashboard from "@/components/grafana/dashboard";
import { Box } from "@mui/material";

export default function AdminPage() {
  return (
    <Box>
      <GrafanaDashboard url="https://cbs.cigmon.com/d/d6fe81ce-15f3-423d-903d-578a9bd00094/cb-n-w-firewall-data-snmp?orgId=1&from=1737539485690&to=1737561085690&viewPanel=2" />
    </Box>
  );
}
