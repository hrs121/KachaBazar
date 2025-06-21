console.log('Testing basic Node.js');
const express = require('express');
console.log('Express loaded');

const app = express();
console.log('Express app created');

app.get('/', (req, res) => {
  res.send('Hello World');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});
