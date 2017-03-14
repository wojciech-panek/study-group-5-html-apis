import React, {Component} from 'react';
import {Scene, PerspectiveCamera, WebGLRenderer, Color,
  SphereGeometry, MeshToonMaterial, Mesh, PointLight} from 'three';

export default class Slave extends Component {
  constructor(props) {
    super(props);
    this.renderLoop = this.renderLoop.bind(this);
  }

  componentDidMount() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    this.renderer = new WebGLRenderer({antialias: true});

    let dpr = 1;
    if (window.devicePixelRatio) {
      dpr = window.devicePixelRatio;
    }

    this.renderer.setPixelRatio(dpr);
    this.scene.background = new Color(0xffffff);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.set(0, 0, 3);

    this.light = new PointLight(0xffffff, 1, 100);
    this.light.position.set(-5, 5, 10);
    this.scene.add(this.light);

    this.refs.visualisation.appendChild(this.renderer.domElement);

    this.createObjects();
    this.renderLoop();
  }

  renderLoop() {
    requestAnimationFrame(this.renderLoop);
    this.updateObjects();
    this.renderer.render(this.scene, this.camera);
  }

  createObjects() {
    const geometry = new SphereGeometry(1, 25, 25);
    const material = new MeshToonMaterial({color: 0x2e7cd3});

    this.sphere = new Mesh(geometry, material);
    this.scene.add(this.sphere);
  }

  updateObjects() {
    this.sphere.scale
      .set(1, 1, 1)
      .multiplyScalar(Math.abs(Math.sin(Date.now() / 200)) * 0.5 + 0.5);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div ref='visualisation' />;
  }
}
