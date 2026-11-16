// Controller for /api/hosts
//
// Step 4: getHostListings(req, res)
//   - hostId is not a number -> 400, no places found -> 404
//   - try/catch -> 500 { error }
const hostDal = require("../dal/hosts.dal.js");

async function getHostListings(req, res) {
    const hostId = Number(req.params.hostId);

    if (!Number.isFinite(hostId) || hostId <= 0) {
        return res.status(400).json({ error: "Invalid hostId" });
    }

    try {
        const listings = await hostDal.getHostListings(hostId);

        if (listings.length === 0) {
            return res.status(404).json({ error: "No places found" });
        }

        return res.json(listings);

    } catch (err) {
        return res.status(500).json({ error: "Database error" });
    }
}

module.exports = { getHostListings };