import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("shared/ui/Button", () => {
    test("успешно рендерится с переданным текстом", () => {
        render(<Button>Нажми меня</Button>);

        const buttonElement = screen.getByRole("button", {
            name: /нажми меня/i,
        });

        expect(buttonElement).toBeInTheDocument();
    });

    test("применяет дефолтные пропсы (type='button' и класс 'primary')", () => {
        render(<Button>Кнопка</Button>);

        const buttonElement = screen.getByRole("button");

        expect(buttonElement).toHaveAttribute("type", "button");

        expect(buttonElement).toHaveClass(/_primary/);
    });

    test("корректно меняет класс при передаче variant='secondary'", () => {
        render(<Button variant="secondary">Вторичная</Button>);

        const buttonElement = screen.getByRole("button");

        expect(buttonElement).toHaveClass(/_secondary/);
        expect(buttonElement).not.toHaveClass(/_primary/);
    });

    test("успешно прокидывает сторонние атрибуты и кастомный className", () => {
        render(
            <Button className="custom-class" data-testid="my-button" disabled>
                Текст
            </Button>,
        );

        const buttonElement = screen.getByTestId("my-button");

        expect(buttonElement).toHaveClass("custom-class");
        expect(buttonElement).toBeDisabled();
    });

    test("вызывает функцию onClick при клике пользователя", async () => {
        const mockOnClick = vi.fn();

        const user = userEvent.setup();

        render(<Button onClick={mockOnClick}>Кликни</Button>);

        const buttonElement = screen.getByRole("button");

        await user.click(buttonElement);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
