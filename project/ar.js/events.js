//////////////////////////////////////////////////////////////////////////////////
//  Button Events
//////////////////////////////////////////////////////////////////////////////////

$('#clicked-1').on('click touchend', function (e) {
    clicked1 = !clicked1
});
$('#clicked-2').on('click touchend', function (e) {
    clicked2 = !clicked2
});
$('#left-button').on('click touchend', function (e) {
    goLeft();
});
$('#right-button').on('click touchend', function (e) {

    goRight();
});
$('#up-button').on('click touchend', function (e) {
    goUp()
});
$('#down-button').on('click touchend', function (e) {
    goDown()
});

$(document).keydown(function (e) {
    switch (e.which) {
        case 37: // left
            goLeft()
            break;
        case 38: // up
            goUp()
            break;
        case 39: // right
            goRight()
            break;
        case 40: // down
            goDown()
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
    }
}