import { Link } from "react-router-dom";

export default function Header() {
    return (
        <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
            <Link to="/boards" style={{ marginRight: 10 }}>
                Доски
            </Link>
            {/* <Link to="/issues">Задачи</Link> */}
        </nav>
    );
}
