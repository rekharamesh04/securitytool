"use client";

import GrafanaDashboard from "@/components/grafana/dashboard";
// import { getFetcher } from "@/utils/fetcher";
import { Box } from "@mui/material";
// import useSWR from "swr";

export default function CompanyPage() {
  // const locationId = localStorage.getItem("location_id");

  // const { data, isLoading } = useSWR(
  //   locationId ? `/company/locations/${locationId}` : null,
  //   getFetcher
  // );

  // if (isLoading) {
  //   return <Box>Loading...</Box>;
  // }

  return (
    // <Box>
    //   {data?.dashboardUrl && <GrafanaDashboard url={data?.dashboardUrl} />}
    // </Box>
    <Box>
      <GrafanaDashboard url="https://cbs.cigmon.com/d/d6fe81ce-15f3-423d-903d-578a9bd00094/cb-n-w-firewall-data-snmp?orgId=1&from=1737539485690&to=1737561085690&viewPanel=2" />
    </Box>
  );
}
