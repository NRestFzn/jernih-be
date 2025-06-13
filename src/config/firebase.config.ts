import {initializeApp, cert, ServiceAccount} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {env} from 'common/utils/envConfig';

const serviceAccount = {
  type: env.FIRESTORE_TYPE,
  project_id: env.FIRESTORE_PROJECT_ID,
  private_key_id: env.FIRESTORE_PRIVATE_KEY_ID,
  private_key: env.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: env.FIRESTORE_CLIENT_EMAIL,
  client_id: env.FIRESTORE_CLIENT_ID,
  auth_uri: env.FIRESTORE_AUTH_URI,
  token_uri: env.FIRESTORE_TOKEN_URI,
  auth_provider_x509_cert_url: env.FIRESTORE_AUTH_PROVIDER,
  client_x509_cert_url: env.FIRESTORE_CERT_CLIENT,
  universe_domain: env.FIRESTORE_UNIVERSE_DOMAIN,
};

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

const db = getFirestore();

export default db;
