const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*', // For development. Can restrict later.
}));

app.use(express.json());

if (!fs.existsSync('lee_twitter.csv')) {
  fs.writeFileSync('lee_twitter.csv', 'username,tweet_datetime,text,link\n');
}

app.post('/save-tweet', (req, res) => {
  const { id, date, text, link } = req.body;

  if (!id || !date || !text || !link) {
    return res.status(400).send({ error: 'Missing fields' });
  }

  const escapedText = text.replace(/"/g, '""');

  fs.appendFileSync(
    'tweets.csv',
    `"${id}","${date}","${escapedText}","${link}"\n`
  );

  res.send({ status: 'ok' });
});

app.listen(3000, () => console.log('Local API listening on port 3000'));
