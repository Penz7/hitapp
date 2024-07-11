const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
app.use(bodyParser.json());

const serviceAccount = require('./path/to/your-service-account-file.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.post('/sendNotification', (req, res) => {
  const { title, body, token } = req.body;

  const message = {
    notification: {
      title: title,
      body: body
    },
    token: token
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
      res.status(200).send('Notification sent successfully');
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      res.status(500).send('Error sending notification');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
