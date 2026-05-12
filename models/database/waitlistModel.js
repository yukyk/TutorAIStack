const pool = require('../../config/db');

class WaitlistModel {
  static async addEmail(email) {
    const [result] = await pool.query(
      'INSERT INTO waitlist (email) VALUES (?)',
      [email]
    );
    return result;
  }

  static async getCount() {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM waitlist');
    return rows[0].count;
  }
}

module.exports = WaitlistModel;
