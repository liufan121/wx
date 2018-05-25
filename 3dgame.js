import * as THREE from './three/three.js';
import './three/STLLoader.js';
import TWEEN from './three/tween.min.js';
import Physijs  from './three/three.physi.js';
var setp = 1.5,StartX=0,EndX=0,postK=0;
var id;
var collidableMeshList=[];
var crash = false;
//圆环
var geometry = new THREE.TorusGeometry(20, 1.5, 8, 100);
var material = new THREE.MeshBasicMaterial({ color: 0x363636 });
//球体
export default class game3d {
  constructor() {
    Physijs.scripts.worker = 'workers/request/physijs_worker.js';
    //场景
    this.scene = new Physijs.Scene();
    //相机
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(0, 50, 0);
    this.camera.lookAt(this.scene.position);
    //渲染
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias:true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 1);
    this.start();
    this.StartX = StartX;
    this.EndX=EndX;
    this.NowX=0;
    //绑定事件
    window.addEventListener("touchstart", this.onTouchStar.bind(this));
    window.addEventListener("touchmove", this.onTouchMove.bind(this));
    window.addEventListener("touchend", this.onTouchEnd.bind(this));
    //碰撞元素
  }
  start() {
    //创建辅助线
    var axisHelper = new THREE.AxesHelper(6);
    this.scene.add(axisHelper);
    //创建背景
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.gemoRauid();
    //创建色块
    this.sk = new THREE.Group();
    this.sk.rotation.y=20;
    this.scene.add(this.sk);
    this.colorMetor();
    //创建球体
    this.sphere = new THREE.Group();
    this.scene.add(this.sphere);
    this.SphereMetor();
    this.gemoAimate();
  }
  createGeome(i) {
    var torus = new THREE.Mesh(geometry, material);
    torus.position.set(0, -i * 20, 0);
    torus.rotation.x = Math.PI / 2;
    this.group.add(torus);
  }
  gemoRauid() {
    //创建圆环
    for (var i = 0; i < 6; i++) {
      this.createGeome(i);
    }
    collidableMeshList.push(this.group.children[0]);
  }
  colorMetor() {
    for (var i = -1; i < 5; i++) {
      this.createColorMetor(i);
    }
  }
  SphereMetor(){
    for(var i=0;i<5;i++){
      this.createSphere(i);
    }
  }
  createSphere(i){
    var loaderText = new THREE.TextureLoader().load('images/metal.jpg');
    var geometry = new THREE.SphereGeometry(2, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00, map: loaderText});
    var sphere = new THREE.Mesh(geometry, material);
    sphere.scale.set(0.6+i*0.1,0.6+i*0.1,0.6+i*0.1);
    sphere.position.set(0,10+i*1.6,8+i*1.6);
    this.sphere.add(sphere);
  }
  createColorMetor(i) {
    var axis = new THREE.Vector3(0, 0, 1);//向量axis
    var skBut = new THREE.Group();
    var geometry = new THREE.TorusGeometry(15, 3, 8, 100, Math.PI / 4.2);
    var materialbit = new THREE.MeshDepthMaterial();
    var material1 = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, blending: THREE.NormalBlending, transparent: true });
    var texture, material2, torus;
    for (var j = 0; j < 8; j++) {
      // texture = this.makeTextSprite(Math.round(Math.random() * 10));
      // material2 = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture, blending: THREE.NormalBlending, transparent: true });
      torus = new THREE.SceneUtils.createMultiMaterialObject(geometry, [material1,  materialbit]);
      //material2.map.offset = new THREE.Vector2(-0.4, 0.21);
      torus.position.set(0, -30, 0);
      torus.rotation.x = Math.PI / 2;
      torus.rotateOnAxis(axis, Math.PI * 2 * j / 8);
      skBut.add(torus);
    }
    skBut.position.set(0, -i * 65, 0);
    this.sk.add(skBut);
  }
  numberText(){
    
  }
  makeTextSprite(message, parameters) {
    //创建canvas字体
    if (parameters === undefined) parameters = {};
    var fontface = "Aria";
    var fontsize = 150;
    var borderThickness = 4;
    var textColor = { r: 251, g: 255, b: 255 };
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = fontsize + "px " + fontface;
    var metrics = context.measureText(message);
    var textWidth = metrics.width;
    context.fillStyle = "#ffffff";
    context.scale(0.5, 0.5);
    context.fillText(message, borderThickness, fontsize + borderThickness);
    var texture = new THREE.Texture(canvas)
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }
  onTouchStar(event){
    this.startX = event.changedTouches[0].pageX;
    this.EndX = this.startX;
  }
  onTouchMove(event){
    this.EndX = event.changedTouches[0].pageX;
    var distanceX = this.EndX - this.startX;
    this.sperPost(distanceX);
    this.startX = this.EndX;
  }
  sperPost(distanceX){
    this.sphere.rotation.y += (distanceX * Math.PI * 2 / window.innerWidth) * 0.4;
  }
  onTouchEnd(){
    this.startX = this.EndX=0;
  }
  intersect(){
    //碰撞检测
    var MovingCube = this.sphere.children[0];
    var originPoint = MovingCube.position.clone();
    for (var vertexIndex = 0; vertexIndex < MovingCube.geometry.vertices.length; vertexIndex++) {
      var localVertex = MovingCube.geometry.vertices[vertexIndex].clone();
      var globalVertex = localVertex.applyMatrix4(MovingCube.matrix);
      var directionVector = globalVertex.sub(MovingCube.position);

      var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
      var collisionResults = ray.intersectObjects(collidableMeshList);
      if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length())
        console.log(" Hit ");
    }
  }
  createSpricle() {
    // var geo = new THREE.Geometry();
    // var material = new THREE.ParticleBasicMaterial({ size: 2, vertexColors: true, color: 0xffffff });
    // for (var x = -5; x < 5; x++) {
    //   for (var y = -5; y < 5; y++) {
    //     //为每一个粒子创建一个顶点，并添加到一个几何体中
    //     var particle = new THREE.Vector3(x * 2, y * 2, 0);
    //     geo.vertices.push(particle);
    //     geo.colors.push(new THREE.Color(Math.random() * 0x00ffff));
    //   }
    // }

    // var system = new THREE.ParticleSystem(geo, material);
    // this.scene.add(system);
  }
  gemoAimate() {
    // if (this.sk.children[0].position.y > this.sphere.children[0].position.y){
    //   this.render();
    //   TWEEN.update();
    //   this.intersect();
    //   id = window.requestAnimationFrame(this.gemoAimate.bind(this));
    // }
    // else{
    //   window.cancelAnimationFrame(id);
    // }
    this.render();
    //this.intersect();
    id = window.requestAnimationFrame(this.gemoAimate.bind(this));
    
  }
  render(){
    var gropChildre = this.group.children;
    for (var i = 0; i < gropChildre.length; i++) {
      gropChildre[i].position.y += setp;
    }
    if (gropChildre[0].position.y > 7) {
      this.group.remove(gropChildre[0]);
      this.createGeome(6);
    }
    var sk = this.sk.children;
    for (var i = 0; i < sk.length; i++) {
      sk[i].position.y += setp;
    }
    if (sk[0].position.y >0) {
      sk[0].children[0].visible=false;
    }
    if (sk[0].position.y > 65) {
      this.sk.remove(sk[0]);
      this.createColorMetor(5);
    }
    var sphere = this.sphere.children;
    for (var i = 0; i < sphere.length;i++){
      sphere[i].rotateX(0.1);
    }
    THREE.Cache.clear();
    this.renderer.render(this.scene, this.camera);
  }
}