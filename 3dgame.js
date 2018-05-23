import * as THREE from './three/three.js';
import './three/STLLoader.js';
export default class game3d {
    constructor() {
      //场景
      this.scene=new THREE.Scene();
      //相机
      this.camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,1000);
      this.camera.position.x=10;
      this.camera.position.y = 10;
      this.camera.position.z=500; 
      //渲染
      this.renderer = new THREE.WebGLRenderer({ canvas:canvas});
      this.renderer.setClearColor(0xffffff, 1);
      this.start();
    }
    start(){
      var axisHelper = new THREE.AxisHelper(6);
      this.scene.add(axisHelper);
      //创建模型
      var loader = new THREE.JSONLoader();
      var url ='http://www.yanglaohky.cn/images/sekuai.js';
      loader.load(url, (geometry)=>{
        var matArray = [];
        matArray.push(new THREE.MeshBasicMaterial({ color: 0x009e60 }));
        matArray.push(new THREE.MeshBasicMaterial({ color: 0x0051ba }));
        matArray.push(new THREE.MeshBasicMaterial({ color: 0xffd500 }));
        matArray.push(new THREE.MeshBasicMaterial({ color: 0xff5800 }));
        matArray.push(new THREE.MeshBasicMaterial({ color: 0xc41e3a }));
        matArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff })); 
        var material = new THREE.MeshFaceMaterial();
        var mesh = new THREE.Mesh(geometry, matArray);
        mesh.position.set(0,0,0);
        this.scene.add(mesh);
        this.animate();
      })
      var group = new THREE.Group();
      
    }
    makeTextSprite(message, parameters) {
      //创建canvas字体
        if (parameters === undefined) parameters = {};
            var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Aria";
            var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
            var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
            var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : { r: 0, g: 0, b: 0, a: 1.0 };

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            context.font =fontsize + "px " + fontface;
            var metrics = context.measureText(message);
            var textWidth = metrics.width;
            context.lineWidth = borderThickness;
            context.fillStyle = "rgb(" + textColor.r + ", " + textColor.g + ", " + textColor.b+")";
            context.fillText(message, borderThickness, fontsize + borderThickness);
            var texture = new THREE.Texture(canvas)
            texture.needsUpdate = true;

            var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false });
            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(0.25 * fontsize, 0.45 * fontsize, 0.25 * fontsize);
            return sprite;
    }
    animate(){
      this.renderer.render(this.scene, this.camera);
    }
}

