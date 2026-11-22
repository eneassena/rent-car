
const dashboardService = require("./dashboard.service");

async function overview(req, res, next) {
  try {
    return res.json({
      success: true,
      data: await dashboardService.getOverview()
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { overview };
