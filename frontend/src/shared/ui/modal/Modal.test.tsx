import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";
import { beforeEach, describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe("shared/ui/modal", () => {
    beforeEach(() => {
        HTMLDialogElement.prototype.showModal = vi.fn();
        HTMLDialogElement.prototype.close = vi.fn();
    });

    test("Render modal and handle close interaction", async () => {
        const mockFn = vi.fn();
        const user = userEvent.setup();

        render(
            <Modal isOpen={true} close={mockFn}>
                <p>Hello</p>
            </Modal>,
        );

        const modal = screen.getByTestId("modal-container");
        expect(modal).toBeInTheDocument();
        expect(screen.getByText("Hello")).toBeInTheDocument();
        const closeButton = modal.querySelector("button");
        await user.click(closeButton!);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
