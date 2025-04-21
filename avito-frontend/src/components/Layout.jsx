import { Box, Container } from '@mui/material';
import Header from './Header';            

export default function Layout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Header />
        {children}
      </Container>
    </Box>
  );
}