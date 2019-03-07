
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

      this.rotation = vec4.fromValues(0.0,0.0,0.0,1.0);
      this.position = vec4.fromValues(0.0,0.0,0.0,1.0);
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

   rotateY(angle)
   {
      this.rotation[1] += angle;
      this.update();
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
      return this.position;//vec3.fromValues(this.view[12], this.view[13], this.view[14]);
   }

   moveDirection(direction)
   {
      let rotMat = mat4.create();
      let forward = vec4.create();

      mat4.identity(rotMat);
      mat4.rotateY(rotMat, rotMat, this.rotation[1]);
      vec4.transformMat4(forward, direction, rotMat);
      vec3.add(this.position, this.position, forward);

      this.update();
   }

   moveForward(speed = 1)
   {
      this.moveDirection(vec4.fromValues(0.0,0.0, 1.0 * speed, 1.0));
   }

   moveBackward(speed = 1)
   {
      this.moveDirection(vec4.fromValues(0.0,0.0, -1.0 * speed, 1.0));
   }

   moveRight(speed = 1)
   {
      this.moveDirection(vec4.fromValues(-1.0 * speed,0.0,0.0,1.0));
   }

   moveLeft(speed = 1)
   {
      this.moveDirection(vec4.fromValues(1.0 * speed,0.0,0.0,1.0));
   }

   update()
   {
      let newView = mat4.create();
      mat4.identity(newView);
      mat4.rotateY(newView, newView, -this.rotation[1]);
      mat4.translate(newView, newView, this.position);
      this.view = newView;
   }
}
