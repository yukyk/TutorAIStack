const WaitlistModel = require('../../models/database/waitlistModel');

class WaitlistController {
  static async joinWaitlist(req, res) {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }

    try {
      const result = await WaitlistModel.addEmail(email);
      res.status(201).json({ message: 'Successfully joined waitlist!', id: result.insertId });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Email is already on the waitlist.' });
      }
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to join waitlist.' });
    }
  }

  static async getWaitlistCount(req, res) {
    try {
      const count = await WaitlistModel.getCount();
      res.status(200).json({ count });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to fetch waitlist count.' });
    }
  }
}

module.exports = WaitlistController;
