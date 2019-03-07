
class Terrain extends Entity
{
    constructor(squares = 2, size = 1, height = 5)
    {
        super();

        this.squares = squares;
        this.size = size;
        this.height = height;

        this.initBuffers();
    }

    initBuffers()
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
        this.initBuffers();

        let vertices = this.vertices;
        let colors = this.colors;
        let indices = this.indices;

        // Create flat terrain
        let offset = this.squares * this.size * (-0.5);
        let y = -0.5;
        for(let row = 0;row <= this.squares;row++)
        {
            let z = offset + row * this.size - 3;
            for(let column = 0;column <= this.squares; column++)
            {
                let x = offset + column * this.size;
                vertices.push(x, y, z);
                colors.push(0.0,0.5,0.0,1.0);

                if(row < this.squares && column < this.squares)
                {
                    let index = row * (this.squares + 1) + column;
                    indices.push(index, index + 1, index + this.squares + 1);
                    indices.push(index + 1, index + this.squares + 1 + 1, index + this.squares + 1);
                }
            }
        }

        this.executeDiamondSquareAlgo();

        this.verticesBuffer = getVertexBufferWithVertices(vertices);
        this.colorsBuffer = getVertexBufferWithVertices(colors);
        this.indicesBuffer = getIndexBufferWithIndices(indices);
    }

    executeDiamondSquareAlgo()
    {
        let vertices = this.vertices;

        // Init. the corners
        let topLeftY = 1;
        let botLeftY = (this.squares + 1) * 3 * this.squares + 1;
        vertices[topLeftY] = random(-this.height, this.height);
        vertices[topLeftY + (this.squares * 3)] = random(-this.height, this.height);
        vertices[botLeftY]= random(-this.height, this.height);
        vertices[botLeftY + (this.squares) * 3] = random(-this.height, this.height);
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

        glContext.useProgram(prg);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.verticesBuffer);
        glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorsBuffer);
        glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        glContext.drawElements(glContext.TRIANGLES, indices.length, glContext.UNSIGNED_SHORT, 0);
    }
}
