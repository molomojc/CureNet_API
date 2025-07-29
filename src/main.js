//import express
const express = require('express');
const app = express();
const supabase = require('./supabase');
const PORT = process.env.PORT || 3000;
const router = express.Router();
const profileRoutes = require('./profileroutes');
const diagnosesRoutes = require('./diagnosesRoutes');
const cors = require('cors');
const dashboard = require('./dashboard');

// Enable CORS for all routes and origins
app.use(cors());
//use the express
app.use(express.json());
app.use(profileRoutes);
app.use(diagnosesRoutes);
app.use(dashboard);



app.post('/api/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    //try to create a new user
    try{
        const {data: userData, error: authError} = await supabase.auth.signUp({
            email,
            password,
            email_confirm: true,
        });

        if(authError) {
            return res.status(500).json({ error: authError.message });
        }

        const userID = userData.user.id;

        const { error: profileError } = await supabase
            .from('profiles')
            .insert([
                {
                    id: userID,
                    firstName,
                    lastName,
                    email
                }
            ]);

            if(profileError) {
                return res.status(500).json({ error: profileError.message });
            }

            return res.status(201).json({ message: 'User registered successfully', user: userData.user });

    } catch(error){
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return res.status(403).json({ error: error.message });
        }

        return res.status(200).json({ 
            message: 'Login successful', 
            user: data.user, 
            token: data.session.access_token 
          });
          
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

