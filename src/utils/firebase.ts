// import admin from 'firebase-admin';

// // Initialize Firebase Admin SDK (Storage only)
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Unescape newlines
//     }),
//     storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
//   });
// }

// // Export only storage bucket
// export const bucket:any = admin.storage().bucket();

// // // config/firebase.ts
// // import admin from 'firebase-admin';

// // // Download service account key from Firebase Console
// // const serviceAccount = require('../path/to/your/serviceAccountKey.json');

// // if (!admin.apps.length) {
// //   admin.initializeApp({
// //     credential: admin.credential.cert(serviceAccount),
// //     storageBucket: 'your-project-id.appspot.com' // Replace with your actual project ID
// //   });
// // }

// // export const bucket: any = admin.storage().bucket();
// // // Alternatively, for better type safety, use:
// // // export const bucket: Bucket = admin.storage().bucket();