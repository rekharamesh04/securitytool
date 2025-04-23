"use client";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  Box,
  Container,
  Grid2,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React from "react";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{ py: 3, mt: 3, bgcolor: "#00112A", color: "#fff" }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Image
                src="/logo.png"
                alt="CIGI Technologies"
                width={200}
                height={50}
              />
              <Typography variant="body2" sx={{ mt: 2, mb: 2, opacity: 0.8 }}>
                Copyright CIGroup USA © 2023 - All Rights Reserved
              </Typography>
              <Stack direction="row" spacing={2}>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}
                >
                  Privacy Policy
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}
                >
                  Terms and conditions
                </Typography>
              </Stack>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Grid2 container spacing={6}>
              <Grid2>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    position: "relative",
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      left: 0,
                      width: 48,
                      height: 2,
                      bgcolor: "secondary.main",
                    },
                  }}
                >
                  Contact Info
                </Typography>
                <List dense sx={{ py: 0 }}>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <LocationOnIcon color="secondary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">CIGROUP USA</Typography>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5, pl: 4.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          1630 Prosper Trails #420, Prosper, Texas 75087
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <PhoneIcon color="secondary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          469-304-9122
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <EmailIcon color="secondary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          info@cigroupusa.com
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Grid2>
              <Grid2>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    position: "relative",
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      left: 0,
                      width: 48,
                      height: 2,
                      bgcolor: "secondary.main",
                    },
                  }}
                >
                  Follow Us
                </Typography>
                <List dense sx={{ py: 0 }}>
                  {[
                    { icon: <FacebookIcon />, name: "Facebook" },
                    { icon: <TwitterIcon />, name: "Twitter" },
                    { icon: <InstagramIcon />, name: "Instagram" },
                    { icon: <LinkedInIcon />, name: "LinkedIn" },
                  ].map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        px: 0,
                        py: 0.5,
                        cursor: "pointer",
                        "&:hover": {
                          "& .MuiListItemIcon-root": {
                            color: "secondary.main",
                          },
                          "& .MuiTypography-root": { color: "secondary.main" },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, color: "#fff" }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{ transition: "color 0.2s" }}
                          >
                            {item.name}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid2>
            </Grid2>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default Footer;
