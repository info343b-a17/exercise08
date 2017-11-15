# Problems B &amp; C

In this pair of exercises, you will practice working with the [Firebase](https://firebase.google.com/) service: first for _user authentication_, then as a _realtime database_. Taken together (and in combination with Problem A), you will be creating a simple Twitter clone called "Chirper".

## Running the Program
Because this app is created with React (and scaffolded through Create React App), you will need to install dependencies and run a developer web server in order to transpile and view the application. You can run this server by using the command:

```bash
# from inside the `problem-a/` folder
cd path/to/problem-bc

# install dependencies
npm install  # only once per problem

# run the server
npm start
```

You can then view the rendered page _in a web browser_. Remember to check the Developer console for any errors!


## Problem B Instructions
In this problem, you will utilize the sign-up form you implemented in Problem A to allow the user to sign up for and log into the web app.

To complete the exercise, you will need to edit the included **`src/index.js`**, and **`src/App.js`**, and **`src/SignUp.js`** files to add in the required code. Note that you should ___not___ need to edit any of the other provided files (including `index.html`).

1. As a "step 0", you should edit this problem's `src/SignUp.js` file to contain the code you wrote for Problem A&mdash;you can copy and paste the entirety of the working solution to Problem A into this file (or just replace it outright). This will provide you with a working and validating sign-up form! 

    If you run the application, you should be able to see this form.

2. The first thing you will need to do is create a new Firebase project and add its configuration to your web app. 

    1. Create a new project in the [Firebase Web Console](https://console.firebase.google.com/): click the "Add Project" button, and give it a unique name (try `chirper-your-uw-id`).

    2. Modify the **`src/index.js`** file to add in your project's configuration. You will need to `import` the code firebase library as well as the authentication module.

        ```js
        import firebase from 'firebase/app';
        import 'firebase/auth'; 
        ```

        Also **Copy and paste** the configuration script from the Firebase webpage (The `// Initialize Firebase ...` part). Do this _before_ the `ReactDOM.render()` call.

    3. Enable user authentication for your app in the Firebase Web Console (through the "Authentication" tab in the navigation menu). Click the "Set Up Sign-In Method" button, choose the "Email/Password" option and Enable it.

    This will finish your configuration in the Firebase Web Console, but you can keep the page open to view/debug your app as you sign up new users.

3. The `SignUpForm` you implemented for Problem A is passed the App's `handleSignUp` method as a callback function. Fill in this method so that when it is executed, it creates a new user in the Firebase database.

    - Use the [`firebase.auth().createUserWithEmailAndPassword()`](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createUserWithEmailAndPassword) function to create a user with the given `email` and `password`. Note that you will need to `import firebase from 'firebase/app'` in this module as well in order to access `firebase` global object.

    - After the `createUser...` function finishes (e.g., `.then()`), you should [update the profile](https://firebase.google.com/docs/auth/web/manage-users#update_a_users_profile) of the created user (which is passed as a parameter to the callback). Update the profile so that the `displayName` is the passed in `handle`, and the `photoURL` is the passed in `avatar`.

        _Remember to return the promise returned by `updateProfile()` for chaining!_

    - You should also `catch()` and display any errors with the sign-up process (any time the Promises are rejected). In particular, the `catch()` callback should update the `state` to make the `errorMessage` variable be the `message` property of the passed-in error. (You can also log out the passed in error for debugging). This will cause the error message to be displayed (see the `render()` function for details how!)

    Once this method is implemented, you should be able to fill out the form and sign up a user, who you will be able to see in the Firebase Web Console.

4. Next you will need to make the page be able to respond to a user logging in (which occurs automatically at sign-up) or logging out by handling _authentication events_.

    - Override the **`componentDidMount()`** callback, and have that method call `firebase.auth().onAuthStateChanged()` to register a listener for authorization events.

        If the callback's passed in Firebase User object is defined, you should assign that user to a `this.state.user` property. Otherwise, you should update `this.state.user` to be `null`.

        Remember to use `setState()` to update the state!

    - The `onAuthStateChanged()` method returns a _new function_ that can be used to "unregister" the listener. Save this function as an instance variable (e.g., `this.authUnRegFunc`).

        Override the **`componentWillUnmount()`** callback so that when the component is being removed (the App is going away), you call this saved unregister function.
    
    Now when you sign up the user (or refresh the page), you should see an example welcome message! Note that this message is _conditionally rendered_ based on `this.state.user`, so be sure you have updated that state variable correctly!


5. Now that users can sign up, you should also make sure they can sign in and out again. Fill in the `handleSignIn()` and `handleSignOu()` methods to provide this functionality.

    - In `handleSignIn()`, you should call `firebase.auth().signInWithEmailAndPassword()`, passing in the given `email` and `password`. Again, you should `.catch()` any errors and assign their `message` to `this.state.errorMessage`.

        Note that when the user is signed in, this will cause an "authentication event" that will be caught by the listener you registered in the previous step!
    
    - In `handleSignOut()`, you should call `firebase.auth().signOut()`, again saving any error messages in the state.

    Now you should be able to log your users in and out!

6. Finally, you may have noticed that when you load the page, it briefly shows the sign-up form before realizing that the user is logged in already and changing to show the welcome message. Instead, modify the app so that it shows a "spinner" while it is loading authentication information, then displays either the sign-in form or the welcome message as appropriate.

    - Add a new variable `loading` to the App's `state`. Initialize this variable as `true` in the constructor.

    - Modify the App's `render()` function so that _if_ the `loading` state is `true`, then it just returns the following DOM content to show a Font-Awesome spinner (instead of anything else):

        ```html
        <div class="text-center">
            <i class="fa fa-spinner fa-spin fa-3x" aria-label="Connecting..."></i>
        </div>
        ```

    - Finally, modify your `onAuthStateChanged()` callback (in `componentDidMount()`) so that in addition to setting the `user` state variable, you also set the `loading` state variable to be `false`. In other words, the page will "stop" loading once an authentication event has been received (whether that is logging in or logging out).

    Now you should see a spinner instead of the sign up form when you refresh the page while signed in!

## Testing Problem B
Coming soon...



## Problem C Instructions
In this problem, you will add the ability for users to post messages ("chirps"), as well as see the messages posted by others. This will give you practice using the Firebase realtime database.

To complete the exercise, you will need to edit make minor changes to **`src/index.js`**, and **`src/App.js`**, and significant changes to the components in the **`src/chirper/`** folder.

1. In `src/App.js`, add `import` statements to import the `ChirperHeader`, `ChirpBox`, and `ChirpList` from their respective modules in the `./chirper/` directory. Note that all of these components are _default exports_, so you should import them using `import ComponentName from 'module'` syntax.

    Then modify the `App` component's `render()` function so that instead of showing a `WelcomeHeader` when the user is logged in, it shows a `ChirperHeader`. Note that these components expect and use the same props, so you can just change the tag from `<WelcomeHeader>` to `<ChirperHeader>`. This should cause the application header instead of the testing welcome message.

    Additionally, when the user is logged in, the `App` should also render a `<ChirpBox>` component and a `<ChirpList>` component _after_ the `<ChirperHeader>` (as siblings). Each of these components should be passed the current signed in user (the `this.state.user`) as a **`currentUser`** prop, so that they know who is logged in.

2. In order to access the realtime database, you will need to make a couple of configuration changes:

    1. In `src/index.js`, be sure to `import 'firebase/database'` to make that module available.

    2. In the Firebase Web Console, you will need to specify the [security rules](https://firebase.google.com/docs/database/security/) for the database. You should specify the following rule:

        ```json
        {
          "rules": {
		    ".read": true,
            "chirps": {
              ".write":"auth != null"
            }
          }
        }
        ```

        This specifies that _everyone_ can read the data (see the chirps), but only authenticated users will be able to edit the data.

3. Modify the **`ChirpBox`** component so that the user is able to post a new message to the network. You can do this by filling in the `postChirp()` method (which is executed when the "Share" button is pressed).

    First define an object (e.g., `newChirp`) that will represent the new post. This object should have the following properties:

    - `text` that is the value the user has entered into the textbox (saved as `this.state.post`)
    - `userId`, which should be the `uid` property of the given `currentUser` prop.
    - `userName`, which should be the `displayName` property of the `currentUser`
    - `userPhoto`, which should be the `photoURL` property of the `currentUser`
    - `time`, which should be a timestamp for when the post is recorded. You can use the constant `firebase.database.ServerValue.TIMESTAMP` to specify that the time should be whatever time the post is added to the Firebase server.

    Then use the `firebase.database().ref()` to get a reference to the `chirps` entry in the database, and use the `push()` method to add the new chirp to the database.

    (Note that you'll want to `catch()` if the Promise returned by this method is rejected in order to log out any errors, though the provided code does not include a way to render those errors for the user to see).

    This should allow you to post new Chirps, which you will be able to see in the Firebase Web Console.

4. Modify the **`ChirpList`** component so that it listens for changes to and downloads the list of chirps in the database.

    In the **`componentDidMount()`** callback, get a reference to the `'chirps'` entry in the database. Save this reference as an instance variable (e.g., `this.chirpsRef`) for use later (so you don't need to look it up later).

    Then call the `.on()` method on this reference to register a listener for `'value'` events. The callback for this listener will be passed a database `snapshot`; use the `.val()` method to turn this snapshot into a JavaScript object, and save that object in the component's `this.state.chirps` property.

    Also override the `componentWillUnmount()` callback, and use the `off()` function to "unregister" the listener when the component is removed. This will keep your app from crashing when the user logs out.

3. Fill in the `ChirpList` component's `render()` method so that it renders an array of `<ChirpItem>` elements based on the data stored in `this.state.chirps`. There are a few steps to this:

    1. You will first need to convert the `this.state.chirps` Object into an array of "chirp" objects. You can do this by **mapping** the `Object.keys()` of the `this.state.chirps` object into an array of objects, each of which is the value of `this.state.chirps` at that particular key.

        Also assign the key as an **`id`** property to the chirp object so that you can keep track of which chirp is which!

    2. Optionally: use the JavaScript [`sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) method to sort the array of chirp objects by their `time` property in descending order.

    3. Finally, _map_ the "chirp array" into an array of `<ChirpItem>` elements. Each `<ChirpItem>` should be passed a **`chirp`** prop that is the chirp object (with its `id`!), as well as a **`currentUser`** prop that is the current user.

        - Don't forget to also assign the element a `key` attribute so that React can keep track of them. The chirp's `id` is a good value to use as the array `key`.      
    This should allow you to see the Chirps displayed when they are posted! Try posting more (and when logged in as different users) to see it in action.

4. Finally, add the ability for a user to "like" a chirp by clicking on the heart icon. You can add this functionality by filling in the `likeChirp()` method in the `ChirpItem` component (found at the bottom of the `ChirpList.js` file).

    You will do this by giving each "chirp" a new **`likes`** property, which itself is an object whose properties are **user uids** and whose values are `true` (specifying that user has liked the chirp). This structure means that each `chirp` object (including the one passed in as a prop to the `<ChirpItem>`) may have a `likes` property! If that property is `undefined`, then it just means that no one has liked the chirp yet.

    1. First, you'll need a reference to the specific chirp's `likes` property in the database (at `chirps/:id/likes`, where `:id` is the chirp id). Use the `firebase.database().ref()` function to get this reference, either by specifying a path to that element or by using the `child()` method.

    2. Next, define a variable that is an _updated_ version of the current `this.prop.chirp.likes` object. (If the `likes` property is undefined, then your updated version will start out as an empty object `{}`).

        Add a property to this object whose key is the current user's `uid` and whose value is `true`, representing that the user has "liked" the chirp. If the user has already liked the chirp (there is already a key for their `uid`), you should instead assign a value of `null` to that property&mdash;this will cause it to be removed from the Firebase database.

    3. Finally, use the `.set()` method to assign the updated value to the referenced element in the Firebase database. Again, `catch()` if the Promise is rejected and log out any errors.
        
        You can even allow the user to "toggle" whether they like a chirp by instead assigning a value of `null` to this key if the user pre

    This should add in "liking" functionality, so you can like the stuff you've done!

## Testing Problem C
Coming soon...
