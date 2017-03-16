import React, { Component, PropTypes } from 'react';


const FREQUENCY = 50;
const AUDIO_SOURCE = 'audio';
const MICROPHONE_SOURCE = 'microphone';

export default class AudioLoader extends Component {
  static propTypes = {
    onAudioDataChange: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.audioContext = new AudioContext();
    this.audioAnalyser = this.audioContext.createAnalyser();
    this.audioSource = null;
    this.audioFrequencyData = null;

    this.microphoneContext = new AudioContext();
    this.microphoneAnalyser = this.microphoneContext.createAnalyser();
    this.microphoneSource = null;
    this.microphoneFrequencyData = null;

    this.stream = null;
    this.timeout = null;

    this.activeSource = '';
  }

  handlePlay = () => {
    if (!this.audioSource) {
      this.audioSource = this.audioContext.createMediaElementSource(this.audioNode);
      this.audioSource.connect(this.audioAnalyser);

      this.audioAnalyser.connect(this.audioContext.destination);
      this.audioAnalyser.fftSize = 32;

      this.audioFrequencyData = new Uint8Array(this.audioAnalyser.frequencyBinCount);
    }
    this.start(AUDIO_SOURCE);
  };

  startRecording = () => {
    navigator.getUserMedia({ audio: true }, (stream) => {
      this.stream = stream;
      this.microphoneSource = this.microphoneContext.createMediaStreamSource(this.stream);
      this.microphoneSource.connect(this.microphoneAnalyser);

      this.microphoneAnalyser.connect(this.microphoneContext.destination);
      this.microphoneAnalyser.fftSize = 32;

      this.microphoneFrequencyData = new Uint8Array(this.microphoneAnalyser.frequencyBinCount);

      this.start(MICROPHONE_SOURCE);
    }, () => {});
  };

  stopRecording = () => {
    this.stream.getTracks().forEach(track => track.stop());

    this.stop();
  };

  start = (activeSource) => {
    this.stop();

    this.activeSource = activeSource;

    this.sendFrequencyData();
  };

  stop = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  };

  sendFrequencyData = () => {
    this[`${this.activeSource}Analyser`].getByteFrequencyData(this[`${this.activeSource}FrequencyData`]);

    this.props.onAudioDataChange(this[`${this.activeSource}FrequencyData`]);
    console.log(this[`${this.activeSource}FrequencyData`]);
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
          <button onClick={this.stopRecording}>Stop recording</button>
        </div>
      </div>
    );
  }
}
