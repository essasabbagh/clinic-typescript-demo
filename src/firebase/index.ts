import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import serviceAccountKey from './serviceAccountKey.json';

const app = initializeApp({
  credential: cert(serviceAccountKey as ServiceAccount),
});

const auth = getAuth(app);
export default auth;
