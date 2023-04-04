const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1/tickers', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const tickerSchema = new mongoose.Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});

const Ticker = mongoose.model('Ticker', tickerSchema);

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.wazirx.com/api/v2/tickers'
    );
    const tickersData = Object.values(response.data).slice(0, 10);
    await Ticker.deleteMany({});
    await Ticker.insertMany(tickersData);
    res.redirect('/tickers');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/tickers', async (req, res) => {
  try {
    const tickers = await Ticker.find();
    res.render('tickers', { tickers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
