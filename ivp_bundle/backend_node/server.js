const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/ask', (req, res) => {
  const question = req.body.question || '';
  const answer = `Answering: ${question} (powered by IVP WhisperBot)`;
  res.json({ answer });
});

app.get('/', (req, res) => {
  res.send('IVP Node backend is running.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
