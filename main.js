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

for (var y = 0; y < 500; y++) {
    var arr = [];
    for (var x = 0; x < 500; x++) {
        if(Math.abs(x-250) + Math.abs(y-250)<30){
            arr.push(0);
        }
        else{
            arr.push(100*(Math.sin(x) + Math.sin(y)));
        }
    }
    heightmap.push(arr);
}

var planeSize = {
    width: heightmap[0].length,
    height: heightmap.length
};

function getHeight(x, y, map) {
    var w = map[0].length;
    var h = map.length;
    var x1 = Math.floor(x);
    var x2 = x1 + 1;
    var y1 = Math.floor(y);
    var y2 = y1 + 1;
    if (!inbound(0, w - 1, x1) || !inbound(0, w - 1, x2) || !inbound(0, h - 1, y1) || !inbound(0, h - 1, y2)) {
        return 0;
    }
    var lerp1 = lerp(map[y1][x1], map[y1][x2], x - x1);
    var lerp2 = lerp(map[y2][x1], map[y2][x2], x - x1);
    var final_height = lerp(lerp1, lerp2, y - y1);

    return final_height;
}



size = { x: 80, y: 80 };

var c = new THREE.PlaneGeometry(planeSize.width * size.x, planeSize.height * size.y, planeSize.width - 1, planeSize.height - 1);

var pos = c.attributes.position;
var flat_map = heightmap.flat();
for (var i = 0; i < pos.count; i++) {
    var x = i * 3;
    var y = i * 3 + 1;
    var z = i * 3 + 2;
    pos.array[z] = flat_map[i];
}
c.computeVertexNormals();

var m = new THREE.MeshPhongMaterial({ color: 0xFFFF00 });
var mesh = new THREE.Mesh(c, m);
scene.add(mesh);
var light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(0, 10, 5);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);

var light2 = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(light2);
var x = camera.position.x / size.x + planeSize.width / 2 - 0.5;
var y = -camera.position.y / size.y + planeSize.height / 2 - 0.5;
var d = 0.1;
var h = 5 + Math.max(getHeight(x + d, y, heightmap), getHeight(x - d, y, heightmap), getHeight(x, y + d, heightmap), getHeight(x, y - d, heightmap));

camera.position.z = h;
camera.rotation.x = 1;







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
            vel.z += 8;
            onground = false;
        }
    }

    var x = camera.position.x / size.x + planeSize.width / 2 - 0.5;
    var y = -camera.position.y / size.y + planeSize.height / 2 - 0.5;
    var h = 20 + Math.max(getHeight(x + d, y, heightmap), getHeight(x - d, y, heightmap), getHeight(x, y + d, heightmap), getHeight(x, y - d, heightmap));
    vel.z += gravity;
    camera.position.add(vel);
    if (camera.position.z < h) {
        camera.position.z = h;
        onground = true;
        if (vel.z != 0) {
            vel.z = 0;
        }
    }
    else {
        onground = false;
    }
    requestAnimationFrame(render);
}
render();