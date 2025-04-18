'use client';

import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Box, Container, Grid2, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <Box component="footer" sx={{ py: 3, mt: 3, bgcolor: '#00112A', color: "#fff" }}>
            <Container>

                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Image src="/logo.png" alt="CIGI Technologies" width={300} height={100} />

                        <Box sx={{ mt: 2 }} />
                        <Typography>Copyright CIGroup USA © 2023 - All Rights Reserved</Typography>

                        <Stack direction="row" spacing={2} mt={2}>
                            <Typography>Privacy Policy</Typography>
                            <Typography>Terms and conditions</Typography>
                        </Stack>
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Grid2 container spacing={3}>
                            <Grid2 >
                                <Typography variant="h6">Contact Info</Typography>

                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <LocationOnIcon color='secondary' />
                                        </ListItemIcon>
                                        <ListItemText primary="CIGROUP USA" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="1630 Prosper Trails #420, Prosper, Texas 75087" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <PhoneIcon color='secondary' />
                                        </ListItemIcon>
                                        <ListItemText primary="469-304-9122" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <EmailIcon color='secondary' />
                                        </ListItemIcon>
                                        <ListItemText primary="info@cigroupusa.com" />
                                    </ListItem>
                                </List>
                            </Grid2>
                            <Grid2 >
                                <Typography variant="h6">Social Links</Typography>
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <FacebookIcon sx={{ color: "#fff" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Facebook" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <TwitterIcon sx={{ color: "#fff" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Twitter" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <InstagramIcon sx={{ color: "#fff" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Instagram" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <LinkedInIcon sx={{ color: "#fff" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Linkedin" />
                                    </ListItem>
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
