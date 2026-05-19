import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BiologyQuestionGenerator, {
  canGenerateNextQuestion,
} from "../../pages/BiologyQuestionGenerator";
import { useAppContext } from "../../helpers/ContextApi";
import { post } from "../../helpers/FecthApi.jsx";
import { createMockAppContext } from "../utils/mockAppContext";

jest.mock("../../helpers/ContextApi", () => ({
  useAppContext: jest.fn(),
}));

jest.mock("../../helpers/FecthApi.jsx", () => ({
  post: jest.fn(),
}));

describe("BiologyQuestionGenerator page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("generates a question for the selected topic and stores the updated usage", async () => {
    const context = createMockAppContext();
    useAppContext.mockReturnValue(context);
    post.mockResolvedValue({
      data: { id: 1, question: "What is DNA replication?" },
      question_generation_usage: { questions_used: 5, questions_remaining: 5 },
    });

    render(<BiologyQuestionGenerator />);

    await userEvent.click(screen.getByText("Cell and Molecular Biology"));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith("ai/biology", {
        parameter: "Biologia Celular y Molecular",
      });
    });
    expect(context.resetQuestionState).toHaveBeenCalled();
    expect(context.resetQuestionData).toHaveBeenCalled();
    expect(context.setQuestionData).toHaveBeenCalledWith({
      id: 1,
      question: "What is DNA replication?",
    });
    expect(context.setQuestionGenerationUsage).toHaveBeenCalledWith({
      questions_used: 5,
      questions_remaining: 5,
    });
    expect(screen.getByText(/Selected topic:/)).toBeInTheDocument();
  });

  test("falls back to incrementing usage locally when the API does not return usage data", async () => {
    const context = createMockAppContext();
    useAppContext.mockReturnValue(context);
    post.mockResolvedValue({
      data: { id: 1, question: "What is mitochondrial inheritance?" },
    });

    render(<BiologyQuestionGenerator />);

    await userEvent.click(screen.getByText("Genetics"));

    await waitFor(() => {
      expect(context.incrementQuestionGenerationUsage).toHaveBeenCalled();
    });
  });

  test("shows a warning when the API fails to generate a question", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    useAppContext.mockReturnValue(createMockAppContext());
    post.mockRejectedValue({ response: { data: { detail: "Generator offline" } } });

    render(<BiologyQuestionGenerator />);

    await userEvent.click(screen.getByText("Genetics"));

    expect(await screen.findByText("Generator offline")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
  });

  test("shows the fallback generation error and loading spinner states", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    useAppContext.mockReturnValue(
      createMockAppContext({
        isLoading: true,
      }),
    );

    const { rerender } = render(<BiologyQuestionGenerator />);

    expect(document.querySelector(".spinner-border")).toBeInTheDocument();

    useAppContext.mockReturnValue(createMockAppContext());
    post.mockRejectedValue({});
    rerender(<BiologyQuestionGenerator />);

    await userEvent.click(screen.getByText("Cell and Molecular Biology"));

    expect(await screen.findByText("Unable to generate a new question right now.")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
  });

  test("allows changing the topic and requesting the next question", async () => {
    const context = createMockAppContext();
    useAppContext.mockReturnValue(context);
    post
      .mockResolvedValueOnce({
        data: { id: 1, question: "Q1" },
      })
      .mockResolvedValueOnce({
        data: { id: 2, question: "Q2" },
      });

    render(<BiologyQuestionGenerator />);

    await userEvent.click(screen.getByText("Cell and Molecular Biology"));
    await screen.findByText(/Selected topic:/);
    await userEvent.click(screen.getByRole("button", { name: "Next question" }));
    await userEvent.click(screen.getByRole("button", { name: "Change topic" }));

    expect(post).toHaveBeenNthCalledWith(1, "ai/biology", {
      parameter: "Biologia Celular y Molecular",
    });
    expect(post).toHaveBeenNthCalledWith(2, "ai/biology", {
      parameter: "Biologia Celular y Molecular",
    });
    expect(context.resetQuestionState).toHaveBeenCalledTimes(2);
    expect(context.resetQuestionData).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Choose your biology topic")).toBeInTheDocument();
  });

  test("does not allow requesting the next question without a selected topic", () => {
    expect(canGenerateNextQuestion(null)).toBe(false);
    expect(canGenerateNextQuestion(undefined)).toBe(false);
    expect(
      canGenerateNextQuestion({ apiName: "Biologia Celular y Molecular" }),
    ).toBe(true);
  });
});
