import * as THREE from './three/three.js';
import './three/STLLoader.js';
var setp=0.8;
export default class game3d {
    constructor() {
      //场景
      this.scene=new THREE.Scene();
      //相机
      this.camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,1000);
      this.camera.position.set(0,50,0);
      this.camera.lookAt(this.scene.position); 
      //渲染
      this.renderer = new THREE.WebGLRenderer({ canvas:canvas});
      this.renderer.setClearColor(0x000000, 1);
      this.start();
      //定义基数值
    }
    start(){
      //创建辅助线
      var axisHelper = new THREE.AxesHelper(6);
      this.scene.add(axisHelper);
      //创建背景
      this.group = new THREE.Group();
      this.scene.add(this.group);
      this.gemoRauid();
      //创建色块
      this.sk = new THREE.Group();
      this.scene.add(this.sk);
      this.colorMetor();
      this.gemoAimate();
    }
    createGeome(i){
      var geometry = new THREE.TorusGeometry(20, 1, 8, 100);
      var material = new THREE.MeshBasicMaterial({ color: 0x363636 });
      var torus = new THREE.Mesh(geometry, material);
      torus.position.set(0,-i*20,0);
      torus.rotation.x = Math.PI / 2;
      this.group.add(torus);
    }
    gemoRauid(){
      //创建圆环
      for(var i=0;i<9;i++){
        this.createGeome(i);
      }
    }
    colorMetor(){
      for (var i = -1; i < 5; i++) {
        this.createColorMetor(i);
      }
    }
    createColorMetor(i) {
      var axis = new THREE.Vector3(0,0,1);//向量axis
      var skBut=new THREE.Group();
      for(var j=0;j<8;j++){
        var geometry = new THREE.TorusGeometry(15, 2, 8, 100,Math.PI/4.5);
        var texture = this.makeTextSprite(Math.round(Math.random()*10), {
          fontsize: 150,
          textColor: { r: 255, g: 255, b: 255 }
        });
        var materialbit = new THREE.MeshDepthMaterial();
        var material1 = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, blending: THREE.NormalBlending, transparent: true});
        var material2 = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture, blending: THREE.NormalBlending, transparent: true });
        var torus = new THREE.SceneUtils.createMultiMaterialObject(geometry, [material1, material2,  materialbit]);
        material2.map.offset = new THREE.Vector2(-0.4, 0.21);
        torus.position.set(0, -30, 0);
        torus.rotation.x = Math.PI / 2;
        torus.rotateOnAxis(axis, Math.PI*2*j/ 8);
        skBut.add(torus);
      }
      skBut.position.set(0, -i * 65, 0);
      this.sk.add(skBut);
    }
    makeTextSprite(message, parameters) {
      //创建canvas字体
        if (parameters === undefined) parameters = {};
            var fontface = "Aria";
            var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
            var borderThickness = 4;
            var textColor ={ r: 0, g: 0, b: 0, a: 1.0 };
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            context.font =fontsize + "px " + fontface;
            var metrics = context.measureText(message);
            var textWidth = metrics.width;
            context.fillStyle = "rgb(" + textColor.r + ", " + textColor.g + ", " + textColor.b+")";
            context.scale(0.5,0.5);
            context.fillText(message, borderThickness, fontsize + borderThickness);
            var texture = new THREE.Texture(canvas)
            texture.minFilter = THREE.LinearFilter;
            //texture.needsUpdate = true;
            return texture;
    }
    createSpricle(){
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
      // this.dpvie();
    }
    gemoAimate(){
      var gropChildre = this.group.children;
      for (var i = 0; i < gropChildre.length;i++){
        gropChildre[i].position.y += setp;
        if (gropChildre[i].position.y>7){
          this.group.remove(gropChildre[i]);
          this.createGeome(9);
        }
      }
      var sk = this.sk.children;
      for (var i = 0; i < sk.length; i++) {
        sk[i].position.y += setp;
        if (sk[i].position.y > 65) {
          this.sk.remove(sk[i]);
          this.createColorMetor(5);
        }
      }
      this.renderer.render(this.scene, this.camera);
      window.requestAnimationFrame(this.gemoAimate.bind(this));
    }
}

