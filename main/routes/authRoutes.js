const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Register new user
router.post('/register', validateRegister, async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    // Create auth user
    const { data: userData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });

    if (authError) throw authError;

    // Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: userData.user.id,
        email,
        first_name: firstName,
        last_name: lastName
      }]);

    if (profileError) throw profileError;

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: userData.user.id,
        email,
        firstName,
        lastName
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: error.message || 'Registration failed',
      code: 'REGISTRATION_ERROR'
    });
  }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    res.status(200).json({
      message: 'Login successful',
      user: data.user,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      error: 'Invalid credentials',
      code: 'AUTH_ERROR'
    });
  }
});

module.exports = router;