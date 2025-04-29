import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import firestore from '@react-native-firebase/firestore';

GoogleSignin.configure({
  webClientId:
    '272573990459-jgvjkhm8h0t6f53ikvr5g93fnneibonj.apps.googleusercontent.com',
});

export const handleGoogleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    console.log('Google Sign-In: Checking Play Services', GoogleSignin);

    const {data} = await GoogleSignin.signIn();
    console.log('Google Sign-In: ID Token', data?.idToken);
    const googleCredential = auth.GoogleAuthProvider.credential(data?.idToken);
    console.log('Google Sign-In: Google Credential', googleCredential);
    const userCredential = await auth().signInWithCredential(googleCredential);

    const user = userCredential.user;
    console.log('Google login successful:', user);

    // Now save the user to Firestore (if not already present)
    const userRef = firestore().collection('users').doc(user.uid);

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      // If user doesn't exist in Firestore, create a new record
      await userRef.set({
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log('User data saved to Firestore');
    } else {
      console.log('User already exists in Firestore');
    }

    return userCredential;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error; // Optionally, throw the error for handling in the UI
  }
};

// export const handleGoogleSignOut = async () => {
//   try {
//     await GoogleSignin.revokeAccess();
//     await GoogleSignin.signOut();
//     console.log('Google Sign-Out successful');
//   } catch (error) {
//     console.error('Google Sign-Out Error:', error);
//   }
// };

// Function to handle Facebook Login
export const handleFacebookLogin = async () => {
  try {
    console.log('Facebook Login: Starting login process...');
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    console.log('Facebook Login: Result', result);
    if (result.isCancelled) {
      console.log('Facebook login was cancelled');
      return;
    }

    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      console.log('Failed to get Facebook access token');
      return;
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    const userCredential = await auth().signInWithCredential(
      facebookCredential,
    );

    const user = userCredential.user;
    console.log('Facebook login successful:', user);

    // Now save the user to Firestore (if not already present)
    const userRef = firestore().collection('users').doc(user.uid);

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      // If user doesn't exist in Firestore, create a new record
      await userRef.set({
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log('User data saved to Firestore');
    } else {
      console.log('User already exists in Firestore');
    }

    return userCredential;
  } catch (error) {
    console.error('Facebook Login Error:', error);
    throw error; // Optionally, throw the error for handling in the UI
  }
};

export const handleAppleSignIn = async () => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const {identityToken, nonce} = appleAuthRequestResponse;

    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );
    const userCredential = await auth().signInWithCredential(appleCredential);

    return userCredential;
  } catch (err) {
    console.error('Apple Sign-In Error:', err);
  }
};

export const handleSignOut = async (clearUserDetails: () => void) => {
  try {
    const currentUser = auth().currentUser;
    await clearUserDetails();

    if (currentUser) {
      // Sign out from Firebase Auth
      await auth().signOut();
      console.log('Firebase sign-out successful');
    } else {
      console.log('No user currently signed in to Firebase Auth');
    }

    // Revoke Google Sign-In access
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    console.log('Google sign-out successful');

    // Log out from Facebook
    await LoginManager.logOut();
    console.log('Facebook log-out successful');

    // Clear user details from the app context
    await clearUserDetails();
    console.log('User details cleared successfully');
  } catch (error) {
    console.error('Sign-Out Error:', error);
  }
};
