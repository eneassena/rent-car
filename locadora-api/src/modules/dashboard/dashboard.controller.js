
const dashboardService = require("./dashboard.service");

function overview(req, res, next) {
  try {
    return res.json({
      success: true,
      data: dashboardService.getOverview()
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { overview };
