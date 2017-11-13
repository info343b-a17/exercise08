import React, { Component } from 'react'; //import React Component

import './SignUp.css'; //load module CSS
import noUserPic from './img/no-user-pic.png'; //placeholder image (as a data Uri)

class SignUpForm extends Component {
  constructor(props){
    super(props);
    this.state = {}; //initialize state
  }

  //handle signUp button
  handleSignUp(event) {
    event.preventDefault(); //don't submit
    let avatar = this.state.avatar || noUserPic; //assign default if undefined
    this.props.signUpCallback(this.state.email, this.state.password, this.state.handle, avatar);
  }

  //handle signIn button
  handleSignIn(event) {
    event.preventDefault(); //don't submit
    this.props.signInCallback(this.state.email, this.state.password);
  }

  /**
   * A helper function to validate a value based on an object of validations
   * Second parameter has format e.g., 
   *    {required: true, minLength: 5, email: true}
   * (for required field, with min length of 5, and valid email)
   */
  validate(value, validations) {
    let errors = [];
    
    if(value !== undefined){ //check validations
      //handle required
      if(validations.required && value === ''){
        errors.push('Required field.');
      }

      //handle minLength
      if(validations.minLength && value.length < validations.minLength){
        errors.push(`Must be at least ${validations.minLength} characters.`);
      }

      //handle email type
      if(validations.email){
        //pattern comparison from w3c
        //https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
        let valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
        if(!valid){
          errors.push('Not an email address.')
        }
      }
      return errors; //report the errors
    }
    return undefined; //no errors defined (because no value defined!)
  }


  /* SignUpForm#render() */
  render() {

    return (
      <form>

        {/* email */}
        <div>
          <label for="email">Email</label>
          <input id="email" 
            type="email" 
            name="email"
            />
        </div>
        
        {/* password */}
        <div>
          <label for="password">Password</label>
          <input id="password" 
            type="password"
            name="password"
            />
        </div>

        {/* handle */}
        <div>
          <label htmlFor="handle">Handle</label>
          <input id="handle" 
            name="handle"
            />
        </div>

        {/* avatar */}
        <div>
          <img className="avatar" src={this.state.avatar || noUserPic} alt="avatar preview" />
          <label htmlFor="avatar">Avatar Image URL</label>
          <input id="avatar" 
            name="avatar" 
            placeholder="http://www.example.com/my-picture.jpg" 
            />
        </div>

        {/* buttons */}
        <div>
          <button className="mr-2" onClick={(e) => this.handleSignUp(e)} >
            Sign-up
          </button>
          <button onClick={(e) => this.handleSignIn(e)} >
            Sign-in
          </button>
        </div>
      </form>
    )
  }
}

//A simple component that displays the form, with alert callbacks
class SignUpApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  handleSignUp(email, password, handle, avatar) {
    this.setState({alert: `Signing up: '${email}' with handle '${handle}'`});
  }

  handleSignIn(email, password) {
    this.setState({alert: `Signing in: '${email}'`});
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Sign Up!</h1>
        </header>

        <SignUpForm 
          signUpCallback={(e,p,h,a) => this.handleSignUp(e,p,h,a)} 
          signInCallback={(e,p) => this.handleSignIn(e,p)} />

      </div>
    );
  }
}
  
export default SignUpForm; //the default
export { SignUpApp }; //for problemA
