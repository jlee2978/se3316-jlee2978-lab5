// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // https://console.firebase.google.com/project/se3316-jlee2978-lab5/overview (from my firebase project configurations)
  firebaseConfig : {
    apiKey: "AIzaSyCehXaCF4aBOZAM8fIn6TZidiQ8lhS2h30",
    authDomain: "se3316-jlee2978-lab5.firebaseapp.com",
    databaseURL: "https://se3316-jlee2978-lab5.firebaseio.com",
    projectId: "se3316-jlee2978-lab5",
    storageBucket: "se3316-jlee2978-lab5.appspot.com",
    messagingSenderId: "451015220444",
    appId: "1:451015220444:web:5e69683b3c92cfcd47e819"
  },

};

export const serverUrl = "http://localhost:8080/api/";

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
