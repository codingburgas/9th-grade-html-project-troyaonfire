const express = require('express');
const fs = require('fs').promises;
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./models/User.model'); 
const News = require('./models/News.model'); 
const Event = require('./models/Event.model'); 

const app = express();
const saltRounds = 10;

// MongoDB connection setup (not used in this example, but included for completeness)
const dbURI = 'mongodb+srv://ulvie1m:iaOCQGT4cWSNFdkk@cluster0.wc6l44v.mongodb.net/TroyaOnFire?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI)
.then((result) => {app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
})
.catch((err) => console.log(err));


app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());
app.use(bodyParser.json());

// REGISTER
app.post('/register', async (req, res) => {
  // const { firstName, lastName, email, password, workingStatus, region } = req.body;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const workingStatus = req.body.workingStatus;
  const region = req.body.region;

  try{
    User.find({ email: email })
    .then((result) => {
      if (result.length > 0) {
        return res.status(400).send('User already exists');
      }

      bcrypt.hash(password, saltRounds)
      .then((hashedPassword) => {
        const newUser = new User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedPassword,
          workingStatus: workingStatus,
          region: region
        });

        newUser.save()
        .then(() => res.send('Registered successfully'))
        .catch(err => {
          console.error(err);
          res.status(500).send('Server error');
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Server error');
      });
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    User.find({ email: email })
    .then((result) => {
      if (result.length === 0) {
        return res.status(401).send('Invalid email or password');
      }

      const user = result[0];
      bcrypt.compare(password, user.password)
      .then((isMatch) => {
        if (!isMatch) {
          return res.status(401).send('Invalid email or password');
        }

        // Don't send the password back
        res.json({ email: user.email, firstName: user.firstName, lastName: user.lastName, workingStatus: user.workingStatus, region: user.region });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Server error');
      });
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
    
  }
});

app.post('/createNewsPost', (req, res) => {
  const { postType, postTitle, description, email } = req.body;
  let initials = '';

  User.find({ email: email })
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).send('User not found');
      }

      const user = result[0];
      initials = user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase();

      const newPost = new News({
          email: email,
          postType: postType,
          postTitle: postTitle,
          postDescription: description,
          initials: initials
        });

        newPost.save()
        .then(() => res.send({ success: true, message: 'Post created successfully' }))
        .catch(err => {
          console.error(err);
          res.status(500).send('Server error');
        });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send('Server error');
    });

})
  
app.post('/createEventsPost', (req, res) => {
  const { eventType, eventDate, eventLocation, eventHour, email} = req.body;

  let initials = '';

  User.find({ email: email })
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).send('User not found');
      }

      const user = result[0];
      initials = user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase();

      const newEvent = new Event({
          email: email,
          eventType: eventType,
          eventDate: eventDate,
          eventLocation: eventLocation,
          eventTime: eventHour,
          initials: initials
        });

        newEvent.save()
        .then(() => res.send({ success: true, message: 'Event created successfully' }))
        .catch(err => {
          console.error(err);
          res.status(500).send('Server error');
        });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send('Server error');
    });
    
  
})

// Get all posts
app.get('/getPosts', (req, res) => {
  const typeOfPosts = req.query.typeOfPosts;

  if (typeOfPosts === 'news-grid') {
    News.find()
      .then(posts => res.send({
        payload: true,
        posts: posts
      }))
      .catch(err => {
        console.error(err);
        res.status(500).send('Server error');
      });
  } else if (typeOfPosts === 'events-grid') {
    Event.find()
      .then(posts => res.send({
        payload: true,
        posts: posts
      }))
      .catch(err => {
        console.error(err);
        res.status(500).send('Server error');
      });
  } else {
    res.status(400).send('Invalid post type');
  }
})

app.get("/getUserPostsCount", (req, res) => {
  const userEmail = req.query.userEmail;

  News.find({ email: userEmail })
    .then(newsPosts => {
      Event.find({ email: userEmail })
        .then(eventPosts => {
          const totalCount = newsPosts.length + eventPosts.length;
          res.send({ payload: true, count: totalCount });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Server error');
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Server error');
    });
})

  