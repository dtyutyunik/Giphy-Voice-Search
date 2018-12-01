import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const api_key=process.env.REACT_APP_GIPHY;

var recognition = new SpeechRecognition();

class App extends Component {

  constructor(props){
    super(props);
        this.state=({
          leftside: [],
          rightside: [],
          leftImage: [],
          rightImage: []
        });

 this.soundhandle = this.soundhandle.bind(this);
 this.generateImages = this.generateImages.bind(this)


  }

soundhandle(){


  recognition.start();
  // console.log('started');
    recognition.onresult = function(event) {
        let words=event.results[0][0].transcript.split(' ');
        // console.log(words[0]);
        // console.log(words[1]);
        // console.log(words[2]);
        this.setState({
          leftside: !!words[0]?words[0]: "Didnt hear you",
          rightside: !!words[1]?words[1]: "Didnt hear you"
        })
            this.generateImages(this.state.leftside,this.state.rightside);

    }.bind(this); //needs to be bind to work, otherwise it says it's not a function



    recognition.onsoundend = function() {
      console.log('Sound has stopped being received');

    }

    // this.generateImages(this.state.leftside,this.state.rightside);

}


async generateImages(left,right){


  const leftInfo= await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${left}&limit=2&offset=0&rating=G&lang=en`);

  let leftInfopic=leftInfo.data.data[0].images.original.url;

  const rightInfo= await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${right}&limit=1&offset=0&rating=G&lang=en`);

  let rightInfopic=rightInfo.data.data[0].images.original.url;



  this.setState({
    leftImage: leftInfopic,
    rightImage: rightInfopic
  });
}



  render() {
    return (
      <div className="App">


      <div className="results">

        <h1 className='title'>Welcome to the world of Giphy</h1>
          <h2 className='word'>Click the microphone & say 2 words</h2>
          <div className="left">
            <p>{this.state.leftside}</p>
            <img className="pics" src={this.state.leftImage} alt='left pic'/>
          </div>
        <img id="microphone" onClick={()=>this.soundhandle()} src={"http://pluspng.com/img-png/microphone-png-microphone-png-transparent-image-1104.png"} alt='microphone'/>

      <div className="right">
          <p>{this.state.rightside}</p>
          <img className="pics" src={this.state.rightImage} alt='right pic'/>
        </div>
        </div>
      </div>
    );
  }
}

export default App;
