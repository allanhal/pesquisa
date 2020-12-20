//////////////////////////////////////////////////////////////////////////////////
//  Keyboard Events
//////////////////////////////////////////////////////////////////////////////////

$(document).keydown(function (e) {
  switch (e.key) {
    case 'ArrowLeft':
    case 'a':
      setLeft();
      break;
    case 'ArrowUp':
    case 'w':
      setUp();
      break;
    case 'ArrowRight':
    case 'd':
      setRight();
      break;
    case 'ArrowDown':
    case 's':
      setDown();
      break;
    case 'r':
      resetSnake();
      break;
    default:
      return;
  }
  e.preventDefault();
});

//////////////////////////////////////////////////////////////////////////////////
//  Intersect Events
//////////////////////////////////////////////////////////////////////////////////

document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('touchstart', onDocumentTouchStart, false);

function onDocumentTouchStart(event) {
  event.clientX = event.touches[0].clientX;
  event.clientY = event.touches[0].clientY;
  onDocumentMouseDown(event);
}

function onDocumentMouseDown(event) {
  var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
  vector.unproject(camera);

  var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

  let toIntersect = scene.children.find((child) => child.name == 'smoothedRoot').children;

  var intersects = ray.intersectObjects(toIntersect);
  var isIntersected = intersects && intersects.length > 0;
  if (isIntersected) {
    switch (intersects[0].object.name) {
      case 'meshUp':
        setUp();
        break;
      case 'meshDown':
        setDown();
        break;
      case 'meshRight':
        setRight();
        break;
      case 'meshLeft':
        setLeft();
        break;
      default:
        break;
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////
//  Touch Events
//////////////////////////////////////////////////////////////////////////////////

var touchstartX = 0;
var touchstartY = 0;
var touchendX = 0;
var touchendY = 0;

eventStart = 'touchstart';
eventEnd = 'touchend';

document.body.addEventListener(
  eventStart,
  function (event) {
    touchstartX = event.changedTouches[0].clientX;
    touchstartY = event.changedTouches[0].clientY;
  },
  false
);

document.body.addEventListener(
  eventEnd,
  function (event) {
    touchendX = event.changedTouches[0].clientX;
    touchendY = event.changedTouches[0].clientY;
    handleGesure();
  },
  false
);

function handleGesure() {
  let xDirection = touchendX < touchstartX;
  let xDiff = touchendX - touchstartX < 0 ? touchstartX - touchendX : touchendX - touchstartX;

  let yDirection = touchendY < touchstartY;
  let yDiff = touchendY - touchstartY < 0 ? touchstartY - touchendY : touchendY - touchstartY;

  if (xDiff == 0 && yDiff == 0 && enabledControls) {
    resetSnake();
  } else if (xDiff > yDiff) {
    if (xDirection) {
      setLeft();
    } else {
      setRight();
    }
  } else {
    if (yDirection) {
      setUp();
    } else {
      setDown();
    }
  }
}
