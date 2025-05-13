import { Box, Typography, Divider, Chip } from "@mui/material";

export default function ClassifiedInfo() {
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
        <Box>
          <Typography
          variant="h5"
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            mb: 3,
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {/* <Typography>- Employee data</Typography> */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {["EU", "Identifiable", "Employee data"].map((text) => (
                <Box
                  key={text}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1, // square corners (use 0 for sharp)
                    border: "1px solid #ccc",
                    fontSize: "0.875rem",
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
              display: "inline-block",
              px: 1.5,
              py: 0.5,
              backgroundColor: "#e3f2fd", // light blue
              color: "#000",
              borderRadius: 1, // square-like (set to 0 for hard edges)
              fontSize: "14px",
              border: "1px solid #bbdefb",
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
              color: "#5f6368",
              fontWeight: 500,
              mb: 2,
              fontSize: "16px",
            }}
          >
            File types
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
            {[
              ["csv", "1.8M"],
              ["log", "1.2M"],
              ["parquet", "1.1M"],
              ["xslx", "248K"],
              ["zip", "59K"],
              ["txt", "15.6K"],
              ["docx", "658"],
              ["pdf", "12"],
            ].map(([type, size]) => (
              <Box
                key={type}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1, // square look
                  px: 1.5,
                  py: 0.75,
                  fontSize: "14px",
                  minWidth: "100px",
                  display: "flex",
                  justifyContent: "space-between",

                }}
              >
                <span>{type}</span>
                <span>{size}</span>
              </Box>
            ))}
          </Box>
        </Box>
        </Box>
    );
}
