
class Planet extends Entity
{
   // Construct planet
   constructor(camera, subdivision = 1, wireFrameMode = false)
   {
      super();

      this.GOLDEN_NUMBER = (1 + Math.sqrt(5)) / 2;
      this.camera = camera;
      this.subdivision = subdivision;
      this.wireFrameMode = wireFrameMode;
      this.seed = "SEED";
      this.size = 0;

      this.seaLevel = 1.0;
      this.wave = 0.0;
      this.angle = 0.0;

      this.initBuffers();
   }

   // Init buffers (vertices, colors, indices)
   initBuffers()
   {
      this.vertices = [];
      this.colors = [];
      this.indices = [];
      this.wireFrameIndices = [];

      this.verticesBuffer = null;
      this.colorsBuffer = null;
      this.indicesBuffer = null;
      this.indicesWireFrameBuffer = null;
   }

   // Create the geometry of the planet
   // To call inside initBuffer
   createGeometry()
   {
     this.simplexNoise = new SimplexNoise(this.seed);

      this.initBuffers();
      this.createIcosahedron();
      this.subdivideRecStart(this.subdivision);

      this.verticesBuffer = getVertexBufferWithVertices(this.vertices);
      this.colorsBuffer = getVertexBufferWithVertices(this.colors);
      this.indicesBuffer = getIndexBufferWithIndices(this.indices);
      this.indicesWireFrameBuffer = getIndexBufferWithIndices(this.wireFrameIndices);
   }

   // Setup parameters to shaders
   // To call inside initShaderParameters
   setupShader(prg)
   {
      this.prg = prg;

      prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
      glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
      prg.seaLevel = glContext.getUniformLocation(prg, "uSeaLevel");
      prg.wave = glContext.getUniformLocation(prg, "uWave");
   }

   // Render the planet
   // To call inside drawScene
   render()
   {
      let prg = this.prg;
      let wireFrameMode = this.wireFrameMode;

      this.angle += 0.03;
      this.wave = 0.5 + Math.sin(this.angle) * 0.5;

      glContext.useProgram(prg);
      glContext.bindBuffer(glContext.ARRAY_BUFFER, this.verticesBuffer);
      glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
      glContext.uniform1f(prg.seaLevel, this.seaLevel);
      glContext.uniform1f(prg.wave, this.wave);

      if(wireFrameMode)
      {
         this.renderAs(glContext.LINES, this.indicesWireFrameBuffer, this.wireFrameIndices.length);
      }
      else
      {
         this.renderAs(glContext.TRIANGLES, this.indicesBuffer, this.indices.length);
      }
   }

   // Render the planet in wireframe or triangles
   renderAs(mode, indicesBuffer, length)
   {
      let indices = this.indices;
      glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indicesBuffer);
      glContext.drawElements(mode, length, glContext.UNSIGNED_SHORT, 0);
   }

   // Create the icosahedron (basic shape for the sphere)
   createIcosahedron()
   {
      let vertices = this.vertices;
      let colors = this.colors;
      let indices = this.indices;
      let gn = this.GOLDEN_NUMBER;

      this.addVectorToArray(this.normalize([gn, -1.0, 0.0]));
      this.addVectorToArray(this.normalize([-gn, -1.0, 0.0]));
      this.addVectorToArray(this.normalize([-gn, 1.0, 0.0]));
      this.addVectorToArray(this.normalize([gn, 1.0, 0.0]));

      this.addVectorToArray(this.normalize([0.0, -gn, -1.0]));
      this.addVectorToArray(this.normalize([0.0, -gn, 1.0]));
      this.addVectorToArray(this.normalize([0.0, gn, 1.0]));
      this.addVectorToArray(this.normalize([0.0, gn, -1.0]));

      this.addVectorToArray(this.normalize([1.0, 0.0, -gn]));
      this.addVectorToArray(this.normalize([1.0, 0.0, gn]));
      this.addVectorToArray(this.normalize([-1.0, 0.0, gn]));
      this.addVectorToArray(this.normalize([-1.0, 0.0, -gn]));

      indices.push(0,8,3);
      indices.push(0,3,9);
      indices.push(1,2,11);
      indices.push(1,10,2);

      indices.push(2,6,7);
      indices.push(3,7,6);
      indices.push(4,0,5);
      indices.push(5,1,4);

      indices.push(4,11,8);
      indices.push(11,7,8);
      indices.push(9,6,10);
      indices.push(5,9,10);

      indices.push(9,3,6);
      indices.push(10,6,2);
      indices.push(5,0,9);
      indices.push(5,10,1);

      indices.push(11,2,7);
      indices.push(8,7,3);
      indices.push(4,1,11);
      indices.push(4,8,0);
   }

   // Start the recursive function for subdividing the icosahedron
   subdivideRecStart(depth)
   {
      let vertices = this.vertices;
      let copyIndices = copyArray(this.indices);
      let copyDepth = depth;
      let cameraVec = this.createVectorFromPositions(this.camera.getPosition(), this.getPosition());
      let cache = new Map();

      this.indices = [];

      // For each triangle, we subdivide if necessary
      for(let i = 0; i < copyIndices.length; i+=3)
      {
         let i1 = copyIndices[i];
         let i2 = copyIndices[i+1];
         let i3 = copyIndices[i+2];

         // Is a back face of the sphere ? No -> subdivide
         if(!this.checkCullBack(cameraVec, i1, i2, i3))
         {
            let length = this.checkClosest(cameraVec, i1, i2, i3);

            // Subdividision depend on distance between camera and the face
            if(length > 800)
            {
               depth -= 5;
            }
            else if(length > 500)
            {
               depth -= 4;
            }
            else if(length > 100)
            {
               depth -= 3;
            }
            else if(length > 50)
            {
               depth -= 2;
            }
            else
            {
               depth -= 1;
            }

            // Execute subdivision with custom depth for the face
            this.subdivideRec(depth, i1, i2, i3, cache);

            depth = copyDepth;
         }
      }
   }

   // Subdivide a triangle in smaller triangles
   subdivideRec(depth, i1, i2, i3, cache)
   {
      let indices = this.indices;
      let wireFrameIndices = this.wireFrameIndices;

      // Subdivide
      if(depth <= 0)
      {
         let i12 = this.getMidpointIndex(i1, i2, cache);
         let i23 = this.getMidpointIndex(i2, i3, cache);
         let i31 = this.getMidpointIndex(i3, i1, cache);

         // Indices for triangles
         indices.push(i1, i12, i31);
         indices.push(i2, i23, i12);
         indices.push(i3, i31, i23);
         indices.push(i12, i23, i31);

         // Indices for lines (Wireframe)
         wireFrameIndices.push(i1, i12, i12, i31, i31, i1);
         wireFrameIndices.push(i2, i23, i23, i12, i12, i2);
         wireFrameIndices.push(i3, i31, i31, i23, i23, i3);
         wireFrameIndices.push(i12, i23, i23, i31, i31, i12);
      }
      else
      {
         let i12 = this.getMidpointIndex(i1, i2, cache);
         let i23 = this.getMidpointIndex(i2, i3, cache);
         let i31 = this.getMidpointIndex(i3, i1, cache);

         this.subdivideRec(depth - 1, i1, i12, i31, cache);
         this.subdivideRec(depth - 1, i2, i23, i12, cache);
         this.subdivideRec(depth - 1, i3, i31, i23, cache);
         this.subdivideRec(depth - 1, i12, i23, i31, cache);
      }
   }

   // Print several debug info. about the mesh
   printDebugInfo()
   {
      console.log("Vertices : " + this.vertices.length);
      console.log("Indices : " + this.indices.length);
      console.log("Colors : " + this.colors.length);
   }

   // Define the height of the terrain with the simplex-noise
   defineHeight(vector)
   {
     let height = 0;
     let layer1Mul = this.layer1Mul;
     let layer1Div = this.layer1Div;
     let layer2Mul = this.layer2Mul;
     let layer2Div = this.layer2Div;

     height += (this.simplexNoise.noise3D(vector[0] * layer1Mul, vector[1] * layer1Mul, vector[2] * layer1Mul) / layer1Div) * 0.75;
     height += (this.simplexNoise.noise3D(vector[0] * layer2Mul, vector[1] * layer2Mul, vector[2] * layer2Mul) / layer2Div) * 0.25;

     return this.createVectorLength(copyArray(vector), height);
   }

   // Check if the triangle is in front of the camera or not
   checkCullBack(cameraVec, i1, i2, i3)
   {
      let v1 = vec3.fromValues(this.vertices[i1*3], this.vertices[i1*3+1], this.vertices[i1*3+2]);
      let v2 = vec3.fromValues(this.vertices[i2*3], this.vertices[i2*3+1], this.vertices[i2*3+2]);
      let v3 = vec3.fromValues(this.vertices[i3*3], this.vertices[i3*3+1], this.vertices[i3*3+2]);

      let tempVector = vec3.fromValues((v1[0] + v2[0] + v3[0])/3.0, (v1[1] + v2[1] + v3[1])/3.0, (v1[2] + v2[2] + v3[2])/3.0);
      let angle = radiansToDegrees(vec3.angle(cameraVec, tempVector));
      return !(angle > -90 && angle < 90);
   }

   // Get the distance between the camera and the triangle
   checkClosest(cameraVec, i1, i2, i3)
   {
      let v1 = vec3.fromValues(this.vertices[i1*3] * this.size, this.vertices[i1*3+1] * this.size, this.vertices[i1*3+2] * this.size);
      let v2 = vec3.fromValues(this.vertices[i2*3] * this.size, this.vertices[i2*3+1] * this.size, this.vertices[i2*3+2] * this.size);
      let v3 = vec3.fromValues(this.vertices[i3*3] * this.size, this.vertices[i3*3+1] * this.size, this.vertices[i3*3+2] * this.size);

      let tempVector = vec3.fromValues((v1[0] + v2[0] + v3[0])/3.0, (v1[1] + v2[1] + v3[1])/3.0, (v1[2] + v2[2] + v3[2])/3.0);
      //let diffVector = vec3.fromValues(cameraVec[0]-tempVector[0], cameraVec[1]-tempVector[1], cameraVec[2]-tempVector[2]);
      let diffVector = vec3.fromValues(tempVector[0]-cameraVec[0], tempVector[1]-cameraVec[1], tempVector[2]-cameraVec[2]);

      return vec3.length(diffVector);
   }

   // This method give the midpoint between the two vertices
   // If the vertices has been already created before, we take this one instead creating one more
   getMidpointIndex(index1, index2, cache)
   {
      let vertices = this.vertices;
      let colors = this.colors;
      let i12;

      // Create an unique key from index1 and index2
      let minIndex = Math.min(index1, index2);
      let maxIndex = Math.max(index1, index2);
      let key = maxIndex << 16 | minIndex;

      // Check if the midpoint has been already created
      // True : we reuse it
      // False : we create it and save it for future use
      if (cache.has(key))
      {
         i12 = cache.get(key);
      }
      else
      {
         let v1 = [vertices[index1*3], vertices[index1*3+1], vertices[index1*3+2]];
         let v2 = [vertices[index2*3], vertices[index2*3+1], vertices[index2*3+2]];
         let v12 = [(v1[0]+v2[0])/2, (v1[1]+v2[1])/2, (v1[2]+v2[2])/2];
         v12 = this.normalize(v12);

         i12 = vertices.length / 3;
         this.addVectorToArray(v12);
         cache.set(key, i12);
      }

      return i12;
   }

   // Define height and add the vector to array of vertices
   addVectorToArray(vector)
   {
      let vertices = this.vertices;
      let colors = this.colors;

      let heightVec = this.defineHeight(vector);

      vertices.push(vector[0] + heightVec[0]);
      vertices.push(vector[1] + heightVec[1]);
      vertices.push(vector[2] + heightVec[2]);
   }

   // Normalize vector
   normalize(vector)
   {
      //let magnitude = this.getMagnitude(vector);
      //return [vector[0]/magnitude, vector[1]/magnitude, vector[2]/magnitude];
      vec3.normalize(vector, vector);
      return vector;
   }

   // Get the length of the vector
   getMagnitude(vector)
   {
      return Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]+vector[2]*vector[2]);
   }

   // Create a vector from two points
   createVectorFromPositions(headVec3, queueVec3)
   {
      return vec3.fromValues(headVec3[0]-queueVec3[0], headVec3[1]-queueVec3[1], headVec3[2]-queueVec3[2]);
   }

   // Create a vector with a specified length
   createVectorLength(direction, length)
   {
     let vector = this.normalize(direction);
     vector[0] *= length;
     vector[1] *= length;
     vector[2] *= length;
     return vector;
   }

   // Get the height of the vertex
   getHeight(vertice)
   {
     let heightVector = this.createVectorFromPositions(vertice, super.getPosition());
     return vec3.length(heightVector);
   }

   // Set a new seed
   setSeed(seed)
   {
     if(seed == "")
     {
       seed = 0;
     }

     this.seed = seed;
   }

   // Set scale
   scale(size)
   {
     this.size = size;
     super.scale([size,size,size]);
   }

   // Set a new sea level
   setSeaLevel(seaLevel)
   {
     this.seaLevel = seaLevel;
   }

   // Set perlin noise parameters to create topography of the terrain
   setTopographyLayers(layer1Mul, layer1Div, layer2Mul, layer2Div)
   {
      this.layer1Mul = layer1Mul;
      this.layer1Div = layer1Div;
      this.layer2Mul = layer2Mul;
      this.layer2Div = layer2Div;
   }

   // Set the wireframe mode
   setWireframe(enable)
   {
     this.wireFrameMode = enable;
   }
}
