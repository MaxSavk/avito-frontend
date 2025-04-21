import { grey } from '@mui/material/colors';
import { Box, Container, Paper } from '@mui/material';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: grey[100],        
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Header />

        <Paper elevation={0} sx={{ p: 3, mt: 3 }}>
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
