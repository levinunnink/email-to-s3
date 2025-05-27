import app from './index';

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`email-to-s3 listening on http://localhost:${port}`)
);
