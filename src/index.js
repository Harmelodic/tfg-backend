import bodyParser from 'body-parser';
import express from 'express';
import health from './routes/health';

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/health', health);
app.get('/', (req, res) => res.send('Hello World!'));

app.listen('8080', () => {
  console.log('Starting application on port: 8080');
});
