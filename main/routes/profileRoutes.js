const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const verifySupabaseToken = require('../middleware/auth');
const validateProfileInput = require('../middleware/validation');

// Update or create profile
router.post('/profile', 
  verifySupabaseToken, 
  validateProfileInput, 
  async (req, res) => {
    const profileData = req.body;
    const userId = req.user.id;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select();

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Profile saved successfully',
        profile: data[0]
      });

    } catch (error) {
      console.error('Profile save error:', error);
      res.status(500).json({
        error: 'Failed to save profile data',
        code: 'PROFILE_SAVE_ERROR'
      });
    }
  }
);

module.exports = router;