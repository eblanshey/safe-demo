// Rename this file to config.js

export default {
  // Change the following to your firebase subdomain.
  // If your app is at https://my-app.firebaseio.com, put 'my-app'
  firebaseApp: 'my-app',

  // In the Firebase dashboard, enable email/password authentication in the 'Login & Auth' section.
  // Then create a new user that you will use as the admin for the site. Paste the uid here.
  // The apps collection will be stored in the admin's drive,
  // and the admin will get special privileges, like deleting apps.
  admin: 'uid'
}