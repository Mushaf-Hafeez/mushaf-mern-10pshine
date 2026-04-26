import { assert } from "chai";

import AppError from "../../utils/AppError";

// ========================================================
//                 AppError Test
// ========================================================
describe("AppError Test", () => {
  it("should create error with statusCode and message", () => {
    const error = new AppError(400, "Bad request.");

    assert.equal(error.statusCode, 400);
    assert.equal(error.message, "Bad request.");
  });
});
