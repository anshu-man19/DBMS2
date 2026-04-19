import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import XIcon from "@mui/icons-material/X";
import { Box, Container, Divider, Grid2 as Grid, Link, Stack, Typography } from "@mui/material";
import { quickLinks } from "@/constants/landing";

export function PublicFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        background: "linear-gradient(180deg, #4a148c 0%, #38006b 100%)",
        color: "#fff"
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={1.2}>
              <Typography variant="h5">Career Development Centre</Typography>
              <Typography sx={{ opacity: 0.78 }}>
                Recruiter-first workflows for company onboarding, JNF submission, and placement coordination at IIT
                (ISM) Dhanbad.
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1.2}>
              {quickLinks.map((item) => (
                <Link key={item.label} href={item.href} sx={{ opacity: 0.82, color: "inherit", textDecoration: "none", "&:hover": { opacity: 1 } }}>
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <Typography variant="h6" gutterBottom>
              Social
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Link href="https://linkedin.com/company/iitism" target="_blank" sx={{ color: "inherit" }}>
                <LinkedInIcon />
              </Link>
              <Link href="https://twitter.com/iitism" target="_blank" sx={{ color: "inherit" }}>
                <XIcon />
              </Link>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 2.5 }}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Stack spacing={1.1}>
              <Link href="mailto:cdc@iitism.ac.in" sx={{ opacity: 0.82, color: "inherit", textDecoration: "none", "&:hover": { opacity: 1 } }}>
                cdc@iitism.ac.in
              </Link>
              <Typography sx={{ opacity: 0.82 }}>+91 326 223 5444</Typography>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <PlaceOutlinedIcon sx={{ mt: 0.25, fontSize: 18 }} />
                <Typography sx={{ opacity: 0.82 }}>
                  Career Development Centre, IIT (ISM) Dhanbad, Jharkhand, India
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />
        <Typography sx={{ opacity: 0.62 }}>
          Designed for recruiter onboarding, communication clarity, and high-volume campus engagement.
        </Typography>
      </Container>
    </Box>
  );
}
