import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CubeGeometry, Scene, PointLight, PerspectiveCamera, Vector3, BoxBufferGeometry, MeshBasicMaterial, Mesh, WebGLRenderer, PCFSoftShadowMap, Color, DoubleSide, Vector2, Geometry, Face3 } from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  scene: Scene;

  camera: PerspectiveCamera;

  renderer: WebGLRenderer;

  cubes: Array<Mesh>;

  colors: Array<Color>;

  @ViewChild('canvas') private canvasRef: ElementRef;

  constructor() {
    this.render = this.render.bind(this);
    this.cubes = new Array();
    this.colorsPalette();
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  ngOnInit() {
    this.scene = new Scene();

    this.loadCubes();

    //this.createMeshInSquares();
    
    this.createCamera();

    this.createLights();

    

    this.startRendering();
  }

  private createCamera() {
    this.camera = new PerspectiveCamera(55.0, window.innerWidth / window.innerHeight, 0.5, 300000);
    this.camera.position.set(45, 35, 45);
    this.camera.lookAt(new Vector3());
  }

  private createLights() {
    var light = new PointLight(0xffffff, 1, 1000);
    light.position.set(0, 1000, 1000);
    this.scene.add(light);

    var light = new PointLight(0xffffff, 1, 1000);
    light.position.set(0, 1000, -1000);
    this.scene.add(light);
  }

  private loadCubes() {
    let color = 0;
    for(let x = 0; x < 10; x++) {
      this.createCube(Math.random()*10, Math.random()*100-50, Math.random()*100-50, Math.random()*100-50, color);
      color++;
      if(color > 2) {
        color = 0;
      }
    }
  }

  moveCubes() {
    for(let x = 0; x < 10; x++) {
      this.cubes[x].rotateX((Math.random()-0.5)/10);
      this.cubes[x].rotateY((Math.random()-0.5)/10);
      this.cubes[x].rotateZ((Math.random()-0.5)/10);
    }
  }

  private createCube(size, translateX, translateY, translateZ, color) {
    let geometry = new BoxBufferGeometry(size, size, size, 1, 1, 1);
    let material = new MeshBasicMaterial({
      color: this.colors[color],
      side: DoubleSide});
    let cube = new Mesh(geometry, material);
    cube.rotation.x = Math.PI / 2;
    cube.translateX(translateX);
    cube.translateY(translateY);
    cube.translateZ(translateZ);
    this.scene.add(cube);
    this.cubes.push(cube);
  }

  private createSquare(x,y,z) {
    let squareGeometry = new Geometry();
    squareGeometry.vertices.push(new Vector3(10*x, 0.0, 10*z)); 
    squareGeometry.vertices.push(new Vector3(10*(x+1), 0.0, 10*z)); 
    squareGeometry.vertices.push(new Vector3(10*(x+1), 0.0, 10*(z-1))); 
    squareGeometry.vertices.push(new Vector3(10*x, 0.0, 10*(z-1)));
    squareGeometry.faces.push(new Face3(0, 1, 2)); 
    squareGeometry.faces.push(new Face3(0, 3, 2));
    squareGeometry.faceVertexUvs[ 0 ].push( [
        new Vector2( 0, 0 ),
        new Vector2( 0, 1 ),
        new Vector2( 1, 1 ),
        new Vector2( 1, 0 )
    ] );

    let material = new MeshBasicMaterial({
        color: new Color(0xff0000),
        side: DoubleSide, 
        wireframe: true});
    let mesh = new Mesh( squareGeometry, material );
    this.scene.add(mesh);
  }

  private createMeshInSquares() {
      
      for(let x= -10; x < 10; x++) {
          for(let z= 10; z > -10; z--) {
              this.createSquare(x,0,z);
          }
      }
  }

  private colorsPalette() {
    this.colors = new Array();
    this.colors.push(new Color(0, 255, 255));
    this.colors.push(new Color(255, 0, 230));
    this.colors.push(new Color(205, 255, 0));
  }

  public render() {
    console.log("render");

    this.moveCubes();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render)

  }

  private startRendering() {    
    this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.autoClear = true;

    this.render();
  }

  public onMouseMove(event: MouseEvent) {
    console.log("onMouse");
  }

  public onMouseDown(event: MouseEvent) {
      console.log("onMouseDown");
      event.preventDefault();
  }

  public onMouseUp(event: MouseEvent) {
      console.log("onMouseUp");
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event) {
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
      console.log("onResize: " + this.canvas.clientWidth + ", " + this.canvas.clientHeight);

      this.camera.aspect = this.getAspectRatio();
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  @HostListener('document:keypress', ['$event'])
  public onKeyPress(event: KeyboardEvent) {
      console.log("onKeyPress: " + event.key);
  }

  private getAspectRatio(): number {
    let height = this.canvas.clientHeight;
    if (height === 0) {
        return 0;
    }
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

}
