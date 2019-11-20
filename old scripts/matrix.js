class Matrix {
    constructor(r, c) {
        this.rows = r;
        this.columns = c;
        this.data = [];
        let i, j;
        for (i = 0; i < this.rows; i++) {
            this.data.push([]);
            for (j = 0; j < this.columns; j++) {
                this.data[i].push(0);
            }
        }
    }

    set values(v) {
        let i, j, idx;
        // v is already a 2d array with dims equal to rows and columns
        if (v instanceof Array && v.length === this.rows && 
            v[0] instanceof Array && v[0].length === this.columns) {
            this.data = v;
        }
        // v is a flat array with length equal to rows * columns
        else if (v instanceof Array && typeof v[0] === 'number' &&
                 v.length === this.rows * this.columns) {
            idx = 0;
            for (i = 0; i < this.rows; i++) {
                for (j = 0; j < this.columns; j++) {
                    this.data[i][j] = v[idx];
                    idx++;
                }
            }
        }
        // not valid
        else {
            console.log("could not set values for " + this.rows + "x" + this.columns + " maxtrix");
        }
    }

    get values() {
        return this.data.slice();
    }

    // matrix multiplication (this * rhs)
    mult(rhs) {
        let result = null;
        let i, j, k, vals, sum;
        // ensure multiplication is valid
        if (rhs instanceof Matrix && this.columns === rhs.rows) {
            result = new Matrix(this.rows, rhs.columns);
            vals = result.values;
            for (i = 0; i < result.rows; i++) {
                for (j = 0; j < result.columns; j++) {
                    sum = 0;
                    for (k = 0; k < this.columns; k++) {
                        sum += this.data[i][k] * rhs.data[k][j]
                    }
                    vals[i][j] = sum;
                }
            }
            result.values = vals;
        }
        else {
            console.log("could not multiply - row/column mismatch");
        }
        return result;
    }
}

Matrix.multiply = function(...args) {
    let i;
    let result = null;
    // ensure at least 2 matrices
    if (args.length >= 2 && args.every((item) => {return item instanceof Matrix;})) {
        result = args[0];
        i = 1;
        while (result !== null && i < args.length) {
            result = result.mult(args[i]);
            i++;
        }
        if (args[args.length - 1] instanceof Vector) {
            result = new Vector(result);
        }
    }
    else {
        console.log("could not multiply - requires at least 2 matrices");
    }
    return result;
}


class Vector extends Matrix {
    constructor(n) {
        let i;
        if (n instanceof Matrix) {
            super(n.rows, 1);
            for (i = 0; i < this.rows; i++) {
                this.data[i][0] = n.data[i][0];
            }
        }
        else {
            super(n, 1);
        }
    }

    get x() {
        let result = null;
        if (this.rows > 0) {
            result = this.data[0][0];
        }
        return result;
    }

    get y() {
        let result = null;
        if (this.rows > 1) {
            result = this.data[1][0];
        }
        return result;
    }

    get z() {
        let result = null;
        if (this.rows > 2) {
            result = this.data[2][0];
        }
        return result;
    }

    get w() {
        let result = null;
        if (this.rows > 3) {
            result = this.data[3][0];
        }
        return result;
    }

    set x(val) {
        if (this.rows > 0) {
            this.data[0][0] = val;
        }
    }

    set y(val) {
        if (this.rows > 0) {
            this.data[1][0] = val;
        }
    }

    set z(val) {
        if (this.rows > 0) {
            this.data[2][0] = val;
        }
    }

    set w(val) {
        if (this.rows > 0) {
            this.data[3][0] = val;
        }
    }

    magnitude() {
        let i;
        let sum = 0;
        for (i = 0; i < this.rows; i++) {
            sum += this.data[i][0] * this.data[i][0];
        }
        return Math.sqrt(sum);
    }

    normalize() {
        let i;
        let mag = this.magnitude();
        for (i = 0; i < this.rows; i++) {
            this.data[i][0] /= mag;
        }
    }

    scale(s) {
        let i;
        for (i = 0; i < this.rows; i++) {
            this.data[i][0] *= s;
        }
    }

    add(rhs) {
        let i;
        let result = null;
        if (rhs instanceof Vector && this.rows === rhs.rows) {
            result = new Vector(this.rows);
            for (i = 0; i < this.rows; i++) {
                result.data[i][0] = this.data[i][0] + rhs.data[i][0];
            }
        }
        return result;
    }

    subtract(rhs) {
        let i;
        let result = null;
        if (rhs instanceof Vector && this.rows === rhs.rows) {
            result = new Vector(this.rows);
            for (i = 0; i < this.rows; i++) {
                result.data[i][0] = this.data[i][0] - rhs.data[i][0];
            }
        }
        return result;
    }

    dot(rhs) {
        let i;
        let sum = 0;
        if (rhs instanceof Vector && this.rows === rhs.rows) {
            for (i = 0; i < this.rows; i++) {
                sum += this.data[i][0] * rhs.data[i][0];
            }
        }
        return sum;
    }

    cross(rhs) {
        let result = null;
        if (rhs instanceof Vector && this.rows === 3 && rhs.rows === 3) {
            result = new Vector(3);
            result.values = [this.data[1][0] * rhs.data[2][0] - this.data[2][0] * rhs.data[1][0],
                             this.data[2][0] * rhs.data[0][0] - this.data[0][0] * rhs.data[2][0],
                             this.data[0][0] * rhs.data[1][0] - this.data[1][0] * rhs.data[0][0]]
        }
        return result;
    }
}



function mat4x4identity() {
    let result = new Matrix(4, 4);
    result.data[0][0] = 1;
    result.data[1][1] = 1;
    result.data[2][2] = 1;
    result.data[3][3] = 1;
    return result;
}

function mat4x4translate(tx, ty, tz) {
    let result = new Matrix(4, 4);
    result.data[0][0] = 1;
    result.data[0][3] = tx;
    result.data[1][1] = 1;
    result.data[1][3] = ty;
    result.data[2][2] = 1;
    result.data[2][3] = tz;
    result.data[3][3] = 1;
    return result;
}

function mat4x4scale(sx, sy, sz) {
    let result = new Matrix(4, 4);
    result.data[0][0] = 1;
    result.data[0][3] = sx;
    result.data[1][1] = 1;
    result.data[1][3] = sy;
    result.data[2][2] = 1;
    result.data[2][3] = sz;
    result.data[3][3] = 1;
    return result;
}

function mat4x4rotatex(theta) {
    let result = new Matrix(4, 4);
    result.data[0][0] = 1;
    result.data[1][1] = Math.cos(theta);
    result.data[1][2] = (-1) * (Math.sin(theta));
    result.data[2][1] = Math.sin(theta);
    result.data[2][2] = Math.cos(theta);
    result.data[3][3] = 1;
    return result;
}

function mat4x4rotatey(theta) {
    let result = new Matrix(4, 4);
    result.data[0][0] = Math.cos(theta);
    result.data[0][2] = Math.sin(theta);
    result.data[1][1] = 1;
    result.data[2][0] = (-1) * (Math.sin(theta));
    result.data[2][2] = Math.cos(theta);
    result.data[3][3] = 1;
    return result;
}

function mat4x4rotatez(theta) {
    let result = new Matrix(4, 4);
    result.data[0][0] = Math.cos(theta);
    result.data[0][1] = (-1) * (Math.sin(theta));
    result.data[1][0] = Math.sin(theta);
    result.data[1][1] = Math.cos(theta);
    result.data[2][2] = 1;
    result.data[3][3] = 1;
    return result;
}

function mat4x4shearxy(shx, shy) {
    let result = new Matrix(4, 4);
    result.data[0][0] = 1;
    result.data[0][2] = shx;
    result.data[1][1] = 1;
    result.data[1][2] = shy;
    result.data[2][2] = 1;
    result.data[3][3] = 1;
    
    return result;
}

function mat4x4rotatevrp(u1,u2,u3,v1,v2,v3,n1,n2,n3) {
    let result = new Matrix(4,4);
    result.data[0][0] = u1;
    result.data[0][1] = u2;
    result.data[0][2] = u3;
    result.data[1][0] = v1;
    result.data[1][1] = v2;
    result.data[1][2] = v3;
    result.data[2][0] = n1;
    result.data[2][1] = n2;
    result.data[2][2] = n3;
    result.data[3][3] = 1;
    return result;
}

function mat4x4scaleperspective(sperx, spery, sperz) {
    let result = new Matrix(4,4);
    result.data[0][0] = sperx;
    result.data[1][1] = spery;
    result.data[2][2] = sperz;
    result.data[3][3] = 1;
    return result;
}

function mat4x4scareparallel(sparx, spary, sparz) {
    let result = mat4x4identity();
    result.data[0][0] = sparx;
    result.data[1][1] = spary;
    result.data[2][2] = sparz;
    return result;
}
function mat4x4cwfront(cwx, cwy, front) {
    let result = mat4x4identity();
    result.data[0][3] = cwx;
    result.data[1][3] = cwy;
    result.data[2][3] = front;
    return result;
}

function mat4x4parallel(vrp, vpn, vup, prp, clip) {
    // 1. translate VRP to the origin
    // 2. rotate VRC such that n-axis (VPN) becomes the z-axis, 
    //    u-axis becomes the x-axis, and v-axis becomes the y-axis
    // 3. shear such that the DOP becomes parallel to the z-axis
    // 4. translate and scale into canonical view volume
    //    (x = [-1,1], y = [-1,1], z = [0,-1])

    // 1.
    let Tvrp = mat4x4translate(-vrp.x, -vrp.y, -vrp.z);
    // 2.
    let n_axis = Vector3(vpn.x, vpn.y, vpn.z);
    n_axis.normalize();
    let u_axis = vup.cross(n_axis);
    u_axis.normalize()
    let v_axis = n_axis.cross(u_axis);
    u_axis.x
    let rotateVRC = new Matrix(4,4);
    rotateVRC.values = [[u_axis.x, u_axis.y, u_axis.z,0],[v_axis.x, v_axis.y, v_axis.z, 0],[n_axis.x, n_axis.y, n_axis.z, 0],[0,0,0,1]]
    // 3.
    let Tprp = mat4x4translate(-prp.x, -prp.y, -prp.z);
    // 4.
    let DOP_x = ((clip[0] + clip[1])/2); // center of window on the X
    let DOP_y = ((clip[2] + clip[3])/2); // center of window on the Y
    const Z = 0; // the Z is usually 0
    let CW = Vector3(DOP_x, DOP_y, Z); // center of window Vector
    let DOP = CW.subtract(prp); // From class slides DOP = CW - PRP
    let shxpar = (-DOP.x) / DOP.z;
    let shypar = (-DOP.y) / DOP.z;
    let SHEARxy = mat4x4shearxy(shxpar, shypar);



}

function mat4x4perspective(vrp, vpn, vup, prp, clip) {
    // console.log('--')
    // console.log(vrp);
    // console.log(vpn)
    vpn.x = 0.7071067811865476;
    vpn.y = 0;
    vpn.z = 0.7071067811865476;
    //     [0.7071067811865476]
    // 1: [0]
    // 2: [0.7071067811865476]
    // vpn = -20;
    clip = [-20, 20, -4, 36, 1, -50];
    // 1. translate VRP to the origin
    // 2. rotate VRC such that n-axis (VPN) becomes the z-axis, 
    //    u-axis becomes the x-axis, and v-axis becomes the y-axis
    // 3. translate PRP to the origin
    // 4. shear such that the center line of the view volume becomes the z-axis
    // 5. scale into canonical view volume (truncated pyramid)
    //    (x = [z,-z], y = [z,-z], z = [-z_min,-1])
    
    // 1.
    // translate VRP to the origin
    let Tvrp = new Matrix(4,4);
    Tvrp.values = [
        [1, 0, 0, -vrp.x],
        [0, 1, 0, -vrp.y],
        [0, 0, 1, -vrp.z],
        [0, 0, 0, 1]
    ];
    // 2.
    // n-axis(VPN) becomes the z-axis, u-axis becomes the x-axis, and v-axis becomes the y-axis
    let n_axis = new Vector3(vpn.x, vpn.y, vpn.z);
    n_axis.normalize();
    let u_axis = vup.cross(n_axis);
    u_axis.normalize();
    let v_axis = n_axis.cross(u_axis);
    let rotateVRC = new Matrix(4,4);
    rotateVRC.values = [
        [u_axis.x, u_axis.y, u_axis.z, 0],
        [v_axis.x, v_axis.y, v_axis.z, 0],
        [n_axis.x, n_axis.y, n_axis.z, 0],
        [0, 0, 0, 1]
    ];
    // 3.
    // translate PRP to the origin
    let Tprp = new Matrix(4,4);
    Tprp.values = [
        [1, 0, 0, -prp.x],
        [0, 1, 0, -prp.y],
        [0, 0, 1, -prp.z],
        [0, 0, 0, 1]
    ];
    // 4.
    // shear such that the center line of the view volume becomes the z-axis
    let DOP_x = (clip[0] + clip[1])/2; // center of window on the X
    let DOP_y = (clip[2] + clip[3])/2; // center of window on the Y
    let DOP_z = 0 - prp.z;

    DOP_x -= prp.x;
    DOP_y -= prp.y;


    let shxpar = (-DOP_x) / DOP_z;
    let shypar = (-DOP_y) / DOP_z;
    let SHEARxy = new Matrix(4,4);
    SHEARxy.values = [
        [1, 0, shxpar, 0],
        [0, 1, shypar, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    // 5.
    // scale into canonical view volume (truncated pyramid) (x = [z,-z], y = [z,-z], z = [-z_min,-1])
    let VRP_prime = -prp.z;
    // console.log(clip);
    let scale_pers_x = ((2 * VRP_prime) / ((clip[1] - clip[0]) * (VRP_prime + clip[5])));
    let scale_pers_y = ((2 * VRP_prime) / ((clip[3] - clip[2]) * (VRP_prime + clip[5])));
    let scale_pers_z = (-1 / (VRP_prime + clip[5]));
    let Spers = new Matrix(4,4);
    Spers.values = [
        [scale_pers_x, 0, 0, 0],
        [0, scale_pers_y, 0, 0],
        [0, 0, 0, scale_pers_z],
        [0, 0, 0, 1]
    ];


    // let vrppz  = -prp.z;
    // //console.log(vrppz)
    // let sperx = ((2*vrppz) / ((clip[1] - clip[0])*(-prp.z + clip[5])));
    // let spery = ((2*vrppz) /((clip[3] - clip[2])*(-prp.z + clip[5])));
    // let sperz = (-1 / (vrppz + clip[5]));
    // let sper = new Matrix(4,4);
    // sper.values = [[sperx, 0, 0, 0], [0, spery, 0, 0], [0 , 0, sperz, 0], [0, 0, 0, 1]];

    console.log(Spers)
    //
    // console.log(Spers);
    // console.log(SHEARxy);
    //console.log(Tprp);
    //console.log(rotateVRC);
    //console.log(Tvrp);
    let Nper = Matrix.multiply(Spers, SHEARxy, Tprp, rotateVRC, Tvrp);
    // console.log(Nper);
    return Nper
}

function mat4x4mper() {
    // perspective projection from canonical view volume to far clip plane
    let result = new Matrix(4, 4);
    
    return result;
}

function Vector3(x, y, z) {
    let result = new Vector(3);
    result.values = [x, y, z];
    return result;
}

function Vector4(x, y, z, w) {
    let result = new Vector(4);
    result.values = [x, y, z, w];
    return result;
}
