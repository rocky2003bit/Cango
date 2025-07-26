const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Get all orders for a specific user by email
router.get('/:email', async (req, res) => {
  const userEmail = req.params.email;

  try {
    const [orders] = await db.query(
      "SELECT title, created_at AS date FROM orders WHERE user_email = ? ORDER BY created_at DESC",
      [userEmail]
    );

    res.json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
    res.status(500).json({ error: "Failed to fetch order history" });
  }
});

module.exports = router;
