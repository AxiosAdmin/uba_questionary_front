import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Question from "../../pages/Question";
import { useAppContext } from "../../helpers/ContextApi";
import { post } from "../../helpers/FecthApi.jsx";
import { createMockAppContext } from "../utils/mockAppContext";

jest.mock("../../helpers/ContextApi", () => ({
  useAppContext: jest.fn(),
}));

jest.mock("../../helpers/FecthApi.jsx", () => ({
  post: jest.fn(),
}));

const questionData = {
  id: 101,
  question: "Which bone is in the thigh?",
  answer_a: "Tibia",
  explanation_a: "The tibia is in the leg.",
  answer_b: "Femur",
  explanation_b: "The femur is the thigh bone.",
  answer_c: "Ulna",
  explanation_c: "The ulna is in the forearm.",
  answer_d: "Radius",
  explanation_d: "The radius is also in the forearm.",
  correct_answer: "B",
};

const questionDataWithOptionE = {
  ...questionData,
  answer_e: "Scapula",
  explanation_e: "The scapula is part of the shoulder girdle.",
};

describe("Question page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders nothing without question data and shows a spinner while loading", () => {
    useAppContext.mockReturnValue(createMockAppContext());
    const { container, rerender } = render(<Question />);

    expect(container).toBeEmptyDOMElement();

    useAppContext.mockReturnValue(
      createMockAppContext({
        questionData,
        isLoading: true,
      }),
    );
    rerender(<Question />);

    expect(document.querySelector(".spinner-border")).toBeInTheDocument();
  });

  test("saves the selected answer and reveals the result state", async () => {
    const setSelectedAnswer = jest.fn();
    const setShowResult = jest.fn();

    useAppContext.mockReturnValue(
      createMockAppContext({
        questionData,
        getCurrentUserId: () => 77,
        setSelectedAnswer,
        setShowResult,
      }),
    );
    post.mockResolvedValue({ ok: true });

    render(<Question />);

    await userEvent.click(screen.getByRole("button", { name: /B\) Femur/i }));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith("question-answers", {
        answer: "B",
        question_id: 101,
      });
    });
    expect(setSelectedAnswer).toHaveBeenCalledWith("B");
    expect(setShowResult).toHaveBeenCalledWith(true);
  });

  test("shows an error when the current user cannot be identified", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        questionData,
        getCurrentUserId: () => null,
      }),
    );

    render(<Question />);

    await userEvent.click(screen.getByRole("button", { name: /A\) Tibia/i }));

    expect(screen.getByText("Unable to identify the authenticated user.")).toBeInTheDocument();
    expect(post).not.toHaveBeenCalled();
  });

  test("does not try to save an answer when the question has no id", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        questionData: {
          ...questionData,
          id: null,
        },
      }),
    );

    render(<Question />);

    await userEvent.click(screen.getByRole("button", { name: /A\) Tibia/i }));

    expect(post).not.toHaveBeenCalled();
  });

  test("renders answer explanations grouped beneath each answer after a result is available", () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        questionData,
        showResult: true,
        selectedAnswer: "A",
      }),
    );

    render(<Question />);

    expect(screen.getByText("Correct: The femur is the thigh bone.")).toBeInTheDocument();
    expect(screen.getByText("Your answer: The tibia is in the leg.")).toBeInTheDocument();
    expect(screen.getByText("The ulna is in the forearm.")).toBeInTheDocument();

    const answerAGroup = screen.getByRole("button", { name: /A\) Tibia/i }).closest(".question-answer-stack");
    const answerBGroup = screen.getByRole("button", { name: /B\) Femur/i }).closest(".question-answer-stack");
    const answerCGroup = screen.getByRole("button", { name: /C\) Ulna/i }).closest(".question-answer-stack");

    expect(within(answerAGroup).getByText("Your answer: The tibia is in the leg.")).toBeInTheDocument();
    expect(within(answerBGroup).getByText("Correct: The femur is the thigh bone.")).toBeInTheDocument();
    expect(within(answerCGroup).getByText("The ulna is in the forearm.")).toBeInTheDocument();
  });

  test("renders an optional fifth answer when present", () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        questionData: questionDataWithOptionE,
      }),
    );

    render(<Question />);

    expect(screen.getByRole("button", { name: /E\) Scapula/i })).toBeInTheDocument();
  });

  test("shows a save error when answer persistence fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    useAppContext.mockReturnValue(
      createMockAppContext({
        questionData,
        getCurrentUserId: () => 77,
      }),
    );
    post.mockRejectedValue({ response: { data: { detail: "Save failed" } } });

    render(<Question />);

    await userEvent.click(screen.getByRole("button", { name: /B\) Femur/i }));

    expect(await screen.findByText("Save failed")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
  });

  test("shows the fallback save error when the API does not send a detail message", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    useAppContext.mockReturnValue(
      createMockAppContext({
        questionData,
        getCurrentUserId: () => 77,
      }),
    );
    post.mockRejectedValue({});

    render(<Question />);

    await userEvent.click(screen.getByRole("button", { name: /B\) Femur/i }));

    expect(await screen.findByText("Unable to save your answer. Please try again.")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
