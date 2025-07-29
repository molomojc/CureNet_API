function validateRegister(req, res, next) {
    const { email, password, firstName, lastName } = req.body;
    const errors = [];
  
    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');
    if (!firstName) errors.push('First name is required');
    if (!lastName) errors.push('Last name is required');
  
    if (password && password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
  
    if (errors.length > 0) {
      return res.status(400).json({ 
        errors,
        code: 'VALIDATION_ERROR'
      });
    }
  
    next();
  }
  
  function validateLogin(req, res, next) {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }
  
    next();
  }
  
  function validateProfileInput(req, res, next) {
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
  
    // Validate data types
    const numericFields = ['Age', 'Height', 'weight', 'SugarLevel'];
    const validationErrors = [];
  
    numericFields.forEach(field => {
      if (isNaN(req.body[field])) {
        validationErrors.push(`${field} must be a number`);
      }
    });
  
    if (req.body.Age < 0 || req.body.Age > 120) {
      validationErrors.push('Age must be between 0 and 120');
    }
  
    if (validationErrors.length > 0) {
      return res.status(400).json({
        errors: validationErrors,
        code: 'INVALID_DATA'
      });
    }
  
    next();
  }
  
  module.exports = {
    validateRegister,
    validateLogin,
    validateProfileInput
  };