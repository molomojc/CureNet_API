const supabase = require('./supabase');

async function verifySupabaseToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            error: 'Authorization header missing or invalid',
            code: 'MISSING_AUTH_HEADER'
        });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error) {
            console.error('Token verification error:', error.message);
            return res.status(401).json({ 
                error: 'Invalid or expired token',
                code: 'INVALID_TOKEN'
            });
        }

        if (!user) {
            return res.status(401).json({ 
                error: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }

       
        req.user = user;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(500).json({ 
            error: 'Internal server error during authentication',
            code: 'AUTH_SERVER_ERROR'
        });
    }
}

module.exports = verifySupabaseToken;