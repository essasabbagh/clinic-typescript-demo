import { App, initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import serviceAccountKey from './serviceAccountKey.json';

class FireBaseAdmin {
  public app: App;
  public auth;

  constructor() {
    this.app = initializeApp({
      credential: cert(serviceAccountKey as ServiceAccount),
    }); //run the express instance and store in app

    this.auth = getAuth(this.app);
  }
}

export default new FireBaseAdmin().auth;
