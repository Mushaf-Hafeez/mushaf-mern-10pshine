import { assert } from "chai";

// importing  validtion schemas
import {
  createNoteValidation,
  createUserValidation,
  deleteAccountValidation,
  emailValidation,
  loginValidation,
  noteIdValidation,
  resetPasswordValidation,
  updateNoteValidation,
  updateProfilePicValidation,
  updateProfileValidation,
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
      title: "Test Title",
      content: "This is test note.",
    });

    assert.isTrue(result.success);
  });

  it("should fail the validation when title is missing", () => {
    const result = createNoteValidation.safeParse({
      content: "This is test note.",
    });

    assert.isFalse(result.success);
  });

  it("should fail the validation when content is missing", () => {
    const result = createNoteValidation.safeParse({
      title: "Test Title",
    });

    assert.isFalse(result.success);
  });

  it("should fail the validation when title is empty", () => {
    const result = createNoteValidation.safeParse({
      title: "",
      content: "This is test note.",
    });

    assert.isFalse(result.success);
  });

  it("should fail the validation when content is empty", () => {
    const result = createNoteValidation.safeParse({
      title: "Test Title",
      content: "",
    });

    assert.isFalse(result.success);
  });

  it("should fail the validation when title contains only spaces", () => {
    const result = createNoteValidation.safeParse({
      title: "     ",
      content: "This is test note.",
    });

    assert.isFalse(result.success);
  });

  it("should fail the validation when content contains only spaces", () => {
    const result = createNoteValidation.safeParse({
      title: "Test Title",
      content: "      ",
    });

    assert.isFalse(result.success);
  });
});

// ========================================================
//                 updateNoteValidation Test
// ========================================================
describe("updateNoteValidation", () => {
  it("should pass when only title is provided", () => {
    const result = updateNoteValidation.safeParse({
      title: "Updated Title",
    });

    assert.isTrue(result.success);
  });

  it("should pass when only content is provided", () => {
    const result = updateNoteValidation.safeParse({
      content: "Updated content.",
    });

    assert.isTrue(result.success);
  });

  it("should pass when both title and content are provided", () => {
    const result = updateNoteValidation.safeParse({
      title: "Updated Title",
      content: "Updated content.",
    });

    assert.isTrue(result.success);
  });

  it("should fail when no field is provided", () => {
    const result = updateNoteValidation.safeParse({});

    assert.isFalse(result.success);
  });

  it("should fail when title is empty", () => {
    const result = updateNoteValidation.safeParse({
      title: "",
    });

    assert.isFalse(result.success);
  });

  it("should fail when content is empty", () => {
    const result = updateNoteValidation.safeParse({
      content: "",
    });

    assert.isFalse(result.success);
  });

  it("should fail when title contains only spaces", () => {
    const result = updateNoteValidation.safeParse({
      title: "     ",
    });

    assert.isFalse(result.success);
  });

  it("should fail when content contains only spaces", () => {
    const result = updateNoteValidation.safeParse({
      content: "      ",
    });

    assert.isFalse(result.success);
  });
});

// ========================================================
//              updateProfileValidation Test
// ========================================================
describe("updateProfileValidation", () => {
  it("should pass when valid name is provided", () => {
    const result = updateProfileValidation.safeParse({
      name: "Updated User",
    });

    assert.isTrue(result.success);
  });

  it("should fail when name is missing", () => {
    const result = updateProfileValidation.safeParse({});

    assert.isFalse(result.success);
  });

  it("should fail when name is less than 6 characters", () => {
    const result = updateProfileValidation.safeParse({
      name: "Mush",
    });

    assert.isFalse(result.success);
  });

  it("should fail when name is greater than 25 characters", () => {
    const result = updateProfileValidation.safeParse({
      name: "ThisNameIsMoreThanTwentyFiveCharacters",
    });

    assert.isFalse(result.success);
  });

  it("should fail when name is empty string", () => {
    const result = updateProfileValidation.safeParse({
      name: "",
    });

    assert.isFalse(result.success);
  });

  it("should fail when name contains only spaces", () => {
    const result = updateProfileValidation.safeParse({
      name: "      ",
    });

    assert.isFalse(result.success);
  });
});

// ========================================================
//           updateProfilePicValidation Test
// ========================================================
describe("updateProfilePicValidation", () => {
  it("should pass when valid profile picture URL is provided", () => {
    const result = updateProfilePicValidation.safeParse({
      profile_pic: "https://example.com/profile.jpg",
    });

    assert.isTrue(result.success);
  });

  it("should fail when profile picture is missing", () => {
    const result = updateProfilePicValidation.safeParse({});

    assert.isFalse(result.success);
  });

  it("should fail when profile picture URL is invalid", () => {
    const result = updateProfilePicValidation.safeParse({
      profile_pic: "invalid-url",
    });

    assert.isFalse(result.success);
  });

  it("should fail when profile picture is empty string", () => {
    const result = updateProfilePicValidation.safeParse({
      profile_pic: "",
    });

    assert.isFalse(result.success);
  });

  it("should fail when profile picture contains only spaces", () => {
    const result = updateProfilePicValidation.safeParse({
      profile_pic: "      ",
    });

    assert.isFalse(result.success);
  });
});

// ========================================================
//                 deleteAccountValidation Test
// ========================================================
describe("deleteAccountValidation", () => {
  it("should fail when the password is incorrect", () => {
    const result = deleteAccountValidation.safeParse({
      password: "Tempuser123",
    });

    assert.isFalse(result.success);
  });

  it("should pass the validation when the password is correct", () => {
    const result = deleteAccountValidation.safeParse({
      password: "Tempuser123#",
    });

    assert.isTrue(result.success);
  });
});
