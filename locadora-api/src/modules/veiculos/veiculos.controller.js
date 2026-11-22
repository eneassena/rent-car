const s = require("./veiculos.service");
const {
  publicImagePath,
  removeFileByPublicPath,
} = require("../../utils/fileUtils");
const fs = require("fs");
function opts(req) {
  return {
    search: req.query.search,
    status: req.query.status,
    page: Math.max(1, Number(req.query.page) || 1),
    limit: Math.min(100, Math.max(1, Number(req.query.limit) || 20)),
  };
}
async function list(req, res, next) {
  try {
    res.json({ success: true, data: await s.list(opts(req)) });
  } catch (e) {
    next(e);
  }
}
async function get(req, res, next) {
  try {
    res.json({ success: true, data: await s.get(+req.params.id) });
  } catch (e) {
    next(e);
  }
}
async function availability(req, res, next) {
  try {
    res.json({
      success: true,
      data: await s.availability(req.query.data_retirada, req.query.data_devolucao),
    });
  } catch (e) {
    next(e);
  }
}
async function create(req, res, next) {
  try {
    res.status(201).json({
      success: true,
      data: await s.create(req.body, publicImagePath(req.file)),
    });
  } catch (e) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(e);
  }
}
async function update(req, res, next) {
  try {
    const r = await s.update(+req.params.id, req.body, publicImagePath(req.file));
    if (r.oldImage) removeFileByPublicPath(r.oldImage);
    res.json({ success: true, data: r.item });
  } catch (e) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(e);
  }
}
async function remove(req, res, next) {
  try {
    const v = await s.remove(+req.params.id);
    await removeFileByPublicPath(v.imagem_path);
    res.json({ success: true, message: "Veículo excluído." });
  } catch (e) {
    next(e);
  }
}
module.exports = { list, get, availability, create, update, remove };
