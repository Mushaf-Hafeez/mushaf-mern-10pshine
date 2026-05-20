import sinon from "sinon";
import { assert } from "chai";

import User from "../../models/user.model";
import AppError from "../../utils/AppError";

import {
  getProfile,
  updateProfile,
  updateProfilePic,
} from "../../controllers/profile.controller";

describe("User Controller Tests", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      user: {
        _id: "6844d7f9c123456789abcd12",
      },
      body: {},
      file: {},
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  // ========================================================
  //                    getProfile Tests
  // ========================================================
  describe("getProfile", () => {
    it("should return user profile successfully", async () => {
      const fakeUser = {
        _id: req.user._id,
        name: "Mushaf Hafeez",
        email: "mushaf@example.com",
      };

      const selectStub = sinon.stub().resolves(fakeUser);

      sinon.stub(User, "findById").returns({
        select: selectStub,
      } as any);

      await getProfile(req, res, next);

      assert.isTrue(res.status.calledWith(200));

      assert.isTrue(
        res.json.calledWith({
          success: true,
          user: fakeUser,
        }),
      );
    });

    it("should call next with AppError if user does not exist", async () => {
      const selectStub = sinon.stub().resolves(null);

      sinon.stub(User, "findById").returns({
        select: selectStub,
      } as any);

      await getProfile(req, res, next);

      assert.isTrue(next.calledOnce);

      const error = next.firstCall.args[0];

      assert.instanceOf(error, AppError);
      assert.equal(error.statusCode, 404);
      assert.equal(error.message, "No user found.");
    });

    it("should call next when database throws error", async () => {
      sinon.stub(User, "findById").throws(new Error("Database error"));

      await getProfile(req, res, next);

      assert.isTrue(next.calledOnce);
    });
  });

  // ========================================================
  //                  updateProfile Tests
  // ========================================================
  describe("updateProfile", () => {
    it("should update user profile successfully", async () => {
      req.body.name = "Updated User";

      const updatedUser = {
        _id: req.user._id,
        name: "Updated User",
      };

      const selectStub = sinon.stub().resolves(updatedUser);

      sinon.stub(User, "findByIdAndUpdate").returns({
        select: selectStub,
      } as any);

      await updateProfile(req, res, next);

      assert.isTrue(res.status.calledWith(200));

      assert.isTrue(
        res.json.calledWith({
          success: true,
          user: updatedUser,
          message: "User has been updated successfully.",
        }),
      );
    });

    it("should fail when name validation fails", async () => {
      req.body.name = "abc";

      await updateProfile(req, res, next);

      assert.isTrue(next.calledOnce);

      const error = next.firstCall.args[0];

      assert.instanceOf(error, AppError);
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, "Name must contain at least 6 characters.");
    });

    it("should call next when database throws error", async () => {
      req.body.name = "Updated User";

      sinon.stub(User, "findByIdAndUpdate").throws(new Error("Database error"));

      await updateProfile(req, res, next);

      assert.isTrue(next.calledOnce);
    });
  });

  // ========================================================
  //               updateProfilePic Tests
  // ========================================================
  describe("updateProfilePic", () => {
    it("should update profile picture successfully", async () => {
      req.file.path = "https://example.com/profile.jpg";

      const updatedUser = {
        _id: req.user._id,
        profile_pic: "https://example.com/profile.jpg",
      };

      const selectStub = sinon.stub().resolves(updatedUser);

      sinon.stub(User, "findByIdAndUpdate").returns({
        select: selectStub,
      } as any);

      await updateProfilePic(req, res, next);

      assert.isTrue(res.status.calledWith(200));

      assert.isTrue(
        res.json.calledWith({
          success: true,
          user: updatedUser,
          message: "Profile pic updated successfully.",
        }),
      );
    });

    it("should fail when profile picture validation fails", async () => {
      req.file.path = "invalid-url";

      await updateProfilePic(req, res, next);

      assert.isTrue(next.calledOnce);

      const error = next.firstCall.args[0];

      assert.instanceOf(error, AppError);
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, "Profile picture URL must be a valid URL.");
    });

    it("should fail when profile picture is missing", async () => {
      req.file = undefined;

      await updateProfilePic(req, res, next);

      assert.isTrue(next.calledOnce);

      const error = next.firstCall.args[0];

      assert.instanceOf(error, AppError);
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, "Profile picture is required.");
    });

    it("should call next when database throws error", async () => {
      req.file.path = "https://example.com/profile.jpg";

      sinon.stub(User, "findByIdAndUpdate").throws(new Error("Database error"));

      await updateProfilePic(req, res, next);

      assert.isTrue(next.calledOnce);
    });
  });
});
