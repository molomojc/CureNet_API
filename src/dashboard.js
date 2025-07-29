const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('./supabase'); // adjust path as needed

router.get('/profile/data', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  //if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user?.email) {
      return res.status(401).json({ error: 'Invalid token or session expired.' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', user.email)
      .single();

    if (error) return res.status(500).json({ error: 'Error fetching profile' });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
