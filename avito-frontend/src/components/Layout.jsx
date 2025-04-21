import { grey } from "@mui/material/colors";
import { Box, Container, Paper } from "@mui/material";
import Header from "./Header";

import { Typography } from '@mui/material';

export default function Layout({ children }) {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: grey[100],
                py: 4,
            }}
        >
            <Container maxWidth="md">
                <Header />
                <Paper
                    elevation={1}
                    sx={{
                        p: 3,
                        mt: 2,
                        borderRadius: 2,
                        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
                        backgroundColor: "#fff",
                    }}
                >
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {children}
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}
