// Header.jsx
import { AppBar, Toolbar, Button, Container } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
    const { pathname } = useLocation();

    const linkBtn = (to, label) => (
        <Button
            component={Link}
            to={to}
            color="inherit"
            variant={pathname.startsWith(to) ? "contained" : "text"}
            sx={{ textTransform: "none", mr: 1 }}
        >
            {label}
        </Button>
    );

    return (
        <AppBar position="static" color="default" elevation={0}>
            <Container maxWidth="md">
                <Toolbar sx={{ p: 1 }}>
                    {linkBtn("/boards", "Доски")}
                    {linkBtn("/issues", "Все задачи")}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
