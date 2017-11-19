import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

//solution classes
import App from  '../problem-bc/src/App';

//problem config
const JS_FILE_PATH_ROOT = 'problem-b/src/';

//my custom matchers
const styleMatchers = require('../lib/style-matchers.js');
expect.extend(styleMatchers);

//Enzyme config
Enzyme.configure({ adapter: new Adapter() });

//Firebase mock
jest.mock('firebase/app'); //replace module with my version

//test data
const TEST_USER = { email: 'testA@email.com', password: '123456', name: 'Person A' };

/* Begin the tests */

describe('Source code is valid', () => {
  test('JavaScript lints without errors', async () => {
    const sources = ['index.js','App.js'].map((src) => JS_FILE_PATH_ROOT+src);
    const linterOptions = {}; //this should be sufficient with other fields
    sources.forEach((source) => {
      expect([source]).toHaveNoEsLintErrors(linterOptions); //test each
    })
  })
});

describe('The Sign Up form', () => { 
  let wrapper; //the "rendered" app
  let auth;

  it('renders without crashing', () => {
    wrapper = mount(<App />); //mount for further tests

    //also do setup in this test for now
    auth = firebase.auth();
    auth.changeAuthState({}); //noop to connect
    auth.changeAuthState(null); //log out person initially
    auth.createUser(TEST_USER); //create user account (for testing)
    auth.flush(); //run changes
    wrapper.update(); //make sure wrapper updates
    // console.log(wrapper.html());
  });

  //sets up firebase & enables authentication (cannot test)

  // it('creates user on form submission', async () => {
  //   //TODO: mock FirebaseUser
  //   let inputs = wrapper.find('input');
  //   let email = inputs.at(0);
  //   email.simulate('change', {target:{name:'email', value:TEST_USER.email}});
  //   let password = inputs.at(1);
  //   password.simulate('change', {target:{name:'password', value:TEST_USER.pw}});
  //   let handle = inputs.at(2);
  //   handle.simulate('change', {target:{name:'handle', value:TEST_USER.name}});

  //   let signup = wrapper.find('Button').first();
  //   signup.simulate('click'); //submit!
  //   auth.flush(); //run firebase response

  //   //test once FirebaseUser has been mocked
  //   let user = await auth.getUserByEmail(TEST_USER.email);
  //   expect(user).toBeDefined();
  //   expect(user.email).toMatch(TEST_USER.email);
  // })

  // it('creates users with profile information', () => {
  //   //TODO: implementy once FirebaseUser has been mocked
  //   //check profile data of created user ()
  //   //=> expect(user.displayName).toMatch(TEST_USER.displayName);
  // })

  // it('displays user creation errors', () => {
  //   //TODO: implementy once FirebaseUser has been mocked
  //   //try to create the same person, check error shown (handled by mock?)
  // })

  it('responds to auth state changes', () => {
    auth.changeAuthState(TEST_USER); //log in test user manually
    auth.flush(); //run changes
    wrapper.update(); //make sure wrapper updates
    expect(auth.getAuth()).toEqual(TEST_USER); //test user is logged in    
    let logout = wrapper.find('.btn-warning')
    expect(logout.length).toBe(1); //show button to log out (responded)

    auth.changeAuthState(null); //log out user manually
    auth.flush(); //run firebase response
    wrapper.update(); //make sure wrapper updates
    
    expect(auth.getAuth()).toEqual(null); //no user logged in
    logout = wrapper.find('.btn-warning')
    expect(logout.length).toBe(0); //should not show button (responded)
  })

  it('signs in the user on form submission', () => {
    expect(auth.getAuth()).toEqual(null); //start with no one logged in

    let inputs = wrapper.find('Input');
    let email = inputs.at(0);
    email.simulate('change', {target:{name:'email', value:TEST_USER.email}});
    let password = inputs.at(1);
    password.simulate('change', {target:{name:'password', value:TEST_USER.password}});

    let signin = wrapper.find('Button').at(1);
    signin.simulate('click'); //submit!
    auth.flush(); //run firebase response
    wrapper.update(); //make sure wrapper updates

    expect(auth.getAuth().email).toMatch(TEST_USER.email); //should be signed in as test user

    let logout = wrapper.find('.btn-warning')
    expect(logout.length).toBe(1); //should show login button
  })

  it('signs out the user on button click', () => {
    expect(auth.getAuth().email).toEqual(TEST_USER.email); //test user is logged in
    
    let logout = wrapper.find('.btn-warning')
    expect(logout.length).toBe(1); //should be logged in (shows button)
    logout.simulate('click');
    auth.flush(); //run firebase response
    wrapper.update(); //make sure wrapper updates
    
    expect(auth.getAuth()).toEqual(null); //no user logged in (we responded)!
  })

  it('shows a spinner when contacting the server', () => {
    wrapper = mount(<App />); //start new app (without connecting to firebase)
    expect(wrapper.find('.fa-spinner').length).toBe(1); //should have a spinner
    //(spinner must have gone away for other tests to pass)
  })
})
