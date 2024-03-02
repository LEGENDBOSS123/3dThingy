function setBoxGeometry(planeSize, size, map1, map2) {
    top.c = new THREE.PlaneGeometry(planeSize.width * size.x, planeSize.height * size.y, planeSize.width - 1, planeSize.height - 1);
    var pos = c.attributes.position;
    for (var i = 0; i < pos.count; i++) {
        var z = i * 3 + 2;
        var x = i%planeSize.width;
        var y = planeSize.height - 1 - Math.floor(i/planeSize.width);
        pos.array[z] = map1[y][x];
    }
    var c2 = new THREE.PlaneGeometry(planeSize.width * size.x, planeSize.height * size.y, planeSize.width - 1, planeSize.height - 1);
    var pos2 = c2.attributes.position;
    for (var i = 0; i < pos2.count; i++) {
        var z = i * 3 + 2;
        var x = i%planeSize.width;
        var y = planeSize.height - 1 - Math.floor(i/planeSize.width);
        pos2.array[z] = map2[y][x];
    }
    var c3 = new THREE.PlaneGeometry(planeSize.width * size.x, planeSize.height * size.y, planeSize.width-1, 1);
    var pos3 = c3.attributes.position;
    c3.translate(0,0,planeSize.height*size.y/2);
    for (var i = 0; i < pos3.count/2; i++) {
        var x = i * 3;
        var y = i * 3 + 1;
        var z = i * 3 + 2;
        var x1 = i%planeSize.width;
        var y1 = 0;
        pos3.array[y] = map1[y1][x1];
        pos3.array[y + pos3.count*3/2] = map2[y1][x1];
    }
    c3.rotateX(Math.PI/2);

    var c4 = new THREE.PlaneGeometry(planeSize.width * size.x, planeSize.height * size.y, planeSize.width-1, 1);
    var pos4 = c4.attributes.position;
    c4.translate(0,0,-planeSize.height*size.y/2);
    for (var i = 0; i < pos4.count/2; i++) {
        var x = i * 3;
        var y = i * 3 + 1;
        var z = i * 3 + 2;
        var x1 = i%planeSize.width;
        var y1 = planeSize.height-1;
        pos4.array[y] = map1[y1][x1];
        pos4.array[y + pos4.count*3/2] = map2[y1][x1];
    }
    c4.rotateX(Math.PI/2);

    var c5 = new THREE.PlaneGeometry(planeSize.width * size.x, planeSize.height * size.y, 1, planeSize.height-1);
    var pos5 = c5.attributes.position;
    c5.translate(0,0,planeSize.width*size.y/2);
    for (var e = 0; e < pos5.count; e++) {
        var i = e;
        var x = i * 3;
        
        var x1 = 0;
        var y1 = planeSize.height - 1 -Math.floor(i/2);
        if(i % 2 == 0){
            pos5.array[x] = map1[y1][x1];
        }
        else{
            pos5.array[x] = map2[y1][x1];
        }
    }
    c5.rotateY(-Math.PI/2);

    var c6 = new THREE.PlaneGeometry(planeSize.width * size.x, planeSize.height * size.y, 1, planeSize.height-1);
    var pos6 = c6.attributes.position;
    c6.translate(0,0,planeSize.width*size.y/2);
    for (var e = 0; e < pos6.count; e++) {
        var i = e;
        var x = i * 3;
        
        var x1 = planeSize.width - 1;
        var y1 = planeSize.height - 1 -Math.floor(i/2);
        if(i % 2 == 0){
            pos6.array[x] = -map1[y1][x1];
        }
        else{
            pos6.array[x] = -map2[y1][x1];
        }
    }
    c6.rotateY(Math.PI/2);FrontSide
    return [[c,THREE.FrontSide],[c2, THREE.BackSide],[c3,THREE.FrontSide],[c4,THREE.BackSide],[c5,THREE.BackSide],[c6,THREE.FrontSide]];
}


var lerp = function (a, b, c) {
    return a + c * (b - a);
}
var unlerp = function (a, b, c) {
    return (c - a) / (b - a);
}
var inbound = function (a, b, c) {
    return c >= a && c <= b;
}
var keysheld = {};

window.addEventListener('keydown', function (e) {
    keysheld[e.code] = true;
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
});
window.addEventListener('keyup', function (e) {
    keysheld[e.code] = false;
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
});

window.addEventListener('wheel', function (e) {
    if (!camera) {
        return;
    }
    camera.rotateOnAxis(new THREE.Vector3(1.0, 0.0, 0.0), e.deltaY / 100);
    camera.rotateOnWorldAxis(new THREE.Vector3(0.0, 0.0, 1.0), e.deltaX / 100);
});



var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 12000);
var angleX = 0;
var angleY = 0;

var heightmap = [];
var heightmap2 = [];

for (var y = 0; y < 100; y++) {
    var arr = [];
    for (var x = 0; x < 120; x++) {
        if (Math.abs(x - 50) + Math.abs(y - 50) < 30) {
            arr.push(0);
        }
        else {
            arr.push(100 * (Math.sin(x) + Math.sin(y) + x/6));
        }
    }
    heightmap.push(arr);
}
for (var y = 0; y < 100; y++) {
    var arr = [];
    for (var x = 0; x < 120; x++) {
        if (Math.abs(x - 50) + Math.abs(y - 50) < 30) {
            arr.push(-300);
        }
        else {
            arr.push(-300);
        }
    }
    heightmap2.push(arr);
}
//heightmap = [[100, 0, 0, 0, 0], [0, 0, 0, 0, 0],[0, 0, 30, 0, 0]];
//heightmap2 = [[-100, -50, -50, -50, -50], [-50, -50, -50, -50, -50],[-50, -50, -100, -50, -50]];

var planeSize = {
    width: heightmap[0].length,
    height: heightmap.length
};

function getValue(x, y, map) {
    if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
        return [false, 0];
    }
    return [true, map[y][x]];
}

function getHeight(x, y, map) {

    if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
        return 0;
    }
    var x1 = Math.floor(x);
    var x2 = x1 + 1;
    var y1 = Math.floor(y);
    var y2 = y1 + 1;
    var arr = [getValue(x1, y1, map), getValue(x2, y1, map), getValue(x1, y2, map), getValue(x2, y2, map)]
    for (var i = 0; i < arr.length; i++) {
        if (!arr[i][0]) {
            return 0;
        }
        else {
            arr[i] = arr[i][1];
        }
    }
    var v0;
    var v1;
    var v2;
    var point = { x: x, y: y };
    if (x - x1 - y + y1 < 0) {
        var v0 = { x: x2, y: y2, z: arr[3] };
        var v1 = { x: x1, y: y2, z: arr[2] };
        var v2 = { x: x1, y: y1, z: arr[0] };
    }
    else {
        var v0 = { x: x1, y: y1, z: arr[0] };
        var v1 = { x: x2, y: y2, z: arr[3] };
        var v2 = { x: x2, y: y1, z: arr[1] };
    }
    var u = ((v1.y - v2.y) * (point.x - v2.x) + (v2.x - v1.x) * (point.y - v2.y)) /
        ((v1.y - v2.y) * (v0.x - v2.x) + (v2.x - v1.x) * (v0.y - v2.y));
    var v = ((v2.y - v0.y) * (point.x - v2.x) + (v0.x - v2.x) * (point.y - v2.y)) /
        ((v1.y - v2.y) * (v0.x - v2.x) + (v2.x - v1.x) * (v0.y - v2.y));
    var w = 1 - u - v;
    var final_height = u * v0.z + v * v1.z + w * v2.z;
    return final_height;
}



size = { x: 100, y: 100 };

var c2 = setBoxGeometry(planeSize, size, heightmap, heightmap2);
var mesh = new THREE.Mesh();

for(var i of c2){
    i[0].computeVertexNormals();
    var m = new THREE.MeshPhongMaterial({ color: 0xFFFF00, transparent: true, opacity: 1, side: i[1], wireframe: false});
    mesh.add(new THREE.Mesh(i[0],m));
}
scene.add(mesh);
mesh.position.add(new THREE.Vector3(size.x * planeSize.width / 2, size.y * planeSize.height / 2));

var light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(0, 10, 5);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);

var light2 = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(light2);
camera.position.x = 0;
camera.position.y = 0;

var x = camera.position.x * (planeSize.width - 1) / (planeSize.width * size.x);
var y = camera.position.y * (planeSize.height - 1) / (planeSize.height * size.y);
var d = 0.1;
var h = 5 + Math.max(getHeight(x + d, y, heightmap), getHeight(x - d, y, heightmap), getHeight(x, y + d, heightmap), getHeight(x, y - d, heightmap));

camera.position.z = h;
camera.rotation.x = 1;

/*
for (var y = -100; y <= 600; y += 10) {
    for (var x = -100; x <= 600; x += 10) {
        var s1 = new THREE.SphereGeometry(1, 10, 10);
        var s2 = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        var s3 = new THREE.Mesh(s1, s2);
        s3.position.setX(x);
        s3.position.setY(y);
        var x1 = x * (planeSize.width - 1) / (planeSize.width * size.x);
        var y1 = y * (planeSize.height - 1) / (planeSize.height * size.y);
        var h = getHeight(x1, y1, heightmap);
        s3.position.setZ(h);
        scene.add(s3);
    }
}*/




var vel = new THREE.Vector3();
var onground = false;
var gravity = -0.1;
function render() {
    renderer.render(scene, camera);

    var speed = 5;
    var direction = camera.getWorldDirection((new THREE.Vector3()));
    direction.z = 0;
    direction.normalize();
    if (keysheld["ArrowUp"] || keysheld["KeyW"]) {
        camera.position.add(direction.multiplyScalar(speed));
    }
    if (keysheld["ArrowDown"] || keysheld["KeyS"]) {
        camera.position.add(direction.multiplyScalar(-speed));
    }
    if (keysheld["ArrowRight"] || keysheld["KeyD"]) {
        camera.translateOnAxis(new THREE.Vector3(1.0, 0.0, 0.0), speed);
    }
    if (keysheld["ArrowLeft"] || keysheld["KeyA"]) {
        camera.translateOnAxis(new THREE.Vector3(1.0, 0.0, 0.0), -speed);
    }
    if (keysheld["Space"]) {
        if (onground) {
        vel.z += 5;
        onground = false;
        }
    }
    if (keysheld["ShiftLeft"]) {
        //if (onground) {
        vel.z -= 5;
        onground = false;
        //}
    }

    var x = camera.position.x * (planeSize.width - 1) / (planeSize.width * size.x);
    var y = camera.position.y * (planeSize.height - 1) / (planeSize.height * size.y);
    var h = 5 + Math.max(getHeight(x + d, y, heightmap), getHeight(x - d, y, heightmap), getHeight(x, y + d, heightmap), getHeight(x, y - d, heightmap));
    vel.z += gravity;
    camera.position.add(vel);
    if (camera.position.z < h) {
        camera.position.z = h;
        onground = true;
        vel.z = 0;
    }
    else {
        onground = false;
    }
    requestAnimationFrame(render);
}
render();