const service = require("./clientes.service");
const {
  publicImagePath,
  removeFileByPublicPath,
} = require("../../utils/fileUtils");
const fs = require("fs");
function pagination(req) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  return { page, limit, search: req.query.search };
}
async function list(req, res, next) {
  try {
    res.json({ success: true, data: await service.list(pagination(req)) });
  } catch (e) {
    next(e);
  }
}
async function get(req, res, next) {
  try {
    res.json({ success: true, data: await service.get(Number(req.params.id)) });
  } catch (e) {
    next(e);
  }
}

async function create(req, res, next) {
  try {
    const path = publicImagePath(req.file);
    const item = await service.create(req.body, path);
    res.status(201).json({ success: true, data: item });
  } catch (e) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const result = await service.update(
      Number(req.params.id),
      req.body,
      publicImagePath(req.file),
    );
    if (result.oldImage) removeFileByPublicPath(result.oldImage);
    res.json({ success: true, data: result.item });
  } catch (e) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(e);
  }
}
async function remove(req, res, next) {
  try {
    const row = await service.remove(Number(req.params.id));
    removeFileByPublicPath(row.imagem_path);
    res.json({ success: true, message: "Cliente excluído." });
  } catch (e) {
    next(e);
  }
}
module.exports = { list, get, create, update, remove };
