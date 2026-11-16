const { sql, poolPromise } = require("../config/db");

async function getHostListings(hostId) {
    const pool = await poolPromise;
    const request = pool.request();

    request.input("hostId", sql.Float, hostId);

    const result = await request.query(`
        SELECT
        UPPER(host_name) AS hostName,
        CAST(id AS INT) AS id,
        CONCAT(room_type,' in ',neighbourhood_cleansed) AS title,
        UPPER(property_type) AS propertyType,
        CAST(price AS INT) AS pricePerNight,room_type AS roomType,
        neighbourhood_cleansed AS neighbourhood,
        ROUND(review_scores_rating / 20.0, 1) AS stars,
        CAST(number_of_reviews AS INT) AS reviewsCount,
        CAST(bedrooms AS INT) AS bedrooms,
        CAST(beds AS INT) AS beds,
        CAST(accommodates AS INT) AS accommodates
        FROM dbo.Paris_Airbnb_listings
        WHERE host_id = @hostId
        AND price IS NOT NULL
        ORDER BY price ASC
    `);

    return result.recordset;
}

module.exports = { getHostListings };