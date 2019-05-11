
class Camera
{
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

      this.distance = 250.0;
      this.angle = 0.0;
      this.rotate(0.0, 1.0);
   }

   createGeometry()
   {
      // Nothing
   }

   setupShader(prg)
   {
      prg.pMatrixUniform = glContext.getUniformLocation(prg, 'uPMatrix');
      prg.mvMatrixUniform = glContext.getUniformLocation(prg, 'uMVMatrix');
   }

   getView()
   {
      return this.view;
   }

   getProjection()
   {
      return this.projection;
   }

   getPosition()
   {
      return this.position;
   }

   moveForward(speed = 1.0, deltaTime)
   {
      this.distance -= speed * deltaTime;
   }

   moveBackward(speed = 1.0, deltaTime)
   {
      this.distance += speed * deltaTime;
   }

   rotate(angle, deltaTime)
   {
     // console.log(angle);
     // console.log(deltaTime);
     // console.log(this.angle);
     this.angle += angle * deltaTime;
   }

   update()
   {
      this.position = vec3.fromValues(this.distance * Math.cos(this.angle), 0.0, this.distance * Math.sin(this.angle));

      let newView = mat4.create();
      mat4.identity(newView);
      mat4.lookAt(newView, this.position, vec3.fromValues(0.0,0.0,0.0), vec3.fromValues(0.0,1.0,0.0));
      this.view = newView;
   }
}
