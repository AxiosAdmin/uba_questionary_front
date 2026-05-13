import {
  getPasswordValidationMessage,
  hasStrongPasswordRequirements,
} from "../../helpers/passwordValidation";

describe("passwordValidation helper", () => {
  test("returns false for empty passwords", () => {
    expect(hasStrongPasswordRequirements("")).toBe(false);
    expect(hasStrongPasswordRequirements(undefined)).toBe(false);
  });

  test("accepts strong passwords", () => {
    expect(hasStrongPasswordRequirements("NovaSenha123!")).toBe(true);
  });

  test("returns an empty message for empty or valid passwords", () => {
    const t = jest.fn(() => "Password requirements");

    expect(getPasswordValidationMessage("", t)).toBe("");
    expect(getPasswordValidationMessage("NovaSenha123!", t)).toBe("");
    expect(t).not.toHaveBeenCalled();
  });

  test("returns the translated validation message for weak passwords", () => {
    const t = jest.fn(() => "Password requirements");

    expect(getPasswordValidationMessage("secret", t)).toBe(
      "Password requirements",
    );
    expect(t).toHaveBeenCalledWith("password.requirements");
  });
});
