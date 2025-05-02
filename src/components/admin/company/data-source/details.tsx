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
  Tabs,
  Tab,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function DataSourceHeader() {
  const router = useRouter();
  const pathname = usePathname();
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

  const tabs = [
    { label: 'Overview', route: '/' },
    { label: 'Issues', route: '/issues' },
    { label: 'Classified Data', route: '/ClassifiedData' },
  ];


  const currentTabIndex = tabs.findIndex(tab => tab.route === pathname);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    router.push(tabs[newValue].route);
  };
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


<Box sx={{ width: '100%', mt: 4 }}>
      <Tabs
        value={currentTabIndex === -1 ? false : currentTabIndex}
        onChange={handleChange}
        textColor="inherit"
        TabIndicatorProps={{
          style: { backgroundColor: 'black' },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.route}
            label={tab.label}
            sx={{
              color: 'black',
              '&.Mui-selected': {
                color: 'black',
                fontWeight: 'bold',
              },
            }}
          />
        ))}
      </Tabs>
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

          <Box sx={{mt: 3}}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                mb: 2,
                color: "#1a1a1a",
              }}
            >
              Properties
            </Typography>

            <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 1,
                color: "#5f6368",
              }}
            >
              Account
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 4,
                color: "#1a1a1a",
              }}
            >
              Stark (AWS)
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 1,
                color: "#5f6368",
              }}
            >
              Mounted On
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 4,
                color: "#1a1a1a",
              }}
            >
              Creeds Datastore
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 1,
                color: "#5f6368",
              }}
            >
              Datastore Type
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 4,
                color: "#1a1a1a",
              }}
            >
              S3 Bucket
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 1,
                color: "#5f6368",
              }}
            >
              Regions
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 4,
                color: "#1a1a1a",
              }}
            >
              us-east-1
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 1,
                color: "#5f6368",
              }}
            >
              Datastore size
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 4,
                color: "#1a1a1a",
              }}
            >
              867GB
            </Typography>
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
                const labelKey = item
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
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 600 }}>
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
          <Box sx={{ mb: 4 }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography>- Employee data</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['EU', 'Identifiable'].map((text) => (
                  <Box
                    key={text}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1, // square corners (use 0 for sharp)
                      border: '1px solid #ccc',
                      color: '#000',
                      fontSize: '0.875rem',
                    }}
                  >
                      {text}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Collections */}
          <Box sx={{ mb: 4 }}>
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
            <Box
              sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                backgroundColor: '#e3f2fd', // light blue
                color: '#000',
                borderRadius: 1, // square-like (set to 0 for hard edges)
                fontSize: '14px',
                border: '1px solid #bbdefb',
              }}
            >
              - Learned
            </Box>
          </Box>

          {/* File Types */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#5f6368',
                fontWeight: 500,
                mb: 2,
                fontSize: '16px',
              }}
            >
              File types
            </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
            {[
              ['csv', '1.8M'],
              ['log', '1.2M'],
              ['parquet', '1.1M'],
              ['xslx', '248K'],
              ['zip', '59K'],
              ['txt', '15.6K'],
              ['docx', '658'],
              ['pdf', '12'],
            ].map(([type, size]) => (
              <Box
                key={type}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 1, // square look
                  px: 1.5,
                  py: 0.75,
                  fontSize: '14px',
                  minWidth: '100px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#000',
                }}
              >
                <span>{type}</span>
                <span>{size}</span>
              </Box>
            ))}
          </Box>
        </Box>
        </Box>
      </Box>
    </Box>
  );
}
