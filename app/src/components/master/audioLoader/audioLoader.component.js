import React, { Component, PropTypes } from 'react';


const FREQUENCY = 10;

export default class AudioLoader extends Component {
  static propTypes = {
    onAudioDataChange: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.audioContext = new AudioContext();
    this.audioAnalyser = this.audioContext.createAnalyser();
    this.frequencyData = null;
  }

  handleCanPlay = () => {
    const source = this.audioContext.createMediaElementSource(this.audioNode);
    source.connect(this.audioAnalyser);

    this.audioAnalyser.connect(this.audioContext.destination);
    this.audioAnalyser.fftSize = 64;

    this.frequencyData = new Uint8Array(this.audioAnalyser.frequencyBinCount);

    this.sendFrequencyData();
  };

  sendFrequencyData = () => {
    this.audioAnalyser.getByteFrequencyData(this.frequencyData);

    this.props.onAudioDataChange(this.frequencyData);
    setTimeout(() => {
      this.sendFrequencyData();
    }, FREQUENCY);
  };

  render() {
    return (
      <div className="audioLoader">
        <audio
          controls
          ref={(ref) => (this.audioNode = ref)}
          src={require('../../../../data/song.mp3')}
          onCanPlay={this.handleCanPlay}
        />
      </div>
    );
  }
}
