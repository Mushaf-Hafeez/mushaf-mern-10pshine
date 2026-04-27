import { assert } from "chai";
import sinon from "sinon";

import jwt from "jsonwebtoken";

import { config } from "dotenv";
config();

// importing utility functions
import {
  createJWT,
  sendOTPMail,
  sendResetPasswordMail,
  generateOTP,
  verifyOTP,
} from "../../utils/utils";
import transporter from "../../config/nodemailer.config";
import OTP from "../../models/otp.model";

afterEach(() => {
  sinon.restore();
});

// ========================================================
//                 sendOTP Mail Test
// ========================================================

describe("sendOTPMail", () => {
  it("should send the mail and return true", async () => {
    const sendMailStub = sinon.stub(transporter, "sendMail").resolves(true);

    const result = await sendOTPMail("123456", "test@gmail.com");

    assert.equal(result, true);
    assert.equal(sendMailStub.calledOnce, true);
    assert(
      sendMailStub.calledWithMatch({
        to: "test@gmail.com",
        subject: "Note Flow OTP Verification.",
      }),
    );
  });

  it("should return false when mail sending fails", async () => {
    sinon.stub(transporter, "sendMail").rejects(new Error("SMTP error"));

    const result = await sendOTPMail("123456", "test@gmail.com");

    assert.equal(result, false);
  });
});

// ========================================================
//                 sendResetPassword Mail Test
// ========================================================

describe("sendResetPasswordMail", () => {
  it("should send the mail and return true", async () => {
    const sendMailStub = sinon.stub(transporter, "sendMail").resolves(true);

    const result = await sendResetPasswordMail(
      "http://localhost:3000",
      "test@gmail.com",
    );

    assert.equal(result, true);
    assert.equal(sendMailStub.calledOnce, true);
    assert(
      sendMailStub.calledWithMatch({
        to: "test@gmail.com",
        subject: "Note Flow Reset Password.",
      }),
    );
  });

  it("should return false when mail sending fails", async () => {
    sinon.stub(transporter, "sendMail").rejects(new Error("SMTP error"));

    const result = await sendResetPasswordMail("123456", "test@gmail.com");

    assert.equal(result, false);
  });
});

// ========================================================
//                 generateOTP Test
// ========================================================

describe("generateOTP", () => {
  it("should return 6 digit OTP", () => {
    const result = generateOTP();

    assert.lengthOf(result, 6);
    assert.match(result, /^\d{6}$/);
  });
});

// ========================================================
//                 verifyOTP Test
// ========================================================

describe("verifyOTP", () => {
  it("should verify OTP and return true when OTP is valid", async () => {
    sinon
      .stub(OTP, "findOne")
      .resolves({ otp: "123456", email: "test@gmail.com" } as any);

    const result = await verifyOTP("123456", "test@gmail.com");

    assert.equal(result, true);
  });

  it("should return false when OTP is invalid or expired", async () => {
    sinon.stub(OTP, "findOne").resolves(null);

    const result = await verifyOTP("123456", "test@gmail.com");

    assert.equal(result, false);
  });
});

// ========================================================
//                 createJWT Test
// ========================================================
describe("createJWT", () => {
  it("should return a token string", () => {
    const signStub = sinon.stub(jwt, "sign").returns("fake-token" as any);

    const result = createJWT({
      id: "123",
      name: "Test user",
      email: "test@gmail.com",
    });

    assert.equal(result, "fake-token");
    assert.equal(signStub.calledOnce, true);
    assert(
      signStub.calledWith(
        {
          id: "123",
          name: "Test user",
          email: "test@gmail.com",
        },
        process.env.JWT_SECRET as any,
        sinon.match({ expiresIn: "7d" }),
      ),
    );
  });
});
