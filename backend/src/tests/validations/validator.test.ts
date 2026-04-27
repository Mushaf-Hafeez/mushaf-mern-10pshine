import { assert } from "chai";

// importing  validtion schemas
import {
  createNoteValidation,
  createUserValidation,
  emailValidation,
  loginValidation,
  noteIdValidation,
  resetPasswordValidation,
} from "../../validators/validations";

// ========================================================
//                 emailValidation Test
// ========================================================
describe("emailValidation", () => {
  it("should pass when the email is valid", () => {
    const result = emailValidation.safeParse({ email: "test@gmail.com" });

    assert.isTrue(result.success);
  });
  it("should fail when the email is invalid", () => {
    const result = emailValidation.safeParse({ email: "test" });

    assert.isFalse(result.success);
  });
  it("should fail when email is empty", () => {
    const result = emailValidation.safeParse({ email: "" });
    assert.isFalse(result.success);
  });
});

// ========================================================
//                 createUserValidation Test
// ========================================================
describe("createUserValidation", () => {
  it("should pass when the data is valid", () => {
    const result = createUserValidation.safeParse({
      name: "Test user",
      email: "test@gmail.com",
      password: "Tempuser12@",
      confirmPassword: "Tempuser12@",
      otp: "123456",
    });

    assert.isTrue(result.success);
  });
  it("should fail when the data is invalid", () => {
    const result = createUserValidation.safeParse({
      name: "Test user",
      email: "test@gmail",
      password: "Tempuser12",
      confirmPassword: "new@",
      otp: "as123@",
    });

    assert.isFalse(result.success);
  });
  it("should fail when passwords do not match", () => {
    const result = createUserValidation.safeParse({
      name: "Test user",
      email: "test@gmail.com",
      password: "Tempuser12@",
      confirmPassword: "Wrongpass12@",
      otp: "123456",
    });

    assert.isFalse(result.success);
  });
  it("should fail when password has no uppercase letter", () => {
    const result = createUserValidation.safeParse({
      name: "Test user",
      email: "test@gmail.com",
      password: "tempuser12@",
      confirmPassword: "tempuser12@",
      otp: "123456",
    });

    assert.isFalse(result.success);
  });
  it("should fail when password has no lowercase letter", () => {
    const result = createUserValidation.safeParse({
      name: "Test user",
      email: "test@gmail.com",
      password: "TEMPUSER12@",
      confirmPassword: "TEMPUSER12@",
      otp: "123456",
    });

    assert.isFalse(result.success);
  });
  it("should fail when password has no digit", () => {
    const result = createUserValidation.safeParse({
      name: "Test user",
      email: "test@gmail.com",
      password: "Tempuser@",
      confirmPassword: "Tempuser@",
      otp: "123456",
    });

    assert.isFalse(result.success);
  });
  it("should fail when password has no special character.", () => {
    const result = createUserValidation.safeParse({
      name: "Test user",
      email: "test@gmail.com",
      password: "Tempuser12",
      confirmPassword: "Tempuser12",
      otp: "123456",
    });

    assert.isFalse(result.success);
  });
  it("should fail when password lenght is less than 8", () => {
    const result = createUserValidation.safeParse({
      name: "Test user",
      email: "test@gmail.com",
      password: "Temp12@",
      confirmPassword: "Temp12@",
      otp: "123456",
    });

    assert.isFalse(result.success);
  });
  it("should fail when password lenght is greater than 100", () => {
    const result = createUserValidation.safeParse({
      name: "Test user",
      email: "test@gmail.com",
      password:
        "Tempuser12@Tempuser12@Tempuser12@Tempuser12@Tempuser12@Tempuser12@Tempuser12@Tempuser12@Tempuser12@Tempuser12@Tempuser12@",
      confirmPassword:
        "Tempuser12@Tempuser12@Tempuser12@Tempuser12@Tempuser12@Tempuser12@Tempuser12@Tempuser12@Tempuser12@Tempuser12@Tempuser12@",
      otp: "123456",
    });

    assert.isFalse(result.success);
  });
  it("should fail when OTP is not 6 digits", () => {
    const result = createUserValidation.safeParse({
      name: "Test user",
      email: "test@gmail.com",
      password: "Tempuser12@",
      confirmPassword: "Tempuser12@",
      otp: "123",
    });

    assert.isFalse(result.success);
  });
});

// ========================================================
//                 loginValidation Test
// ========================================================
describe("loginValidation", () => {
  it("should pass when the data is valid", () => {
    const result = loginValidation.safeParse({
      email: "test@gmail.com",
      password: "Tempuser12@",
    });

    assert.isTrue(result.success);
  });
  it("should fail when the email is invalid", () => {
    const result = loginValidation.safeParse({
      email: "test@gmail",
      password: "Tempuser12@",
    });

    assert.isFalse(result.success);
  });
  it("should fail when email is missing", () => {
    const result = loginValidation.safeParse({
      password: "Tempuser12@",
    });

    assert.isFalse(result.success);
  });
  it("should fail when password is missing", () => {
    const result = loginValidation.safeParse({
      email: "temp@gmail.com",
    });

    assert.isFalse(result.success);
  });
  it("should fail when password does not follow the pattern", () => {
    const result = loginValidation.safeParse({
      email: "temp@gmail.com",
      password: "randomPassword",
    });

    assert.isFalse(result.success);
  });
});

// ========================================================
//                 resetPasswordValidation Test
// ========================================================
describe("resetPasswordValidation", () => {
  it("should pass when the data is valid", () => {
    const result = resetPasswordValidation.safeParse({
      reset_password_token: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
      password: "Tempuser12@",
      confirmPassword: "Tempuser12@",
    });

    assert.isTrue(result.success);
  });
  it("should fail when the reset password token is missing", () => {
    const result = resetPasswordValidation.safeParse({
      password: "Tempuser12@",
      confirmPassword: "Tempuser12@",
    });

    assert.isFalse(result.success);
  });
  it("should fail when token is invalid", () => {
    const result = resetPasswordValidation.safeParse({
      reset_password_token: "invalid",
      password: "Tempuser12@",
      confirmPassword: "Tempuser12@",
    });

    assert.isFalse(result.success);
  });
  it("should fail when passwords do not match", () => {
    const result = resetPasswordValidation.safeParse({
      reset_password_token: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
      password: "Tempuser12@",
      confirmPassword: "Wrongpass12@",
    });

    assert.isFalse(result.success);
  });
});

// ========================================================
//                 noteIdValidation Test
// ========================================================
describe("noteIdValidation", () => {
  it("should pass when the ID is valid", () => {
    const result = noteIdValidation.safeParse({
      id: "507c7f79bcf86cd7994f6c0e",
    });

    assert.isTrue(result.success);
  });
  it("should fail when the ID is invalid", () => {
    const result = noteIdValidation.safeParse({
      id: "507c7f79bcf86cd7994f",
    });

    assert.isFalse(result.success);
  });
  it("should fail when ID is empty", () => {
    const result = noteIdValidation.safeParse({ id: "" });
    assert.isFalse(result.success);
  });
});

// ========================================================
//                 createNoteValidation Test
// ========================================================
describe("createNoteValidation", () => {
  it("should pass the validation when the data is valid", () => {
    const result = createNoteValidation.safeParse({
      content: "This is test note.",
    });
    assert.isTrue(result.success);
  });
  it("should fali the validation when the data is invalid", () => {
    const result = createNoteValidation.safeParse({
      content: "",
    });
    assert.isFalse(result.success);
  });
});
