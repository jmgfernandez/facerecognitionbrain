import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ParticlesBg from 'particles-bg';

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
            id: '',
            name: '',
            email: '',
            entries: 0,
            joined: ''
      }
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
    this.setState({imageUrl: this.state.input});

          fetch('http://localhost:3000/imageurl', {
                  method: 'post',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                      input: this.state.input
                  })
          })
          .then(response => {
            if (response) {
                fetch('http://localhost:3000/image', {
                  method: 'put',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                      id: this.state.user.id
                  })
                })
                .then(resp => resp.json())
                .then(count => {
                  this.setState(Object.assign(this.state.user, { entries: count })) 
                })
                .catch(console.log); 
            }
            return response.json();
          })
          .then(result => this.displayFaceBox(this.calculateFaceLocation(result)))
          .catch(error => console.log('error', error));
          
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    } 
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box, user: { name, entries } } = this.state;
    return (
      <div className="App">
        <ParticlesBg className='particle' type="cobweb" num={150} color='#ffffff' bg={true} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home' ? 
        <div><Logo />
        <Rank name={name} entries={entries} />
        <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit}/>
        <FaceRecognition box={box} imageUrl={imageUrl} /> 
        </div>
        : (
            route === 'signin'|| route === 'signout'
            ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} /> 
          ) }
      </div>
    );
  }

}

export default App;
