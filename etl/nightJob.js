import cron from "node-cron";
import db from "../db.js";


async function runETL() {
    try {
        const [rows] = await db.execute(`
            SELECT
            SUM(watch_time_sec) AS total_watch_time,
            (SELECT category FROM watch_logs
                WHERE DATE(ts) = CURDATE()
                GROUP BY category 
                ORDER BY SUM(watch_time_sec) DESC 
                LIMIT 1
            ) AS top_cat,
            (SELECT HOUR(ts) from watch_logs
                WHERE DATE(ts) = CURDATE()
                GROUP BY HOUR(ts) 
                ORDER BY SUM(watch_time_sec) DESC 
                LIMIT 1
            ) AS peak_hr
            FROM watch_logs
            WHERE DATE(ts) = CURDATE();
        `)

        const result = rows[0];
        
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);

        await db.execute(
            `
            INSERT INTO daily_reports (date, total_watch_sec, top_category, peak_hour)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            total_watch_sec = VALUES(total_watch_sec),
            top_category = VALUES(top_category),
            peak_hour = VALUES(peak_hour)
            `,
            [
                yesterday,
                result.total_watch_time || 0,
                result.top_cat || "unknown",
                result.peak_hr || 0,
            ]
        );

        console.log("ETL result :",result);
        

    } catch (error) {
        console.log(error);
    }
}

export default {
  start: () => {
    runETL(); // run once on server start
    cron.schedule("5 0 * * *", runETL, { timezone: "Asia/Kolkata" });
  },
};