const supabase = require('../supabase');

async function verifySupabaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Authorization token required',
      code: 'MISSING_TOKEN'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ 
      error: 'Authentication failed',
      code: 'AUTH_FAILURE'
    });
  }
}

module.exports = verifySupabaseToken;