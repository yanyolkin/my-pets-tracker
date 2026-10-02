import { Link } from "react-router-dom";

export const NotFoundPage = () => {
    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>404 — Страница не найдена</h1>
            <Link to="/">Вернуться на главную</Link>
        </div>
    );
};
