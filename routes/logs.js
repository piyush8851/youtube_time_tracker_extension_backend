import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/log", async(req,res) => {
    
    const { videoId, videoTitle, category, watchTimeSec,timeStamp} = req.body;

    if(!videoId || !watchTimeSec){
        return res.status(400).json({error: "Missing Fields"});
    }

    let ts = timeStamp;
  if (!ts) {
    ts = new Date().toISOString().slice(0, 19).replace("T", " ");
  }

    try {
        await db.execute(
            `INSERT INTO watch_logs (video_id, video_title, category, watch_time_sec, ts) VALUES (?, ?, ?, ?, ?)`,
            [videoId, videoTitle, category, watchTimeSec,ts]
        );

        res.status(200).json({ok:true})
    } catch (error) {
        res.status(500).json({error: `db error ${error}`});
    }
});

export default router;