import * as dotenv from 'dotenv'
dotenv.config();

import app from './index';

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`email-to-s3 listening on http://localhost:${port}`)
);
