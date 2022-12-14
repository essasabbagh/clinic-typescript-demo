import cors, { CorsRequest } from 'cors';

//options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: 'API_URL',
  preflightContinue: false,
};


const corsInit = cors<CorsRequest>(options);

export default corsInit;
