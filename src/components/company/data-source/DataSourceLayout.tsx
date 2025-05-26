"use client";
import {
  Box,
  Typography,
  Divider,
  Chip,
  Stack,
  Button,
  Tabs,
  Tab,
//   Menu,
//   MenuItem,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import theme from "@/theme/theme";

export default function DataSourceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { label: "Overview", route: "/company/data-source/dataDetails/overview" },
    { label: "Issues", route: "/company/data-source/dataDetails/issues" },
    { label: "Classified Data", route: "/company/data-source/dataDetails/classifiedData" },
  ];
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Redirect to overview if no matching tab is found
  useEffect(() => {
    const currentTabIndex = tabs.findIndex((tab) =>
      pathname?.startsWith(tab.route)
    );

    if (currentTabIndex === -1 && pathname?.startsWith("/company/data-source/dataDetails")) {
      router.replace(tabs[0].route);
    }
  }, [pathname, router]);

  const currentTabIndex = tabs.findIndex((tab) =>
    pathname?.startsWith(tab.route)
  );

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    router.push(tabs[newValue].route);
  };

  return (
    <Box
    sx={(theme) => ({
        p: 3,
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : theme.palette.background.default,
        // backgroundColor: "#fafafa",
      })}
    >
        {/* First Row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Datastores / Mongo
            </Typography>
        </Stack>

        <Divider
            sx={{ borderColor: "#E0E0E0", marginBottom: "24px", marginTop: "10px" }}
        />

        <Stack direction="row" spacing={1} alignItems="center">
            <Chip
            label="Restricted"
            size="small"
            sx={{
                backgroundColor: "#ffebee",
                color: "#d32f2f",
                fontWeight: 500,
            }}
            />
            <Typography variant="body2" sx={{ color: "#5f6368" }}>
            Enrichment: Wiz Issues
            </Typography>
        </Stack>

        {/* Second Row */}
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 2 }}
        >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
            credit-lab-3
            </Typography>
        </Stack>

        <Stack direction="row" spacing={3} alignItems="center">
            <Typography variant="body2">Scanned</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Auto-Scan:</Typography>
            <CheckCircleOutlineIcon
                sx={{
                color: "success.main",
                fontSize: "1rem",
                verticalAlign: "middle",
                }}
            />
            <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
                On
            </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Scan Priority:</Typography>
            <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
                Normal
            </Typography>
            </Stack>
        </Stack>

        {/* Third Row */}
            <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button
            variant="outlined"
            sx={(theme) => ({
                // color: "#1a1a1a",
                borderColor: "#e0e0e0",
                fontWeight: 500,
                textTransform: "none",
                backgroundColor: theme.palette.mode === 'light' ? '#f7f7f7' : theme.palette.background.default,
                px: 2,
                color: theme.palette.text.primary,
                "&:hover": {
                backgroundColor: "#f5f5f5",
                borderColor: "#e0e0e0",
                },
            })}
            onClick={(event) => setAnchorEl(event.currentTarget)}
            >
            Actions
            </Button>
            {/* <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
                sx: {
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                minWidth: "160px",
                },
            }}
            >
            <MenuItem
                onClick={() => setAnchorEl(null)}
                sx={{
                fontSize: "14px",
                "&:hover": {
                    backgroundColor: "#f5f5f5",
                },
                }}
            >
                Edit Data
            </MenuItem>
            <MenuItem
                onClick={() => setAnchorEl(null)}
                sx={{
                fontSize: "14px",
                color: "#d32f2f",
                "&:hover": {
                    backgroundColor: "#ffebee",
                },
                }}
            >
                Delete Data
            </MenuItem>
            </Menu> */}
        </Box>

        <Divider
            sx={{ borderColor: "#E0E0E0", marginBottom: "24px", marginTop: "10px" }}
        />

        <Box sx={{ width: "100%", mt: 4 }}>
            <Tabs
            value={currentTabIndex === -1 ? 0 : currentTabIndex}
            onChange={handleChange}
            textColor="inherit"
            TabIndicatorProps={{
                style: {backgroundColor: theme.palette.text.primary },
            }}
            >
            {tabs.map((tab) => (
                <Tab
                key={tab.route}
                label={tab.label}
                sx={(theme) => ({
                    // color: "black",
                    color: theme.palette.text.primary,
                    "&.Mui-selected": {
                    // color: "black",
                    color: theme.palette.text.primary,
                    fontWeight: "bold",
                    },
                })}
                />
            ))}
            </Tabs>
        </Box>

        <Divider
            sx={{ borderColor: "#E0E0E0", marginBottom: "24px", marginTop: "10px" }}
        />

        {/* This is where the tab content will be rendered */}
        {children}
        </Box>
);
}
