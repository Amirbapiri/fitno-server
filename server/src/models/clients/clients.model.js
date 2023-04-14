const Client = require("./clients.mongo");


async function getClientByPhoneNumber(phoneNumber) {
    try {
        return await Client.findOne({ phoneNumber });
    } catch (e) {
        throw new Error(`No user exists with the given phone number:${e} `);
    }
}

module.exports = {
    getClientByPhoneNumber,
}