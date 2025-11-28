import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/reports/latest", async(req,res) => {
    try {
        const [rows] = await db.execute(`SELECT * FROM daily_reports ORDER BY date DESC LIMIT 1`);
        res.json(rows[0] || {});

    } catch (error) {
        res.status(500).json(`db error ${error}`);
    }
});

export default router;