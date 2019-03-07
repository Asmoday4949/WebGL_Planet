class Entity
{
   constructor(translationVec3 = vec3.fromValues(0.0, 0.0, 0.0),
   rotationVec3 = vec3.fromValues(0.0, 0.0, 0.0),
   scaleVec3 = vec3.fromValues(0.0, 0.0, 0.0))
   {
      this.model = mat4.create();
      //this.updateModel(translationVec3, rotationVec3, scaleVec3);
   }

   updateModel(translationVec3, rotationVec3, scaleVec3)
   {
      mat4.identity(this.model);
      this.scale(translationVec3);
      this.rotateY(scaleVec3[1]);
      this.translate(rotationVec3);
      console.log(this.model);
   }

   translate(translationVec3)
   {
      mat4.translate(this.model, this.model, translationVec3);
   }

   scale(scaleVec3)
   {
      mat4.scale(this.model, this.model, scaleVec3);
   }

   rotateY(angle)
   {
      mat4.rotateY(this.model, this.model, angle);
   }

   getModel()
   {
      return this.model;
   }

   getPosition()
   {
      return vec3.fromValues(this.model[12], this.model[13], this.model[14]);
   }

   createGeometry()
   {
      // Must be specialized in the child
   }

   setupShader(prg)
   {
      // Must be specialized in the child
   }

   render()
   {
      // Must be specialized in the child
   }
}
