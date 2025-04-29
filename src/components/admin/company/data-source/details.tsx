"use client";
import {
  Box,
  Typography,
  Divider,
  Chip,
  Stack,
  Button,
  Checkbox,
  Menu,
  MenuItem,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useState } from "react";

export default function DataSourceHeader() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const colorMap: Record<string, string> = {
    PERSONAL: "#3f51b5", // Indigo
    FINANCIAL: "#009688", // Teal
    HEALTH: "#e91e63", // Pink
    LEGAL: "#ff9800", // Orange
    INTERNAL: "#607d8b", // Blue Grey
    BUSINESS_IP: "#673ab7", // Add custom for Business & IP
  };
  const dataClasses = [
    { name: "Carfinder Name", value: "133.4K" },
    { name: "EU Debt Card Number", value: "133.4K" },
    { name: "CC Magnetic Stripe Data", value: "133.4K" },
    { name: "Card Verification Code (CVC)", value: "133.4K" },
    { name: "CC Pin", value: "133.4K" },
    { name: "Tacoyer Identification Number", value: "35.6K" },
    { name: "Employee ID", value: "25.6K", check: true },
    { name: "Financial Account Number", value: "20K" },
    { name: "German Driver's License", value: "19.6K" },
    { name: "Germany Bank Account Number", value: "19.6K" },
    { name: "Full Name", value: "14.5K" },
    { name: "Vehicle Identification Number", value: "14.5K" },
    { name: "Passport Number", value: "5K" },
    { name: "Revenue", value: "3" },
    { name: "ZIP Code", value: "1" },
  ];

  const items = ["Personal", "Business & IP", "Financial"];
  return (
    <Box
      sx={{
        p: 3,
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#fafafa",
      }}
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
          sx={{
            color: "#1a1a1a",
            borderColor: "#e0e0e0",
            fontWeight: 500,
            textTransform: "none",
            px: 2,
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "#e0e0e0",
            },
          }}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          Actions
        </Button>
        <Menu
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
        </Menu>
      </Box>

      <Divider
        sx={{ borderColor: "#E0E0E0", marginBottom: "24px", marginTop: "10px" }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            p: 3,
            backgroundColor: "#ffffff",
            width: "380px",
          }}
        >
          {/* Main Header */}
          <Typography
            variant="h5"
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              mb: 3,
              color: "#1a1a1a",
            }}
          >
            Datastore Details
          </Typography>
          <Divider
            sx={{
              borderColor: "#E0E0E0",
              marginBottom: "17px",
              marginTop: "2px",
            }}
          />

          {/* Scan Status Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                mb: 2,
                color: "#1a1a1a",
              }}
            >
              Scan Status
            </Typography>
            <Divider
              sx={{
                borderColor: "#E0E0E0",
                marginBottom: "24px",
                marginTop: "10px",
              }}
            />

            <Box sx={{ pl: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                First discovered
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#5f6368",

                  mb: 2,
                }}
              >
                06 Sep 2024, 02:20 PM
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Last seen
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#5f6368",

                  mb: 2,
                }}
              >
                19 Sep 2024, 02:20 PM
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Last data refresh
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#5f6368",
                }}
              >
                13 Sep 2024, 02:20 PM
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

          {/* User Tags Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                mb: 2,
                color: "#1a1a1a",
              }}
            >
              User Tags
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                pl: 1,
              }}
            >
              <Chip
                label="No Tags"
                size="small"
                sx={{
                  backgroundColor: "#f5f5f5",
                  color: "#1a1a1a",
                  mr: 1,
                  borderRadius: "4px",
                }}
              />
              <Button
                size="small"
                startIcon={<AddIcon sx={{ fontSize: "16px" }} />}
                sx={{
                  color: "#1a1a1a",
                  textTransform: "none",
                  fontSize: "14px",
                  p: 0,
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                Add / Manage
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

          {/* Datastore Contacts Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                mb: 2,
                color: "#1a1a1a",
              }}
            >
              Datastore Contacts
            </Typography>
            <Box sx={{ pl: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Checkbox
                  size="small"
                  sx={{
                    p: 0,
                    mr: 1,
                    color: "#5f6368",
                    "&.Mui-checked": {
                      color: "#1976d2",
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#5f6368" }}
                ></Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  size="small"
                  checked
                  sx={{
                    p: 0,
                    mr: 1,
                    color: "#1976d2",
                  }}
                />
                <Typography variant="body2">Phil Nardone</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            p: 3,
            backgroundColor: "#ffffff",
            fontFamily: "Arial, sans-serif",
            color: "#1A1A1A",
            width: "700px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              mb: 3,
              color: "#1a1a1a",
            }}
          >
            Classified Data
          </Typography>
          <Divider
            sx={{
              borderColor: "#E0E0E0",
              marginBottom: "17px",
              marginTop: "2px",
            }}
          />

          {/* Total Files */}
          <Box sx={{ display: "flex", mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#5f6368",
                fontWeight: "500px",
                mb: 2,
                fontSize: "16px",
              }}
            >
              Total number of sensitive files
            </Typography>
          </Box>

          {/* Data Categories */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#5f6368",
                fontWeight: 500,
                mb: 2,
                fontSize: "16px",
              }}
            >
              Data categories
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns="repeat(2, max-content)"
              gap={1}
              sx={{ paddingTop: 2 }}
            >
              {items.map((item, index) => {
                let labelKey = item
                  .trim()
                  .toUpperCase()
                  .replace(/ & /g, "_")
                  .replace(/\s+/g, "_");
                const baseColor = colorMap[labelKey] || "#616161";

                return (
                  <Chip
                    key={index}
                    label={item}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      borderRadius: "6px",
                      color: baseColor,
                      backgroundColor: `${baseColor}20`, // ~12.5% opacity
                      border: `1px solid ${baseColor}`,
                      height: "24px",
                    }}
                  />
                );
              })}
            </Box>
          </Box>
          {/* Data Classes */}
          <Box
            sx={{
              borderRadius: "4px",
              backgroundColor: "#ffffff",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Data classes
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
              }}
            >
              {dataClasses.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    p: 0.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">
                    {item.name}:{item.check && " ✅"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#5f6368",
                      fontWeight: 500,
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Data Context */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#5f6368",
                fontWeight: "500px",
                mb: 2,
                fontSize: "16px",
              }}
            >
              Data context
            </Typography>
            <Box sx={{ display: "flex", gap: "8px" }}>
              <Typography>- Employee data</Typography>
              <Typography>● EU</Typography>
              <Typography>● Identifiable</Typography>
            </Box>
          </Box>

          {/* Collections */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#5f6368",
                fontWeight: "500px",
                mb: 2,
                fontSize: "16px",
              }}
            >
              Collections
            </Typography>
            <Typography>- Learned</Typography>
          </Box>

          {/* File Types */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "#5f6368",
                fontWeight: "500px",
                mb: 2,
                fontSize: "16px",
              }}
            >
              File types
            </Typography>
            <Typography sx={{ minWidth: "180px" }}>File types</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
              <Typography>
                -csv<span style={{ marginLeft: "8px" }}>1.8M</span>
              </Typography>
              <Typography>
                log<span style={{ marginLeft: "8px" }}>1.2M</span>
              </Typography>
              <Typography>
                parquet<span style={{ marginLeft: "8px" }}>1.1M</span>
              </Typography>
              <Typography>
                xslx<span style={{ marginLeft: "8px" }}>248K</span>
              </Typography>
              <Typography>
                zip<span style={{ marginLeft: "8px" }}>59K</span>
              </Typography>
              <Typography>
                txt<span style={{ marginLeft: "8px" }}>15.6K</span>
              </Typography>
              <Typography>
                docx<span style={{ marginLeft: "8px" }}>658</span>
              </Typography>
              <Typography>
                pdf<span style={{ marginLeft: "8px" }}>12</span>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
