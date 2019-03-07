// Exemple de classe pour un triangle simple

class SimpleTriangle
{
   constructor()
   {
      this.vertices = [];
      this.colors = [];
      this.indices = [];
      this.verticesBuffer = null;
      this.colorsBuffer = null;
      this.indicesBuffer = null;
   }

   // To call inside initBuffer
   createGeometry()
   {
      let vertices = this.vertices;
      let colors = this.colors;
      let indices = this.indices;

      vertices.push(-1.0,-1.0,-3.0);
      vertices.push(1.0,-1.0,-3.0);
      vertices.push(0.0,1.0,-3.0);
      colors.push(1.0,0.0,0.0,1.0);
      colors.push(0.0,1.0,0.0,1.0);
      colors.push(0.0,0.0,1.0,1.0);
      indices.push(0,1,2);

      this.verticesBuffer = getVertexBufferWithVertices(vertices);
      this.colorsBuffer  = getVertexBufferWithVertices(colors);
      this.indicesBuffer  = getIndexBufferWithIndices(indices);
   }

   getVerticesBuffer()
   {
      return this.verticesBuffer;
   }

   getColorsBuffer()
   {
      return this.colorsBuffer;
   }

   getIndicesBuffer()
   {
      return this.indicesBuffer;
   }

   // To call inside initShaderParameters
   setupShader(prg)
   {
      this.prg = prg;

      prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
      glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
      prg.colorAttribute = glContext.getAttribLocation(prg, "aVertexColor");
      glContext.enableVertexAttribArray(prg.colorAttribute);
   }

   // To draw inside drawScene
   render()
   {
      let prg = this.prg;
      let indices = this.indices;

      //glContext.useProgram(prg);
      glContext.bindBuffer(glContext.ARRAY_BUFFER, this.verticesBuffer);
      glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
      glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorsBuffer);
      glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
      glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
      glContext.drawElements(glContext.TRIANGLES, indices.length, glContext.UNSIGNED_SHORT,0);
   }
}
