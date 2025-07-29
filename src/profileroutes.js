const express = require('express');
const router = express.Router();
const supabase = require('./supabase');
const verifySupabaseToken = require('./auth');

// Input validation middleware
const validateProfileInput = (req, res, next) => {
    const requiredFields = [
        'Gender', 'Age', 'ID', 'BloodType', 
        'PhoneNumber', 'Height', 'weight', 
        'SugarLevel', 'Address'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            missingFields,
            code: 'MISSING_FIELDS'
        });
    }

    // Additional validation can be added here
    if (isNaN(req.body.Age) || req.body.Age < 0 || req.body.Age > 120) {
        return res.status(400).json({
            error: 'Invalid age value',
            code: 'INVALID_AGE'
        });
    }

    next();
};

router.post('/profile', 
    verifySupabaseToken, 
    validateProfileInput, 
    async (req, res) => {
        const {
            Gender, Age, ID, BloodType,
            PhoneNumber, Height, weight,
            SugarLevel, Address
        } = req.body;

        const userId = req.user.id; // From verifySupabaseToken middleware


        try {
            const { data, error } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    Gender,
                    Age: parseInt(Age),
                    NationalID: ID,
                    BloodType,
                    PhoneNumber,
                    Height: parseFloat(Height),
                    weight: parseFloat(weight),
                    SugarLevel: parseFloat(SugarLevel),
                    Address,
                    
                }, {
                  //  onConflict: 'user_id'
                })
                .select(); // Return the inserted/updated record

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            res.status(200).json({ 
                success: true,
                message: 'Profile saved successfully',
                profile: data[0]
            });

        } catch (err) {
            console.error('Profile save error:', err.message);
            res.status(500).json({ 
                error: 'Failed to save profile data',
                code: 'PROFILE_SAVE_ERROR',
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    }
);

module.exports = router;