//////////////////////////////////////////////////////////////////////////////////
//  Keyboard Events
//////////////////////////////////////////////////////////////////////////////////

$(document).keydown(function (e) {
  console.log("e.key", e.key);
  // ArrowLeft
  // ArrowRight
  // ArrowUp
  // ArrowDown

  switch (e.key) {
    case "ArrowLeft": // left
    case "a": // left
      setLeft();
      break;
    case "ArrowUp": // up
    case "w": // up
      setUp();
      break;
    case "ArrowRight": // right
    case "d": // right
      setRight();
      break;
    case "ArrowDown": // down
    case "s": // down
      setDown();
      break;
    case "r": // reset
      resetSnake();
      break;
    default:
      return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
});

//////////////////////////////////////////////////////////////////////////////////
//  Intersect Events
//////////////////////////////////////////////////////////////////////////////////

document.addEventListener("mousedown", onDocumentMouseDown, false);
document.addEventListener("touchstart", onDocumentTouchStart, false);

function onDocumentTouchStart(event) {
  event.clientX = event.touches[0].clientX;
  event.clientY = event.touches[0].clientY;
  onDocumentMouseDown(event);
}

function onDocumentMouseDown(event) {
  var vector = new THREE.Vector3(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5
  );
  vector.unproject(camera);

  var ray = new THREE.Raycaster(
    camera.position,
    vector.sub(camera.position).normalize()
  );

  let toIntersect = scene.children.find((child) => child.name == "smoothedRoot")
    .children;

  var intersects = ray.intersectObjects(toIntersect);
  var isIntersected = intersects && intersects.length > 0;
  if (isIntersected) {
    switch (intersects[0].object.name) {
      case "meshUp":
        setUp();
        break;
      case "meshDown":
        setDown();
        break;
      case "meshRight":
        setRight();
        break;
      case "meshLeft":
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

eventStart = "touchstart";
eventEnd = "touchend";

// eventStart = 'mousedown'
// eventEnd = 'mouseup'

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
  let xDiff =
    touchendX - touchstartX < 0
      ? touchstartX - touchendX
      : touchendX - touchstartX;

  let yDirection = touchendY < touchstartY;
  let yDiff =
    touchendY - touchstartY < 0
      ? touchstartY - touchendY
      : touchendY - touchstartY;

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