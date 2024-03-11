const express = require("express");
const router = express.Router();
const User = require("../models/User");
const LikedSongs = require("../models/LikedSongs");
const Song = require("../models/Song");

router.post("/likedSongs", async (req, res) => {
    try {
        const { songt } = req.body;
        const dulicate=await LikedSongs.findOne({songt});
        if(dulicate)
        {
            return res.status(400).json({ error: "Duplicate data found" }); 
        }

        if (!songt) {
            return res.status(400).json({ error: "Data not received" });
        }

        const createdLikedSong = await LikedSongs.create({ songt });
        
        // Populate the songt field in the createdLikedSong
        await createdLikedSong.populate('songt');


        console.log(createdLikedSong);

        return res.status(201).json({ message: "Song added successfully", createdLikedSong });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/getallLikedSongs",async(req,res)=>{
    
    try{ 
        console.log("hello");
       const allSongs=await LikedSongs.find().populate('songt');
        console.log(allSongs);
        return res.status(201).json({ message: "Song fetched successfully" ,allSongs});
}
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Song not addded" });
    }
   
})


router.post("/removeLike",async (req,res)=>{
    try{
        const {songt}= req.body;
        
        const deleteLike= await LikedSongs.findOneAndRemove({songt:songt});
        console.log(deleteLike);
        return res.status(201).json({ message: "Song removed From Liked Song successfully"});
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Song not addded" });
    }
})

router.get("/getLikedSong",async(req,res)=>{
    
    try{ 
        const {songt}= req.body;
        console.log("hello");
       const allSongs=await LikedSongs.findOne({songt:songt});
        console.log(allSongs);
        return res.status(201).json({ message: "Song fetched successfully",allSongs});
}
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Song not addded"});
    }
   
})


module.exports = router;
