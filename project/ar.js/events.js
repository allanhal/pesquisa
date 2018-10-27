const DEBUG = false;

document.getElementById('main-div').style.visibility = DEBUG ? "" : "hidden";

//////////////////////////////////////////////////////////////////////////////////
//  Touch Events
//////////////////////////////////////////////////////////////////////////////////

var touchstartX = 0;
var touchstartY = 0;
var touchendX = 0;
var touchendY = 0;

eventStart = 'touchstart'
eventEnd = 'touchend'

eventStart = 'mousedown'
eventEnd = 'mouseup'

document.body.addEventListener(eventStart, function (event) {
    touchstartX = event.screenX;
    touchstartY = event.screenY;
}, false);

document.body.addEventListener(eventEnd, function (event) {
    touchendX = event.screenX;
    touchendY = event.screenY;
    handleGesure();
}, false);

function handleGesure() {
    let xDirection = touchendX < touchstartX
    let xDiff = touchendX - touchstartX < 0 ? touchstartX - touchendX : touchendX - touchstartX
    if (xDirection) {
        document.getElementById('eventoX').innerHTML = 'X: left'
    } else {
        document.getElementById('eventoX').innerHTML = 'X: right'
    }

    let yDirection = touchendY < touchstartY
    let yDiff = touchendY - touchstartY < 0 ? touchstartY - touchendY : touchendY - touchstartY
    if (yDirection) {
        document.getElementById('eventoY').innerHTML = 'Y: up'
    } else {
        document.getElementById('eventoY').innerHTML = 'Y: down'
    }

    if (xDiff > yDiff) {
        if (xDirection) {
            document.getElementById('eventoTotal').innerHTML = 'Result: left'
        } else {
            document.getElementById('eventoTotal').innerHTML = 'Result: right'
        }
    } else {
        if (yDirection) {
            document.getElementById('eventoTotal').innerHTML = 'Result: up'
        } else {
            document.getElementById('eventoTotal').innerHTML = 'Result: down'
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////
//  Button Events
//////////////////////////////////////////////////////////////////////////////////

$('#clicked-1').on('click touchend', function (e) {
    enableRotateBox1()
});
$('#clicked-2').on('click touchend', function (e) {
    enableRotateBox2()
});
$('#left-button').on('click touchend', function (e) {
    setLeft();
});
$('#right-button').on('click touchend', function (e) {
    setRight();
});
$('#up-button').on('click touchend', function (e) {
    setUp()
});
$('#down-button').on('click touchend', function (e) {
    setDown()
});

$(document).keydown(function (e) {
    switch (e.which) {
        case 37: // left
            setLeft()
            break;
        case 38: // up
            setUp()
            break;
        case 39: // right
            setRight()
            break;
        case 40: // down
            setDown()
            break;
        default:
            return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

//////////////////////////////////////////////////////////////////////////////////
//  Intersect Events
//////////////////////////////////////////////////////////////////////////////////

document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('touchstart', onDocumentTouchStart, false);

function onDocumentTouchStart(event) {
    event.preventDefault();
    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown(event);
}

function onDocumentMouseDown(event) {

    event.preventDefault();

    var vector = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
    );
    vector.unproject(camera);

    var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());


    let toIntersect = scene.children.find(child => child.name == 'smoothedRoot').children

    var intersects = ray.intersectObjects(toIntersect);
    var isIntersected = intersects && intersects.length > 0
    if (isIntersected) {
        if (intersects[0].object.name == "mesh1") {
            enableRotateBox1()
        }
        if (intersects[0].object.name == "mesh2") {
            enableRotateBox2()
        }
        if (intersects[0].object.name == "meshUp") {
            setUp()
        }
        if (intersects[0].object.name == "meshDown") {
            setDown()
        }
        if (intersects[0].object.name == "meshRight") {
            setRight()
        }
        if (intersects[0].object.name == "meshLeft") {
            setLeft()
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////
//  Default Events
//////////////////////////////////////////////////////////////////////////////////
// document.ontouchmove = function (event) {
//     event.preventDefault();
// }