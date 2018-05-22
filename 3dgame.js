import * as THREE from './three/three.js';
import  './three/OrbitControls.js';
import './three/STLLoader.js';
export default class game3d {
    constructor() {
      //场景
      this.scene=new THREE.Scene();
      //相机
      this.camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
      this.renderer=new THREE.WebGLRenderer({
        canvas:canvas
      });
      this.renderer.setSize(window.innerWidth,window.innerHeight);
      this.start();
      this.renderer.setClearColor(0xAAFFCC);
    }
    start() {
      //生成一个坐标轴，辅助线
      var axes = new THREE.AxisHelper(20);
      this.scene.add(axes);
      //球体
      var sphereGeometry = new THREE.SphereGeometry(4, 30, 30);
      var texture = new THREE.TextureLoader().load("images/metal.jpg");  
      var sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
      this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      this.sphere.position.x =0;
      this.sphere.position.y =0;
      this.sphere.position.z = 0;
      this.scene.add(this.sphere);

      //圆台
      //this.wen();
      //点光
      // var spotLight = new THREE.PointLight('#0e71a4');
      //   spotLight.position.set(-10, 90, 35);
      //   spotLight.castShadow = true;
      //this.scene.add(spotLight);
      this.camera.position.x = 0;
      this.camera.position.y = 30;
      this.camera.position.z = 100;
      this.camera.lookAt(this.scene.position);
      this.animate();
      var loader = new THREE.JSONLoader();
      loader.load("images/lr.json", (geometry)=>{
        var material = new THREE.MeshBasicMaterial({
          wireframe: true,
          color: 'red'
        });
        var torus = new THREE.Mesh(geometry, material);
        this.scene.add(torus);
      })
    }
    wen(){
      var axis = new THREE.Vector3(0, 0, 1);//向量axis
      for(var i=0;i<8;i++){
        var geometry = new THREE.TorusGeometry(20,3,5,10,Math.PI*1/4.5);
        var material = new THREE.MeshBasicMaterial({ 
          wireframe:true,
          color:'red'
        });
        var torus = new THREE.Mesh(geometry, material);
        torus.rotateOnAxis(axis, Math.PI*i/ 4);//绕axis轴旋转π/8
        //点光
        this.scene.add(torus);
      }
    }
    animate(){
      this.sphere.rotation.x -= 0.1;
      this.renderer.clear();  
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.animate.bind(this));
      
    }

}

