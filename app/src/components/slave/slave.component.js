import React, { Component } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, Color,
  BoxGeometry, MeshToonMaterial, Mesh, PointLight } from 'three';
import { sum, values, range } from 'lodash';
import { connect, disconnect, requestsTypes } from '../../services/webSocketService';

const BARS_NUMBER = 16;
const VIBRATE_THRESHOLD = 114;

export default class Slave extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
    this.renderer = new WebGLRenderer({ antialias: true });

    let dpr = 1;
    if (window.devicePixelRatio) {
      dpr = window.devicePixelRatio;
    }

    this.renderer.setPixelRatio(dpr);
    this.scene.background = new Color(0xffffff);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.set(0, 0, 50);

    this.light = new PointLight(0xffffff, 1, 100);
    this.light.position.set(-5, 5, 10);
    this.scene.add(this.light);

    this.visualisation.appendChild(this.renderer.domElement);

    this.createObjects();
    this.renderLoop();

    this.socket = connect();
    this.socket.onmessage = ({ data }) => this.onMessageReceive(data);
  }

  componentWillUnmount() {
    this.socket = null;
    disconnect();
  }

  onMessageReceive = (data) => {
    const json = JSON.parse(data);
    const { type } = json;
    const { CLIENTS_DATA } = requestsTypes;

    if (type === CLIENTS_DATA) {
      this.bars.forEach((bar, index) => {
        bar.scale.setY(Math.max(json.data[index], 0.1) / 10);
      });
    }

    if (typeof window.navigator.vibrate === 'function') {
      window.navigator.vibrate(this.shouldVibrate(json.data) ? 100 : 0);
    }
  };

  shouldVibrate = data => sum(values(data)) / BARS_NUMBER >= VIBRATE_THRESHOLD;

  createObjects = () => {
    this.bars = range(0, BARS_NUMBER, 1).map(index => {
      const geometry = new BoxGeometry(1, 1, 1);
      const material = new MeshToonMaterial({ color: 0x2e7cd3 });
      const mesh = new Mesh(geometry, material);

      mesh.position.set((index - BARS_NUMBER / 2) * 2, 0, 0);
      return mesh;
    });

    this.bars.forEach(bar => this.scene.add(bar));
  };

  renderLoop = () => {
    requestAnimationFrame(this.renderLoop);
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div ref={(ref) => (this.visualisation = ref)} />;
  }
}
