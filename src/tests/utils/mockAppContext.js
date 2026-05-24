/* istanbul ignore file */
import { translations } from "../../helpers/translations";

export const createTranslator = (language = "en") => (key, variables = {}) => {
  const template = translations[language]?.[key] ?? translations.en[key] ?? key;

  return Object.entries(variables).reduce(
    (message, [variableKey, variableValue]) =>
      message.replaceAll(`{${variableKey}}`, String(variableValue)),
    template,
  );
};

export const createMockAppContext = (overrides = {}) => {
  const language = overrides.language || "en";

  return {
    currentArea: null,
    setCurrentArea: jest.fn(),
    questions: [],
    setQuestions: jest.fn(),
    currentQuestionIndex: 0,
    setCurrentQuestionIndex: jest.fn(),
    userAnswers: [],
    setUserAnswers: jest.fn(),
    questionData: null,
    setQuestionData: jest.fn(),
    selectedAnswer: null,
    setSelectedAnswer: jest.fn(),
    showResult: false,
    setShowResult: jest.fn(),
    isLoading: false,
    setIsLoading: jest.fn(),
    resetQuestionState: jest.fn(),
    resetQuestionData: jest.fn(),
    authUser: null,
    setAuthUser: jest.fn(),
    getCurrentUserId: () => 42,
    questionGenerationUsage: null,
    setQuestionGenerationUsage: jest.fn(),
    incrementQuestionGenerationUsage: jest.fn(),
    selectedInstitution: null,
    setSelectedInstitution: jest.fn(),
    isAuthenticated: false,
    hasSelectedInstitution: false,
    hasSubscriptionAccess: false,
    requiresDniUpdate: false,
    hasQuestionPackageAvailable: true,
    updateAuthUserProfile: jest.fn(),
    refreshSubscriptionAccess: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    language,
    setLanguage: jest.fn(),
    supportedLanguages: ["en", "es", "pt"],
    t: createTranslator(language),
    formatDate: (value) => (value ? "10/05/2026" : null),
    formatDateTime: (value) => (value ? "10/05/2026 09:00" : "-"),
    ...overrides,
  };
};
