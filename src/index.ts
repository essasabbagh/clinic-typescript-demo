import app from './app';
import connectDb from './client/database';
import { errorHandler } from './middlewares/handle-error';
import { AppError } from './errors';

const PORT = process.env.PORT || 3000;

// Connect Database
connectDb();
app.all('*', () => {
  throw new AppError(404, 'Route not found');
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});
// http://localhost:5000/
