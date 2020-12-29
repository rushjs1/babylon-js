var canvas = document.getElementById("renderCanvas");

var engine = new BABYLON.Engine(canvas,true);


var scene, cam, ball, light, timeoutID ;
var tower = BABYLON.AbstractMesh;
var towerArray;

scene = createScene();

engine.runRenderLoop(function(){
    scene.render();
});
scene.registerBeforeRender(function(){
    if (ball.intersectsMesh(tower, true)){
        console.log("goal");  
    }
})





function createScene(){
    var scene = new BABYLON.Scene(engine);

     cam = new BABYLON.UniversalCamera("uniCam", new BABYLON.Vector3(0,0,-10), scene);

     //cam.setTarget(BABYLON.Vector3.Zero());

     cam.attachControl(canvas, true);

      light = new BABYLON.HemisphericLight("light1",new BABYLON.Vector3(0,2,0), scene);

      //enable physics
      var gravityVector = BABYLON.Vector3(0,-9.81, 0);
      var physicsPlugin = new BABYLON.CannonJSPlugin();

      scene.enablePhysics(gravityVector, physicsPlugin);



      var skybox = BABYLON.Mesh.CreateBox("skybox",5000.0, scene);

      var skyboxMaterial = new BABYLON.StandardMaterial("skybox",scene);

      skyboxMaterial.backFaceCulling = false;

      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("//www.babylonjs.com/assets/skybox/skybox", scene);
      skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new BABYLON.Color3(0,0,0);
      skyboxMaterial.specularColor = new BABYLON.Color3(0,0,0);
      skyboxMaterial.disableLighting = true;
      skybox.material = skyboxMaterial;


        //ball
        ball = new BABYLON.MeshBuilder.CreateSphere("dpher", {diameter: 1 }, scene);
        ball.PhysicsImpostor = new BABYLON.PhysicsImpostor(
            ball, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 1, restitution: 0.0},
            scene
        )

        ball.tag = "ball";



      //ground
      var ground = BABYLON.MeshBuilder.CreateGround("ground",{height: 20, width: 20, subdivisions: 4}, scene);

      ground.position.y = -3;
      ground.position.z = 8;
      ground.PhysicsImpostor = new BABYLON.PhysicsImpostor(
          ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: .9}, scene
      );

      //ground and ball texture
      var groundMaterial = new BABYLON.StandardMaterial("base", scene);
      groundMaterial.diffuseTexture = new BABYLON.Texture("../img/grass.jpg", scene);

        ground.material = groundMaterial;

        var ballMaterial = new BABYLON.StandardMaterial("base",scene);
        ballMaterial.diffuseTexture = new BABYLON.Texture("../img/fire.jpg",scene);

        ball.material = ballMaterial;



        //declar in global scope so we can have an array to push the callback with 
        var sword = BABYLON.AbstractMesh;
        var swordArray;

       sword = BABYLON.SceneLoader.ImportMesh("","../assets/", "sword_scimitar.gltf", scene, function(newMeshes){
          //
        swordArray = newMeshes[0];
        swordArray.position.z = 10;
        swordArray.position.y = -2;
      })
//palm
        var palm = BABYLON.AbstractMesh;
        var palmArray;

     palm = BABYLON.SceneLoader.ImportMesh("", "../assets/", "palm_detailed_long.gltf", scene, function(newMeshes){
          //do something
          palmArray = newMeshes[0];
          palmArray.position.z = 20;
          palmArray.position.y = -3.3;
          })

          //tower
         

       

          tower = BABYLON.SceneLoader.ImportMesh("","../assets/", "tower.gltf", scene, function(newMesh){
              towerArray = newMesh[0];
              towerArray.position.z = 16;
              towerArray.position.y = -3.3;
              towerArray.position.x = Math.random() * 8 - 4;
             towerArray.PhysicsImpostor = new BABYLON.PhysicsImpostor(
            towerArray, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.5}, scene);
               
            towerArray.showBoundingBox = true;
          })
          
          ball.showBoundingBox = true;

      
        


      return scene;
}








function resetBall(){
    ball.position = new BABYLON.Vector3();
    //reset Velocity 
    ball.PhysicsImpostor.setLinearVelocity(new BABYLON.Vector3());
    ball.PhysicsImpostor.setAngularVelocity(new BABYLON.Vector3());

    clearInterval(timeoutID);
    moveTower();

}

 function moveTower(){
    towerArray.position.x = Math.random() * 8 - 4;
}
 

window.addEventListener("click", function(){
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
     var selectedObject = pickResult.pickedMesh;

     if(selectedObject){
         if(selectedObject.tag = "ball"){
            var surfaceNormal = pickResult.getNormal(true);
            var forceDirection = surfaceNormal.scale(-1000);
            selectedObject.PhysicsImpostor.applyForce(
                forceDirection, selectedObject.getAbsolutePosition());
                timeoutID = setTimeout(resetBall, 3000);

         }
     }

})

