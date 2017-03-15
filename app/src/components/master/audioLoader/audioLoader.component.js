import React, { Component, PropTypes } from 'react';


const FREQUENCY = 50;

export default class AudioLoader extends Component {
  static propTypes = {
    onAudioDataChange: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.audioContext = new AudioContext();
    this.audioAnalyser = this.audioContext.createAnalyser();
    this.audioSource = null;
    this.frequencyData = null;
    this.stream = null;

    this.timeout = null;
  }

  handlePlay = () => {
    this.audioSource = this.audioContext.createMediaElementSource(this.audioNode);
    this.audioSource.connect(this.audioAnalyser);

    this.start();
  };

  startRecording = () => {
    if (!this.stream) {
      navigator.getUserMedia({ audio: true }, (stream) => {
        this.stream = stream;
        this.audioSource = this.audioContext.createMediaStreamSource(this.stream);
        this.audioSource.connect(this.audioAnalyser);

        this.start();
      }, () => {});
    } else {
      this.start();
    }
  };

  start = () => {
    this.stop();

    this.audioAnalyser.connect(this.audioContext.destination);
    this.audioAnalyser.fftSize = 32;

    this.frequencyData = new Uint8Array(this.audioAnalyser.frequencyBinCount);

    this.sendFrequencyData();
  };

  stop = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  };

  sendFrequencyData = () => {
    this.audioAnalyser.getByteFrequencyData(this.frequencyData);

    this.props.onAudioDataChange(this.frequencyData);
    this.timeout = setTimeout(() => {
      this.sendFrequencyData();
    }, FREQUENCY);
  };

  render() {
    return (
      <div className="audioLoader">
        <h2>Audio:</h2>
        <audio
          controls
          ref={(ref) => (this.audioNode = ref)}
          src={require('../../../../data/song.mp3')}
          onPlay={this.handlePlay}
          onPause={this.stop}
        />

        <div>
          <h2>Microphone:</h2>
          <button onClick={this.startRecording}>Start recording</button>
          <button onClick={this.stop}>Stop recording</button>
        </div>
      </div>
    );
  }
}
