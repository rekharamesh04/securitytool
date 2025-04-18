"use client";

import GrafanaDashboard from "@/components/grafana/dashboard";
import { getFetcher } from "@/utils/fetcher";
import { Box } from "@mui/material";
import useSWR from "swr";

export default function CompanyPage() {
  const locationId = localStorage.getItem("location_id")

  const { data, isLoading } = useSWR(
    locationId ? `/company/locations/${locationId}` : null,
    getFetcher
  );

  if (isLoading) {
    return <Box>Loading...</Box>
  }

  return (
    <Box>
      {data?.dashboardUrl && <GrafanaDashboard url={data?.dashboardUrl} />}
    </Box>
  );
}
