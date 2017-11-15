import React, { Component } from 'react'; //import React Component
import SignUpForm from './SignUp'; //does this work?!

class App extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  //A callback function for registering new users
  handleSignUp(email, password, handle, avatar) {
    this.setState({errorMessage:null}); //clear any old errors

    /* TODO: sign up user here */

  }

  //A callback function for logging in existing users
  handleSignIn(email, password) {
    this.setState({errorMessage:null}); //clear any old errors

    /* TODO: sign in user here */

  }

  //A callback function for logging out the current user
  handleSignOut(){
    this.setState({errorMessage:null}); //clear any old errors

    /* TODO: sign out user here */
    
  }


  render() {
    let content=null; //content to render

    if(!this.state.user) { //if logged out, show signup form
      content = (
        <div className="container">
          <h1>Sign Up</h1>
          <SignUpForm 
            signUpCallback={(e,p,h,a) => this.handleSignUp(e,p,h,a)} 
            signInCallback={(e,p) => this.handleSignIn(e,p)} 
            />
        </div>
      );
    } 
    else { //if logged in, show welcome message
      content = (
        <div>
          <WelcomeHeader user={this.state.user}>
            {/* log out button is child element */}
            {this.state.user &&
              <button className="btn btn-warning" 
                      onClick={() => this.handleSignOut()}>
                Log Out {this.state.user.displayName}
              </button>
            }
          </WelcomeHeader>
        </div>
      );
    }

    return (
      <div>
        {this.state.errorMessage &&
          <p className="alert alert-danger">{this.state.errorMessage}</p>
        }
        {content}
      </div>
    );
  }
}

//A component to display a welcome message to a `user` prop (for readability)
class WelcomeHeader extends Component {
  render() {
    return (
      <header className="container">
        <h1>
          Welcome {this.props.user.displayName}!
          {' '}
          <img className="avatar" src={this.props.user.photoURL} alt={this.props.user.displayName} />
        </h1>
        {this.props.children} {/* for button */}
      </header>
    );
  }
}

export default App;