let THREE = require('./js/libs/three.min')

export default class Game3d {
  constructor() {
    // 场景  
    this.scene = new THREE.Scene();
    // 透视摄像头  
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // webGL渲染器  
    // 同时指定canvas为小游戏暴露出来的canvas  
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas
    });
    this.start()
  }
  start() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    var geometry = new THREE.CubeGeometry(1, 1, 1);
    // 加载纹理贴图  
    var texture = new THREE.TextureLoader().load("./images/metal.jpg");
    var material = new THREE.MeshBasicMaterial({ map: texture });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    // 设置camera的高度，若是低于当前场景的高度则屁也看不到  
    this.camera.position.z = 2.5;
    this.cube.castShadow = true
    console.log(this.cube)
    window.requestAnimationFrame(this.loop.bind(this), canvas);
  }
  update() {
    this.cube.rotation.x += 0.02;
    this.cube.rotation.y += 0.04;
    this.cube.rotation.z += 0.06;
  }
  loop() {
    this.update()
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.loop.bind(this), canvas);
  }
}  