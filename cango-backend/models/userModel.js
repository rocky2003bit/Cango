const db = require('../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows;
};

const createUser = async (name, email, hashedPassword, country, state, city, whatsapp) => {
  const sql = `
    INSERT INTO users (name, email, password, country, state, city, whatsapp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  return await db.query(sql, [name, email, hashedPassword, country, state, city, whatsapp]);
};

module.exports = { findUserByEmail, createUser };
