const Request = require("../../models/requests/requests.mongo");

const httpGetAllRequests = async (req, res) => {
  try {
    const requests = await Request
      .find({ coach: req.user })
      .populate("client", {
        firstName: 1,
        lastName: 1,
      });
    return res.json(requests);
  } catch (e) {
    return res.status(400).json({ msg: `Failure in getting requests: ${e}` });
  }
}

const httpGetSingleRequest = async (req, res) => {
  try {
    const request = await Request
      .findOne({ coach: req.user, _id: req.params.id })
      .populate("client", {
        firstName: 1,
        lastName: 1,
      });
    return res.json(request);
  } catch (e) {
    return res.status(400).json({ msg: `Failure in getting request: ${e}` });
  }
}

module.exports = {
  httpGetAllRequests,
  httpGetSingleRequest,
}