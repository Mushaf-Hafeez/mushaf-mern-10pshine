import { assert } from "chai";
import sinon from "sinon";

import Note from "../../models/note.model";
import {
  createNoteValidation,
  noteIdValidation,
  updateNoteValidation,
} from "../../validators/validations";

import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "../../controllers/note.controller";

afterEach(() => {
  sinon.restore();
});

// ========================================================
//                 getNotes controller
// ========================================================
describe("getNotes controller", () => {
  it("should return notes for user", async () => {
    const req: any = {
      user: { _id: "user123" },
    };

    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.spy();

    const notesMock = [{ content: "test note" }];

    const sortStub = sinon.stub().resolves(notesMock);

    const populateStub = sinon.stub().returns({
      sort: sortStub,
    });

    const findStub = sinon.stub(Note, "find").returns({
      populate: populateStub,
    } as any);

    await getNotes(req, res, next);

    assert.isTrue(findStub.calledOnce);
    assert.isTrue(populateStub.calledOnce);
    assert.isTrue(sortStub.calledOnce);

    assert.isTrue(res.status.calledWith(200));

    assert.isTrue(
      res.json.calledWithMatch({
        success: true,
        notes: notesMock,
      }),
    );
  });

  it("should call next on error", async () => {
    const req: any = { user: { _id: "user123" } };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(Note, "find").throws(new Error("DB error"));

    await getNotes(req, res, next);

    assert.isTrue(next.calledOnce);
  });
});

// ========================================================
//                 getNote controller
// ========================================================
describe("getNote controller", () => {
  it("should call next when validation fails", async () => {
    const req: any = { params: { id: "" } };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(noteIdValidation, "safeParse").returns({
      success: false,
      error: { issues: [{ message: "Invalid id" }] },
    } as any);

    await getNote(req, res, next);

    assert.isTrue(next.calledOnce);
  });

  it("should call next when note not found", async () => {
    const req: any = {
      params: { id: "507c7f79bcf86cd7994f6c0e" },
      user: { _id: "user123" },
    };

    const res: any = {};
    const next = sinon.spy();

    sinon.stub(noteIdValidation, "safeParse").returns({
      success: true,
      data: { id: req.params.id },
    } as any);

    const findStub = sinon.stub(Note, "findOne").returns({
      populate: sinon.stub().resolves(null),
    } as any);

    await getNote(req, res, next);

    assert.isTrue(findStub.calledOnce);
    assert.isTrue(next.calledOnce);
  });

  it("should return note successfully", async () => {
    const req: any = {
      params: { id: "507c7f79bcf86cd7994f6c0e" },
      user: { _id: "user123" },
    };

    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.spy();

    const noteMock = { content: "hello" };

    sinon.stub(noteIdValidation, "safeParse").returns({
      success: true,
      data: { id: req.params.id },
    } as any);

    sinon.stub(Note, "findOne").returns({
      populate: sinon.stub().resolves(noteMock),
    } as any);

    await getNote(req, res, next);

    assert.isTrue(res.status.calledWith(200));
    assert.isTrue(res.json.calledWithMatch({ success: true, note: noteMock }));
  });
});

// ========================================================
//                 createNote controller
// ========================================================
describe("createNote controller", () => {
  it("should call next on validation fail", async () => {
    const req: any = { body: { content: "" }, user: { _id: "user123" } };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(createNoteValidation, "safeParse").returns({
      success: false,
      error: { issues: [{ message: "Invalid content" }] },
    } as any);

    await createNote(req, res, next);

    assert.isTrue(next.calledOnce);
  });

  it("should create note successfully", async () => {
    const req: any = {
      body: { content: "new note" },
      user: { _id: "user123" },
    };

    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.spy();

    const noteMock = { content: "new note" };

    sinon.stub(createNoteValidation, "safeParse").returns({
      success: true,
      data: { content: "new note" },
    } as any);

    const createStub = sinon.stub(Note, "create").resolves(noteMock as any);

    await createNote(req, res, next);

    assert.isTrue(createStub.calledOnce);
    assert.isTrue(res.status.calledWith(201));
    assert.isTrue(res.json.calledWithMatch({ success: true, note: noteMock }));
  });
});

// ========================================================
//                 updateNote controller
// ========================================================
describe("updateNote controller", () => {
  it("should call next on validation fail", async () => {
    const req: any = {
      params: { id: "" },
      body: { content: "" },
      user: { _id: "user123" },
    };
    const res: any = {};
    const next = sinon.spy();

    sinon.stub(noteIdValidation, "safeParse").returns({
      success: false,
      error: { issues: [{ message: "Invalid id" }] },
    } as any);

    await updateNote(req, res, next);

    assert.isTrue(next.calledOnce);
  });

  it("should return updated note", async () => {
    const req: any = {
      params: { id: "507c7f79bcf86cd7994f6c0e" },
      body: { content: "updated note" },
      user: { _id: "user123" },
    };

    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.spy();

    sinon.stub(noteIdValidation, "safeParse").returns({
      success: true,
      data: { id: req.params.id },
    } as any);

    sinon.stub(updateNoteValidation, "safeParse").returns({
      success: true,
      data: { content: "updated note" },
    } as any);

    const updateStub = sinon.stub(Note, "findOneAndUpdate").resolves({
      content: "updated note",
    } as any);

    await updateNote(req, res, next);

    assert.isTrue(updateStub.calledOnce);
    assert.isTrue(res.status.calledWith(200));
  });
});

// ========================================================
//                 deleteNote controller
// ========================================================
describe("deleteNote controller", () => {
  it("should delete note successfully", async () => {
    const req: any = {
      params: { id: "507c7f79bcf86cd7994f6c0e" },
      user: { _id: "user123" },
    };

    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.spy();

    sinon.stub(noteIdValidation, "safeParse").returns({
      success: true,
      data: { id: req.params.id },
    } as any);

    const deleteStub = sinon.stub(Note, "findOneAndDelete").resolves({} as any);

    await deleteNote(req, res, next);

    assert.isTrue(deleteStub.calledOnce);
    assert.isTrue(res.status.calledWith(200));
    assert.isTrue(res.json.calledWithMatch({ success: true }));
  });
});
