const service = require("./auth.service");
async function login(req, res, next) {
  try {
    const result = await service.login(req.body.email, req.body.password);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
function me(req, res, next) {
  try { res.json({ success: true, data: service.me(req.user.id) }); }
  catch (err) { next(err); }
}
module.exports = { login, me };
