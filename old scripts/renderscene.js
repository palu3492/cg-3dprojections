let view;
let ctx;
let scene;
const LEFT = 32;
const RIGHT = 16;
const BOT = 8;
const TOP  = 4;
const FRONT = 2;
const BACK = 1;

// Initialization function - called when web page loads
function Init() {
    let w = 800;
    let h = 600;
    view = document.getElementById('view');
    view.width = w;
    view.height = h;

    ctx = view.getContext('2d');

    // initial scene... feel free to change this
    
    scene = {
        view: {
            type: 'perspective',
            vrp: Vector3(20, 0, -30),
            vpn: Vector3(1, 0, 1),
            vup: Vector3(0, 1, 0),
            prp: Vector3(14, 20, 26),
            clip: [-1, 20, 5, 36, 1, -50]
        },
        models: [
            {
                type: 'generic',
                center: [15, 10, -45],
                vertices: [
                    Vector4( 0,  0, -30, 1),
                    Vector4(20,  0, -30, 1),
                    Vector4(20, 12, -30, 1),
                    Vector4(10, 20, -30, 1),
                    Vector4( 0, 12, -30, 1),
                    Vector4( 0,  0, -60, 1),
                    Vector4(20,  0, -60, 1),
                    Vector4(20, 12, -60, 1),
                    Vector4(10, 20, -60, 1),
                    Vector4( 0, 12, -60, 1)
                ],
                edges: [
                    [0, 1, 2, 3, 4, 0],
                    [5, 6, 7, 8, 9, 5],
                    [0, 5],
                    [1, 6],
                    [2, 7],
                    [3, 8],
                    [4, 9]
                ]
            }
        ]
    };

    // event handler for pressing arrow keys
    document.addEventListener('keydown', OnKeyDown, false);

    DrawScene();
}

// Main drawing code here! Use information contained in letiable `scene`
function DrawScene() {

    // Drawing the scene in our two different perspectives
    let perspective = mat4x4perspective(scene.view.vrp, scene.view.vpn, scene.view.vup, scene.view.prp, scene.view.clip);
    //let parallel = mat4x4parallel(scene.view.vrp, scene.view.vpn, scene.view.vup, scene.view.prp, scene.view.clip);
    //console.log(perspective);
    let i, j, k;
    let Mper = new Matrix(4,4);
    Mper.values =[
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, -1, 0]
    ]
    let transcale = new Matrix(4,4);
    transcale.values = [
        [view.width/2, 0,0,view.width/2],
        [0, view.height/2, 0, view.height/2],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]

    // 1. transform vertices in canonicalVV
    // 2. Clip against CVV
    // 3. Project onto 2D (Mper matrix)
    // 4. transcale to framebuffer size
    // 5. Draw all edges

    let clippedVertices = [], other = [];
    // For each model
    for(i = 0; i< scene.models.length; i++) {
        // step 1
        let tempVertices = [];
        //
        let model = scene.models[i];
        for(j = 0; j < model.vertices.length; j++) {
            tempVertices.push(Matrix.multiply(perspective, model.vertices[j]));
        }
        for(j = 0; j < model.edges.length; j++) {
            for(k = 0; k < model.edges[i].length-1; k++) {
                let vertex0 = tempVertices[model.edges[j][k]];
                let vertex1 = tempVertices[model.edges[j][k+1]];
                if(vertex0 !== undefined && vertex1 !== undefined) {
                    let clip = ClipLine(vertex0, vertex1, scene.view);
                    if(clip !== null){
                        let pt_0 = Vector4(clip.pt0.x,clip.pt0.y,clip.pt0.z,1);
                        let pt_1 = Vector4(clip.pt1.x,clip.pt1.y,clip.pt1.z,1);
                        clippedVertices.push( Matrix.multiply(transcale,Mper,pt_0) );
                        clippedVertices.push( Matrix.multiply(transcale,Mper,pt_1) );
                    }
                }
            }
        }

        for(j = 0; j < clippedVertices.length; j++) {
            // console.log(clippedVertices)
            let newMatrix = clippedVertices[j];
            let vx = newMatrix.x;
            let vy = newMatrix.y;
            let vz = newMatrix.z;
            let vw = newMatrix.w;
            let newVec = Vector4(vx/vw, vy/vw, vz/vw, vw/vw);
            other.push(newVec)
        }
        console.log(other);
        for(j = 0; j < other.length; j+=2) {
            DrawLine(other[j].x/100, other[j].y/100, other[j+1].x/100, other[j+1].y/100);
        }


        // let top = [];
        // // 2. Clip against CVV
        // for(j = 0; j < scene.models[i].edges.length; j++) {
        //     let moreVertices = [];
        //     for(k = 0; k < scene.models[i].edges[i].length-1; k++) {
        //
        //         let a = scene.models[i].edges[j][k];
        //         let b = scene.models[i].edges[j][k+1];
        //
        //         let v0 = new Vector(tempVertices[a]);
        //         let v1 = new Vector(tempVertices[b]);
        //         // console.log(v0);
        //         let e = ClipLine(v0, v1, scene.view);
        //         // console.log(e);
        //         if(e.pt0.x !== undefined && e.pt0.y !== undefined && e.pt0.z !== undefined && e.pt0.w !== undefined
        //         && e.pt1.x !== undefined && e.pt1.y !== undefined && e.pt1.z !== undefined && e.pt1.w !== undefined){
        //             let pt_0 = Vector4(e.pt0.x,e.pt0.y,e.pt0.z,e.pt0.w);
        //             let pt_1= Vector4(e.pt1.x,e.pt1.y,e.pt1.z,e.pt1.w);
        //             v0 = Matrix.multiply(transcale,Mper,pt_0);
        //             v1 = Matrix.multiply(transcale,Mper,pt_1);
        //             console.log(pt_1);
        //         }
        //         // console.log(v0);
        //         moreVertices.push(v0);
        //         moreVertices.push(v1);
        //
        //     }
        //     top.push(moreVertices);
        // }
        // let pv = [];
        // for(j = 0; j < top.length; j++) {
        //     for(k = 0; k < top.length; k++) {
        //         let x = top[i][j].values[0][0]/top[i][j].values[3][0];
        //         let y = top[i][j].values[1][0]/top[i][j].values[3][0];
        //         let z = top[i][j].values[2][0]/top[i][j].values[3][0];
        //         let w = top[i][j].values[3][0]/top[i][j].values[3][0];
        //         // console.log(top[i][j].values);
        //         let vec = Vector4(x, y, z, w);
        //         if(vec !== undefined) {
        //             pv.push(vec);
        //         }
        //     }
        // }
        //
        // for(j = 0; j < pv.length-1; i+=2) {
        //     let x1 = pv[i].x;
        //     let y1 = pv[i].y;
        //     let x2 = pv[i+1].x;
        //     let y2 = pv[i+1].y;
        //     DrawLine(x1,y1,x2,y2);
        // }

        // // 3. and 4.
        // for(j = 0; j < tempVertices.length; j++) {
        //     tempVertices[j] = Matrix.multiply( /*transcale,*/ Mper, moreVertices[j]);
        // }
        // 5. 
        // for (j = 0; j < scene.models[i].edges.length; j++) {
        //     let curEdge = scene.models[i].edges[j];
        //     for (k = 0; k < curEdge.length-1; k++) {
        //         let curpt1 = tempVertices[curEdge[k]];
        //         let curpt2 = tempVertices[curEdge[k+1]];
        //         DrawLine(curpt1.x/curpt1.w, curpt1.y/curpt1.w, curpt2.x/curpt2.w, curpt2.y/curpt2.w);
        //     }
        // }
    }
} // DrawScene

function DrawThings() {
    
}
function GetOutCode(pt, view) {
    let outcode = 0;
    if(pt.x < view.x_min) {
        outcode += LEFT;
    } else if(pt.x > view.x_max) {
        outcode += RIGHT;
    }
    if(pt.y < view.y_min) {
        outcode += BOT;
    } else if(pt.y > view.y_max){
        outcode += TOP;
    }
    if(pt.z < view.z_min) {
        outcode += BACK;
    } else if(pt.z > view.z_max) {
        outcode += FRONT;
    }
    return outcode;
} // GetOutCode

function ClipLine(pt0, pt1, view) {
    let result = {
        pt0: {},
        pt1: {}
    };
    let outcode0 = GetOutCode(pt0, view);
    let outcode1 = GetOutCode(pt1, view);
    let delta_x = pt1.x - pt0.x;
    let delta_y = pt1.y - pt0.y;
    let delta_z = pt1.z - pt0.z;
    let b = pt0.y - ((delta_y / delta_x) * pt0.x);

    let done = false;
    while(!done) {
        if((outcode0 | outcode1) === 0) { // Trivial accept
            done = true;
            result.pt0.x = pt0.x;
            result.pt0.y = pt0.y;
            result.pt0.z = pt0.z;
            result.pt1.x = pt1.x;
            result.pt1.y = pt1.y;
            result.pt1.z = pt1.z;
        } else if ((outcode0 & outcode1) !== 0) { //Trivial reject 
            done = true;
            result = null;
        } else {
            let selected_pt; // we pick a point that is outside the view
            let selected_outcode;
            if(outcode0 > 0) {
                select_pt = pt0;
                selected_outcode = outcode0;
            } else {
                select_pt = pt1;
                selected_outcode = outcode1;
            }
            if((selected_outcode & LEFT) === LEFT) {
                selected_pt.x = view.x_min;
                selected_pt.y = (delta_y / delta_x) * selected_outcode.x + b;
            } else if((selected_outcode & RIGHT) === RIGHT) {
                selected_pt.x = view.x_max;
                selected_pt.y = (delta_y / delta_x) * selected_outcode.x + b;
            } else if((selected_outcode & BOT) === BOT) {
                selected_pt.y = view.y_min;
                selected_pt.x = (selected_pt.y -b) * (delta_x / delta_y);
            } else if((selected_outcode & TOP) === TOP){ // we know it's the top
                selected_pt.y = view.y_max;
                selected_pt.x = (selected_pt.y -b) * (delta_x / delta_y);
            } else if((selected_outcode & FRONT) === FRONT) {
                selected_pt.z = view.z_max;
                selected_pt.x = (selected_pt.y -b) * (delta_x / delta_y);
                selected_pt.y = (delta_y / delta_x) * selected_outcode.x + b;
            } else { // we know it's gonna be BACK
                selected_pt.z = view.z_min;
                selected_pt.x = (selected_pt.y -b) * (delta_x / delta_y);
                selected_pt.y = (delta_y / delta_x) * selected_outcode.x + b;
            }
            if(outcode0 > 0) {
                outcode0 = selected_outcode;
            } else {
                outcode1 = selected_outcode;
            }
        }
    }
    return result;
} // ClipLine

// Called when user selects a new scene JSON file
function LoadNewScene() {
    let scene_file = document.getElementById('scene_file');

    console.log(scene_file.files[0]);

    let reader = new FileReader();
    reader.onload = (event) => {
        scene = JSON.parse(event.target.result);
        scene.view.vrp = Vector3(scene.view.vrp[0], scene.view.vrp[1], scene.view.vrp[2]);
        scene.view.vpn = Vector3(scene.view.vpn[0], scene.view.vpn[1], scene.view.vpn[2]);
        scene.view.vup = Vector3(scene.view.vup[0], scene.view.vup[1], scene.view.vup[2]);
        scene.view.prp = Vector3(scene.view.prp[0], scene.view.prp[1], scene.view.prp[2]);

        for (let i = 0; i < scene.models.length; i++) {
            if (scene.models[i].type === 'generic') {
                for (let j = 0; j < scene.models[i].vertices.length; j++) {
                    scene.models[i].vertices[j] = Vector4(scene.models[i].vertices[j][0],
                                                          scene.models[i].vertices[j][1],
                                                          scene.models[i].vertices[j][2],
                                                          1);
                }
            }
            else {
                scene.models[i].center = Vector4(scene.models[i].center[0],
                                                 scene.models[i].center[1],
                                                 scene.models[i].center[2],
                                                 1);
            }
        }

        DrawScene();
    };
    reader.readAsText(scene_file.files[0], "UTF-8");
}

// Called when user presses a key on the keyboard down 
function OnKeyDown(event) {
    let i;
    switch (event.keyCode) {
        case 37: // LEFT Arrow
            for(i =0; i < tempVertices.length; i++) {
                let newX = tempVertices[i].data[0][0] + 0.001;
                tempVertices[i].data[0][0] = newX;
            }

            console.log("left");
            break;
        case 38: // UP Arrow
            for(i =0; i < tempVertices.length; i++) {
                let newZ = tempVertices[i].data[2][0];
                
            }
            console.log("up");
            break;
        case 39: // RIGHT Arrow
            for(i =0; i < tempVertices.length; i++) {
                let curX = tempVertices[i].data[0][0];
            }
            console.log("right");
            break;
        case 40: // DOWN Arrow
            for(i =0; i < tempVertices.length; i++) {
                let curX = tempVertices[i].data[2][0];
            }
            console.log("down");
            break;
    }
}

// Draw black 2D line with red endpoints 
function DrawLine(x1, y1, x2, y2) {
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x1 - 2, y1 - 2, 4, 4);
    ctx.fillRect(x2 - 2, y2 - 2, 4, 4);
}
