import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

//solution classes
import SignUpForm, {SignUpApp} from  '../problem-a/src/SignUp';

//problem config
const JS_FILE_PATH_ROOT = 'problem-a/src/';

//my custom matchers
const styleMatchers = require('../lib/style-matchers.js');
expect.extend(styleMatchers);

//Enzyme config
Enzyme.configure({ adapter: new Adapter() });


/* Begin the tests */

describe('Source code is valid', () => {
  test('JavaScript lints without errors', async () => {
    const sources = ['SignUp.js'].map((src) => JS_FILE_PATH_ROOT+src);
    const linterOptions = {}; //this should be sufficient with other fields
    sources.forEach((source) => {
      expect([source]).toHaveNoEsLintErrors(linterOptions); //test each
    })
  })
});


describe('The SignUp form', () => { 
  let wrapper; //the "rendered" app
  
  it('renders without crashing', () => {
    wrapper = shallow(<SignUpForm />); //mount for further tests
  });

  it('utilizes `reactstrap` components', () => {
    //make sure included
    expect(wrapper.find('FormGroup').length).toBe(5);
    expect(wrapper.find('Label').length).toBe(4);
    expect(wrapper.find('Input').length).toBe(4);
    expect(wrapper.find('Button').length).toBe(2);
  })

  it('tracks input values in the state', () => {    
    let inputs = wrapper.find('Input');
    let email = inputs.at(0);
    email.simulate('change', {target:{name:'email', value:'hello@world.com'}});
    expect(wrapper.state('email')).toEqual('hello@world.com');

    let password = inputs.at(1);
    password.simulate('change', {target:{name:'password', value:'12345'}});
    expect(wrapper.state('password')).toEqual('12345');

    let handle = inputs.at(2);
    handle.simulate('change', {target:{name:'handle', value:'anonymous'}});
    expect(wrapper.state('handle')).toEqual('anonymous');

    let avatar = inputs.at(3);
    avatar.simulate('change', {target:{name:'avatar', value:'my.uri.com'}});
    expect(wrapper.state('avatar')).toEqual('my.uri.com');
  })

  it('displays an Alert when the form is submitted', () => {
    let app = mount(<SignUpApp />); //mount full app
    let inputs = app.find('Input');

    let email = inputs.at(0);
    email.simulate('change', {target:{name:'email', value:'hello@world.com'}});
    
    let password = inputs.at(1);
    password.simulate('change', {target:{name:'password', value:'123456'}});

    let handle = inputs.at(2);
    handle.simulate('change', {target:{name:'handle', value:'anonymous'}});

    let button = app.find('Button').first();
    button.simulate('click'); //submit!

    let alert = app.find('Alert');
    expect(alert.length).toBe(1); //exists
    expect(alert.props().color).toEqual('success'); //success alert!
    expect(alert.text()).toEqual("Signing up: 'hello@world.com' with handle 'anonymous'"); //shows alert
  })

  describe('shows form validation feedback', () => {
    beforeAll(() => {
      wrapper = mount(<SignUpForm />); //mount clean version
    })

    test('only when modified', () => {
      let email = wrapper.find('Input').at(0);
      let password = wrapper.find('Input').at(1);
      let handle = wrapper.find('Input').at(2);
      let signUpButton = wrapper.find('Button').first();
      let signInButton = wrapper.find('Button').last();

      //valid should be undefined initially
      expect(email.props().valid).toBeUndefined();
      expect(password.props().valid).toBeUndefined();
      expect(handle.props().valid).toBeUndefined();

      //no feedback messages
      expect(email.parents().find('FormFeedback').length).toBe(0);

      //buttons are disabled though!
      expect(signUpButton.props().disabled).toBe(true);
      expect(signInButton.props().disabled).toBe(true);
    })

    test('with input valid styling', () => {
      let email = wrapper.find('Input[name="email"]');
      email.simulate('change', {target:{name:'email', value:'invalid'}});
      email = wrapper.find('Input[name="email"]'); //ref after render
      expect(email.props().valid).toBe(false); //check prop cause css doesn't work
      expect(email.html()).toMatch(/is-invalid/); //hacky, unsure why class not responding

      let password = wrapper.find('Input[name="password"]');
      password.simulate('change', {target:{name:'password', value:'longenough'}});
      password = wrapper.find('Input[name="password"]');
      expect(password.props().valid).toBe(true);
      expect(password.html()).toMatch(/is-valid/);
    })

    test('with form feedback messages', () => {
      let email = wrapper.find('Input[name="email"]');
      email.simulate('change', {target:{name:'email', value:''}}); //empty, 2 errors
      let emailErrors = wrapper.find('Input[name="email"] ~ FormFeedback');      
      expect(emailErrors.length).toBe(2); //2 errors
      expect(emailErrors.at(0).text()).toEqual('Required field.');
      expect(emailErrors.at(1).text()).toEqual('Not an email address.');

      let password = wrapper.find('Input[name="password"]');
      password.simulate('change', {target:{name:'password', value:'short'}});
      let passwordErrors = wrapper.find('Input[name="password"] ~ FormFeedback');      
      expect(passwordErrors.length).toBe(1); //1 error
      expect(passwordErrors.text()).toEqual('Must be at least 6 characters.')
    })

    test('with disabled buttons', () => {
      let signUpButton = wrapper.find('Button').first();
      let signInButton = wrapper.find('Button').last();
      expect(signUpButton.props().disabled).toBe(true); //start off disabled
      expect(signInButton.props().disabled).toBe(true);
      
      let email = wrapper.find('Input[name="email"]');
      email.simulate('change', {target:{name:'email', value:'hello@world.com'}});      
      let password = wrapper.find('Input[name="password"]');
      password.simulate('change', {target:{name:'password', value:'123456'}});
      let handle = wrapper.find('Input[name="handle"]');
      handle.simulate('change', {target:{name:'handle', value:'anonymous'}});
      
      signUpButton = wrapper.find('Button').first(); //refetch after render ?
      signInButton = wrapper.find('Button').last();
      expect(signUpButton.props().disabled).toBe(false); //now enabled!
      expect(signInButton.props().disabled).toBe(false);
    })
  })
})
