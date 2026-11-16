// Controller for /api/listings - reads req.query / req.params, validates, calls the DAL,
// sets the status code and sends JSON. No SQL here.
//
// Step 2: getListings(req, res)
//   - read neighbourhood, roomType, minPrice, maxPrice, sort, limit from req.query
//   - validate: limit (default 20, max 50), minPrice/maxPrice are numbers, sort is "price" or "rating"
//     (anything else -> 400 { error })
//   - map sort to a column name here: ORDER BY can't be a parameter
//
// Step 3: getListingById(req, res)
//   - id is not a number -> 400, no such id -> 404
//   - convert hostIsSuperhost 't' / 'f' to true / false
//
// Every controller: try/catch -> 500 { error } when the DAL throws.
const listingsDAL = require("../dal/listings.dal.js");
async function getListings(req, res) {
    const neighbourhood=req.query.neighbourhood;
    const roomType=req.query.roomType;
    const minPrice=req.query.minPrice;
    const maxPrice=req.query.maxPrice;
    const sort=req.query.sort ?? 'price';
    const limit=Number(req.query.limit ?? 20);
    const safeLimit = Math.min(limit, 50);
    if(!Number.isInteger(limit) || limit<=0){
        res.status(400).json({error:"INVALID LIMIT"});
        return;

    }
    if (
        minPrice !== undefined &&
        (minPrice.trim() === "" ||
        !Number.isFinite(Number(minPrice)) ||
        Number(minPrice) < 0)
    ) {
        return res.status(400).json({ error: "INVALID MIN PRICE" });
    }
    if(sort!=='price' && sort!=='rating'){
       return res.status(400).json({error:"INVALID SORTING"});

    }
      if (
        maxPrice !== undefined &&
        (maxPrice.trim() === "" ||
        !Number.isFinite(Number(maxPrice)) ||
        Number(maxPrice) < 0)
    ) {
        return res.status(400).json({ error: "INVALID MAX PRICE" });
    }
  
   try {
       const listings=await listingsDAL.getListings({
        neighbourhood,
        roomType,
        minPrice,
        maxPrice,
        orderBy:sort,
        limit: safeLimit}
    );
        return res.json(listings)

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
async function getListingById(req, res) {
    const id=Number(req.params.id);
    if( !Number.isFinite(id) || id<=0){
        return res.status(400).json({error:"invalid id"})
    }
    try{
        const listings= await listingsDAL.getListingById(id)
            if(!listings){
            return res.status(404).json({error:"apartment not found"})
        }
        listings.hostIsSuperhost = listings.hostIsSuperhost === 't'; 

        return res.json(listings);
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

module.exports = { getListings,getListingById };