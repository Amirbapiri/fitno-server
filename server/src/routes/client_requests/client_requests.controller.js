const Request = require("../../models/requests/requests.mongo");
const { Coach } = require("../../models/coaches.mongo");
const Client = require("../../models/clients/clients.mongo");

const httpPostSendRequest = async (req, res) => {
  const data = req.body;
  try {
    const request = new Request({
      height: data["height"],
      weight: data["weight"],
      chest: data["chest"],
      biceps: data["biceps"],
      forearm: data["forearm"],
      waist: data["waist"],
      hips: data["hips"],
      leg: data["leg"],
      extraDescription: data["extraDescription"],
    });
    if (request) {
      const coach = await Coach.findById(data["coach"]);
      const client = await Client.findById(data["client"]);
      request.coach = coach;
      request.client = client;
      await request.save();
      return res.status(201).json(request);
    }
    return res.status(400).json({ msg: "Error in saving request" });
  } catch (e) {
    return res.status(400).json({ msg: `Error in sending request: ${e}` });
  }
}

const httpGetAllRequests = async (req, res) => {
  try {
    const requests = await Request
      .find({ client: req.user })
      .populate("coach", {
        firstName: 1,
        lastName: 1,
      });
    return res.json(requests);
  } catch (e) {
    return res.status(400).json({ msg: `Failure in getting requests: ${e}` });
  }
}


module.exports = {
  httpPostSendRequest,
  httpGetAllRequests,
}