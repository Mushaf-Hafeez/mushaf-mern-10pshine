import { assert, expect } from "chai";
import sinon from "sinon";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// importing validations
import {
  createUserValidation,
  emailValidation,
  loginValidation,
  resetPasswordValidation,
} from "../../validators/validations";

// importing controllers
import {
  checkAuth,
  deleteAccount,
  forgotPassword,
  login,
  resetPassword,
  sendOTP,
  signup,
} from "../../controllers/auth.controller";

import User from "../../models/user.model";
import OTP from "../../models/otp.model";
import transporter from "../../config/nodemailer.config";
import AppError from "../../utils/AppError";
import Note from "../../models/note.model";
import mongoose from "mongoose";

afterEach(() => {
  sinon.restore();
});

// ========================================================
//                 sendOTP controller Test
// ========================================================
describe("sendOTP controller", () => {
  it("should call next when validation fails", async () => {
    const req: any = { body: { email: "test@gmail" } };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(emailValidation, "safeParse").returns({
      success: false,
      error: { issues: [{ message: "Validation error." }] },
    } as any);

    await sendOTP(req, res, next);

    assert.isTrue(next.calledOnce);
  });

  it("should call next when user already exists", async () => {
    const req: any = { body: { email: "test@gmail.com" } };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(emailValidation, "safeParse").returns({
      success: true,
      data: { email: "test@gmail.com" },
    } as any);

    const findOneStub = sinon.stub(User, "findOne").resolves({} as any);

    await sendOTP(req, res, next);

    assert.isTrue(findOneStub.calledOnce);
    assert.isTrue(next.calledOnce);
  });

  it("should send OTP and return 200", async () => {
    const req: any = { body: { email: "test@gmail.com" } };

    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.spy();

    sinon.stub(emailValidation, "safeParse").returns({
      success: true,
      data: { email: "test@gmail.com" },
    } as any);

    const findOneStub = sinon.stub(User, "findOne").resolves(null);
    const deleteManyStub = sinon.stub(OTP, "deleteMany").resolves({} as any);
    const createStub = sinon.stub(OTP, "create").resolves({} as any);
    const mailStub = sinon.stub(transporter, "sendMail").resolves(true);

    await sendOTP(req, res, next);

    assert(findOneStub.calledOnce);
    assert(deleteManyStub.calledOnce);
    assert(createStub.calledOnce);
    assert(mailStub.calledOnce);
    assert(res.status.calledWith(200));
    assert(res.json.calledWithMatch({ success: true }));
  });

  it("should call next when mail fails", async () => {
    const req: any = { body: { email: "test@gmail.com" } };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(emailValidation, "safeParse").returns({
      success: true,
      data: { email: "test@gmail.com" },
    } as any);

    sinon.stub(User, "findOne").resolves(null);
    sinon.stub(OTP, "deleteMany").resolves({} as any);
    sinon.stub(OTP, "create").resolves({} as any);
    sinon.stub(transporter, "sendMail").rejects(new Error("Mail error"));

    await sendOTP(req, res, next);

    assert.isTrue(next.calledOnce);
  });
});

// ========================================================
//                 signup controller Test
// ========================================================
describe("signup controller", () => {
  it("should call next when validation fails", async () => {
    const req: any = { body: {} };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(createUserValidation, "safeParse").returns({
      success: false,
      error: { issues: [{ message: "Validation error." }] },
    } as any);

    await signup(req, res, next);

    assert.isTrue(next.calledOnce);
  });

  it("should call next when user already exists", async () => {
    const req: any = { body: {} };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(createUserValidation, "safeParse").returns({
      success: true,
      data: {} as any,
    });

    const findOneStub = sinon.stub(User, "findOne").resolves({} as any);

    await signup(req, res, next);

    assert(findOneStub.calledOnce);
    assert(next.calledOnce);
  });

  it("should call next when OTP is invalid", async () => {
    const req: any = { body: {} };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(createUserValidation, "safeParse").returns({
      success: true,
      data: {} as any,
    });

    sinon.stub(User, "findOne").resolves(null);
    sinon.stub(OTP, "findOne").resolves(null);

    await signup(req, res, next);

    assert.isTrue(next.calledOnce);
  });

  it("should create user and return 201", async () => {
    const req: any = { body: {} };

    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.spy();

    sinon.stub(createUserValidation, "safeParse").returns({
      success: true,
      data: {
        name: "Test",
        email: "test@gmail.com",
        password: "123",
        confirmPassword: "123",
        otp: "123456",
      },
    } as any);

    sinon.stub(User, "findOne").resolves(null);

    sinon.stub(OTP, "findOne").resolves({} as any);

    sinon.stub(bcrypt, "genSalt").resolves("salt" as any);

    sinon.stub(bcrypt, "hash").resolves("hashed" as any);

    const createStub = sinon.stub(User, "create").resolves({
      _id: "user123",
      name: "Test",
      email: "test@gmail.com",
      password: "hashed",
      toObject() {
        return {
          _id: "user123",
          name: "Test",
          email: "test@gmail.com",
          password: "hashed",
        };
      },
    } as any);

    sinon.stub(OTP, "deleteMany").resolves({} as any);

    const signStub = sinon.stub(jwt, "sign").returns("fake-token" as any);

    await signup(req, res, next);

    assert.isTrue(createStub.calledOnce);

    assert.isTrue(signStub.calledOnce);

    assert.isTrue(res.status.calledWith(201));

    assert.isTrue(
      res.json.calledWithMatch({
        success: true,
        token: "fake-token",
        message: "User created successfully.",
      }),
    );
  });
});

// ========================================================
//                 login controller Test
// ========================================================
describe("login controller", () => {
  it("should call next when validation fails", async () => {
    const req: any = { body: {} };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(loginValidation, "safeParse").returns({
      success: false,
      error: { issues: [{ message: "Validation error." }] },
    } as any);

    await login(req, res, next);

    assert(next.calledOnce);
  });

  it("should call next when user not found", async () => {
    const req: any = { body: {} };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(loginValidation, "safeParse").returns({
      success: true,
      data: {} as any,
    });

    const findOneStub = sinon.stub(User, "findOne").resolves(null);

    await login(req, res, next);

    assert(findOneStub.calledOnce);
    assert(next.calledOnce);
  });

  it("should call next when password is incorrect", async () => {
    const req: any = { body: {} };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(loginValidation, "safeParse").returns({
      success: true,
      data: {} as any,
    });

    sinon.stub(User, "findOne").resolves({} as any);
    sinon.stub(bcrypt, "compare").resolves(false);

    await login(req, res, next);

    assert(next.calledOnce);
  });

  it("should login user and return 200", async () => {
    const req: any = { body: {} };

    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.spy();

    sinon.stub(loginValidation, "safeParse").returns({
      success: true,
      data: {
        email: "test@gmail.com",
        password: "123",
      },
    } as any);

    sinon.stub(User, "findOne").resolves({
      _id: "user123",
      name: "Test",
      email: "test@gmail.com",
      password: "hashed-password",
      toObject() {
        return {
          _id: "user123",
          name: "Test",
          email: "test@gmail.com",
          password: "hashed-password",
        };
      },
    } as any);

    sinon.stub(bcrypt, "compare").resolves(true as any);

    const signStub = sinon.stub(jwt, "sign").returns("fake-token" as any);

    await login(req, res, next);

    assert.isTrue(signStub.calledOnce);

    assert.isTrue(res.status.calledWith(200));

    assert.isTrue(
      res.json.calledWithMatch({
        success: true,
        token: "fake-token",
        message: "User logged in successfully.",
      }),
    );
  });
});

// ========================================================
//                 forgotPassword controller
// ========================================================
describe("forgotPassword controller", () => {
  it("should call next when validation fails", async () => {
    const req: any = { body: {} };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(emailValidation, "safeParse").returns({
      success: false,
      error: { issues: [{ message: "Validation error" }] },
    } as any);

    await forgotPassword(req, res, next);

    assert.isTrue(next.calledOnce);
  });

  it("should call next when user does not exist", async () => {
    const req: any = { body: { email: "test@gmail.com" } };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(emailValidation, "safeParse").returns({
      success: true,
      data: { email: "test@gmail.com" },
    } as any);

    const findStub = sinon.stub(User, "findOne").resolves(null);

    await forgotPassword(req, res, next);

    assert(findStub.calledOnce);
    assert(next.calledOnce);
  });

  it("should send reset link and return 200", async () => {
    const req: any = { body: { email: "test@gmail.com" } };

    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.spy();

    sinon.stub(emailValidation, "safeParse").returns({
      success: true,
      data: { email: "test@gmail.com" },
    } as any);

    const saveStub = sinon.stub().resolves(true);

    const user = {
      _id: "123",
      email: "test@gmail.com",
      save: saveStub,
    } as any;

    sinon.stub(User, "findOne").resolves(user);
    sinon.stub(crypto, "randomUUID").returns("fake-token" as any);
    const mailStub = sinon.stub(transporter, "sendMail").resolves(true);

    await forgotPassword(req, res, next);

    assert(saveStub.calledOnce);
    assert(mailStub.calledOnce);
    assert(res.status.calledWith(200));
    assert(res.json.calledWithMatch({ success: true }));
  });

  it("should call next when DB throws error", async () => {
    const req: any = { body: { email: "test@gmail.com" } };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(emailValidation, "safeParse").returns({
      success: true,
      data: { email: "test@gmail.com" },
    } as any);

    sinon.stub(User, "findOne").rejects(new Error("DB error"));

    await forgotPassword(req, res, next);

    assert(next.calledOnce);
  });
});

// ========================================================
//                 resetPassword controller
// ========================================================
describe("resetPassword controller", () => {
  it("should call next when validation fails", async () => {
    const req: any = { body: {} };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(resetPasswordValidation, "safeParse").returns({
      success: false,
      error: { issues: [{ message: "Validation error" }] },
    } as any);

    await resetPassword(req, res, next);

    assert(next.calledOnce);
  });

  it("should return 400 when token is invalid/expired", async () => {
    const req: any = { body: {} };

    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.spy();

    sinon.stub(resetPasswordValidation, "safeParse").returns({
      success: true,
      data: {
        reset_password_token: "token",
        password: "Password123@",
      },
    } as any);

    sinon.stub(User, "findOne").resolves(null);

    await resetPassword(req, res, next);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ success: false }));
  });

  it("should call next when hashing fails", async () => {
    const req: any = { body: {} };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(resetPasswordValidation, "safeParse").returns({
      success: true,
      data: {
        reset_password_token: "token",
        password: "Password123@",
      },
    } as any);

    sinon.stub(User, "findOne").resolves({ _id: "123" } as any);
    sinon.stub(bcrypt, "genSalt").resolves("salt");
    sinon.stub(bcrypt, "hash").resolves(null as any);

    await resetPassword(req, res, next);

    assert(next.calledOnce);
  });

  it("should call next when update fails", async () => {
    const req: any = { body: {} };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(resetPasswordValidation, "safeParse").returns({
      success: true,
      data: {
        reset_password_token: "token",
        password: "Password123@",
      },
    } as any);

    sinon.stub(User, "findOne").resolves({ _id: "123" } as any);
    sinon.stub(bcrypt, "genSalt").resolves("salt");
    sinon.stub(bcrypt, "hash").resolves("hashed");
    sinon.stub(User, "findOneAndUpdate").resolves(null);

    await resetPassword(req, res, next);

    assert(next.calledOnce);
  });

  it("should reset password and return 200", async () => {
    const req: any = { body: {} };

    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.spy();

    sinon.stub(resetPasswordValidation, "safeParse").returns({
      success: true,
      data: {
        reset_password_token: "token",
        password: "Password123@",
      },
    } as any);

    sinon.stub(User, "findOne").resolves({ _id: "123" } as any);
    sinon.stub(bcrypt, "genSalt").resolves("salt");
    sinon.stub(bcrypt, "hash").resolves("hashed");
    sinon.stub(User, "findOneAndUpdate").resolves({} as any);

    await resetPassword(req, res, next);

    assert(res.status.calledWith(200));
    assert(res.json.calledWithMatch({ success: true }));
  });
});

// ========================================================
//                 checkAuth controller
// ========================================================
describe("checkAuth controller", () => {
  it("should return user with status 200", async () => {
    const req: any = {
      user: { _id: "123", email: "test@gmail.com" },
    };

    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.spy();

    await checkAuth(req, res, next);

    assert(res.status.calledWith(200));
    assert(
      res.json.calledWithMatch({
        success: true,
        user: req.user,
      }),
    );
  });
});

// ========================================================
//                 deleteAccount Controller
// ========================================================
describe("deleteAccount Controller", () => {
  let req: any, res: any, next: any;

  beforeEach(() => {
    req = {
      body: { password: "Password123!" },
      user: { _id: new mongoose.Types.ObjectId().toString() },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };

    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should delete account successfully", async () => {
    const mockUser = {
      _id: req.user._id,
      password: "hashedPassword",
    };

    sinon.stub(User, "findById").resolves(mockUser as any);

    sinon.stub(bcrypt, "compare").resolves(true);

    sinon.stub(Note, "deleteMany").resolves({} as any);

    sinon.stub(User, "findByIdAndDelete").resolves({} as any);

    await deleteAccount(req, res, next);

    assert.isTrue(Note.deleteMany.calledOnceWith({ user: req.user._id }));

    assert.isTrue(User.findByIdAndDelete.calledOnceWith(req.user._id));

    assert.isTrue(res.status.calledWith(200));
  });

  it("should throw 404 if user is not found", async () => {
    sinon.stub(User, "findById").resolves(null);

    await deleteAccount(req, res, next);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.statusCode, 404);
    assert.strictEqual(error.message, "User not found.");
  });

  it("should throw 400 if password is incorrect", async () => {
    const mockUser = {
      password: "hashedPassword",
    };

    sinon.stub(User, "findById").resolves(mockUser as any);

    sinon.stub(bcrypt, "compare").resolves(false);

    await deleteAccount(req, res, next);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.statusCode, 400);
    assert.strictEqual(error.message, "Incorrect password.");
  });

  it("should call next on DB error", async () => {
    sinon.stub(User, "findById").throws(new Error("DB Failure"));

    await deleteAccount(req, res, next);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "DB Failure");
  });
});
