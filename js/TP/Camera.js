
class Camera
{
   // Construct camera
   constructor(width, height, near = 0.1, far = 1000.0, fieldOfView = 60.0)
   {
      this.width = width;
      this.height = height;

      this.near = near;
      this.far = far;
      this.fieldOfView = fieldOfView;

      this.view = mat4.create();
      this.projection = mat4.create();

      mat4.identity(this.view);
      mat4.identity(this.projection);
      mat4.perspective(this.projection, degToRad(fieldOfView), width / height, near, far);

      this.distance = 235.0;
      this.angle = 0.0;
      this.rotate(0.0, 1.0);
   }

   // Create geometry, do nothing (special case)
   createGeometry()
   {
      // Nothing
   }

   // Setup matrix to shader
   setupShader(prg)
   {
      prg.pMatrixUniform = glContext.getUniformLocation(prg, 'uPMatrix');
      prg.mvMatrixUniform = glContext.getUniformLocation(prg, 'uMVMatrix');
   }

   // Get the view matrix
   getView()
   {
      return this.view;
   }

   // Get the projection matrix
   getProjection()
   {
      return this.projection;
   }

   // Get the current position of the camera
   getPosition()
   {
      return this.position;
   }

   // Move the camera forward
   moveForward(speed = 1.0, deltaTime)
   {
      this.distance -= speed * deltaTime;
   }

   // Move the camera backward
   moveBackward(speed = 1.0, deltaTime)
   {
      this.distance += speed * deltaTime;
   }

   // Rotate the camera
   rotate(angle, deltaTime)
   {
     // console.log(angle);
     // console.log(deltaTime);
     // console.log(this.angle);
     this.angle += angle * deltaTime;
   }

   // Update position and angle of the camera
   update()
   {
      this.position = vec3.fromValues(this.distance * Math.cos(this.angle), 0.0, this.distance * Math.sin(this.angle));

      let newView = mat4.create();
      mat4.identity(newView);
      mat4.lookAt(newView, this.position, vec3.fromValues(0.0,0.0,0.0), vec3.fromValues(0.0,1.0,0.0));
      this.view = newView;
   }
}
