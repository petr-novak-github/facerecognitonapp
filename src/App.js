import React from 'react';

import Navigation from './Components/Navigation/Navigation';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';




const particleOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800

      }
    }
    
      }
    }
const initialState = {
  
    input:'',
    imageUrl:'',
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
}

 

class App extends React.Component {

  constructor () {
    super();
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email ,
        entries: data.entries,
        joined: data.joined

      } 
      
    })
  }

  componentDidMount () {
    fetch('http://localhost:3001')
    .then(response => response.json())
    .then(console.log)
  }

displayFaceBox = (box) => {

  this.setState({box: box});
  console.log(box);
}

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    console.log (width, height);
return  {
leftCol: clarifaiFace.left_col * width,
topRow: clarifaiFace.top_row * height,
rightCol: width - (clarifaiFace.right_col * width),
bottom: height - (clarifaiFace.bottom_row * height)
}

  }






  onInputChange = (event) => {

    console.log (event.target.value);
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    
    this.setState({ imageUrl: this.state.input});

    fetch ('https://cryptic-shore-46985.herokuapp.com/imageurl', {
          
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          input: this.state.input
          
        })
      })
     .then(response => response.json())
    
     .then(response => {
      if (response) {
        fetch ('https://cryptic-shore-46985.herokuapp.com:3001/image', {
          
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          id: this.state.user.id
          
        })
      })
      .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, {entries: count}))
      })
      .catch (console.log)


    }
      this.displayFaceBox(this.calculateFaceLocation(response))
  })
     .catch(err => console.log(err))
  

  }

  onRouteChange = (route) => {

    if (route === 'signout') {
      this.setState (initialState)
    }
    else if (route === 'home') {
      this.setState({isSignedIn: true})
    }


    this.setState ({route: route});
  }
  
render () {

  const {isSignedIn, imageUrl, route, box} = this.state;

  return (
    <div className="App">
      <Particles className='particles' params={particleOptions} />
      <Navigation isSignedIn={isSignedIn} onRouteChange = {this.onRouteChange} />
      { this.state.route === 'home' 
      ?
      <div>
      <Logo />
      <Rank
      name = {this.state.user.name} entries= {this.state.user.entries}
      />
      <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit = {this.onButtonSubmit}/>
      <FaceRecognition imageUrl={imageUrl} box={box} /> 
      </div>
      :(
        route === 'signin'
       ? <SignIn 
       loadUser={this.loadUser}
       onRouteChange = {this.onRouteChange} />
       : <Register loadUser={this.loadUser} onRouteChange = {this.onRouteChange} />

      )

      }
    </div>
  );
}
}
export default App;
