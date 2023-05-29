const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');

require('dotenv').config();

mongoose.connect(process.env.MONGO_DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
	const shortUrls = await ShortUrl.find();
	res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
	await ShortUrl.create({ full: req.body.fullUrl });

	res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
	ShortUrl.findOne({ short: req.params.shortUrl });
});

app.listen(process.env.PORT || 5000);
