import { Auth, getAuth } from 'firebase-admin/auth';
import { Messaging, getMessaging } from 'firebase-admin/messaging';
import { App, initializeApp, cert, ServiceAccount } from 'firebase-admin/app';

import serviceAccountKey from './serviceAccountKey.json';

class FireBaseAdmin {
  public app: App;
  public auth: Auth;
  public message: Messaging;

  constructor() {
    this.app = initializeApp({
      credential: cert(serviceAccountKey as ServiceAccount),
    }); // run the express instance and store in app

    this.auth = getAuth(this.app);
    this.message = getMessaging(this.app);
  }
}

export default new FireBaseAdmin();
