// some constants to make tweaking the movement easier
const MAX_PX_PER_SECOND = 100;
const MIN_PX_PER_SECOND = 50;

// this approach uses JS Closures
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
// instead of a JS Class
export const makeDVD = (): DVD => {
  // a reference to the moving window
  let proxy: Window;

  // boundary numbers
  let max_x: number;
  let max_y: number;
  let min_x: number;
  let min_y: number;

  // position and size numbers
  let width: number;
  let height: number;
  let x: number;
  let y: number;

  // speed numbers
  let dx: number;
  let dy: number;

  const initWindow = () => {
    // size of the window
    width = 200;
    height = 200;

    // screen boundaries
    max_x = window.screen.width - width;
    max_y = window.screen.height - height;
    min_x = window.screen.width - window.screen.availWidth;
    min_y = window.screen.height - window.screen.availHeight;

    // starting position
    x = Math.floor(min_x + Math.random() * (max_x - min_x));
    y = Math.floor(min_y + Math.random() * (max_y - min_y));

    // starting speed
    const upper = MAX_PX_PER_SECOND - MIN_PX_PER_SECOND;
    dx =
      Math.floor(Math.random() * upper + MIN_PX_PER_SECOND) *
      (Math.random() > 0.5 ? 1 : -1);
    dy =
      Math.floor(Math.random() * upper + MIN_PX_PER_SECOND) *
      (Math.random() > 0.5 ? 1 : -1);

    // actually open the window (and save a reference into proxy)
    proxy = window.open(
      './dvd.html', // URL to load
      '_blank', // into a _blank page
      `popup,width=${width},height=${height},screenX=${x},screenY=${y}`, // with these params
    ) as Window;
  };

  const bounce = () => {
    // when the screen edge is hit
    // update the body text color to a random color
    proxy.document.body.style.color =
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    // 16777215 is FFFFFF in decimal
    // pick a random integer from 0 - 16777214, and convert it to a base-16 string
    // and fill the beginning with 0 if it's less than 6 digits long
  };

  const step = (deltaTimeSeconds: number) => {
    // attempt to move
    x = x + dx * deltaTimeSeconds;
    y = y + dy * deltaTimeSeconds;

    // check left bound
    if (x < min_x) {
      x = min_x + (min_x - x);
      dx *= -1;
      bounce();
    }
    // check top bound
    if (y < min_y) {
      y = min_y + (min_y - y);
      dy *= -1;
      bounce();
    }

    // check right bound
    if (x > max_x) {
      x = max_x + (max_x - x);
      dx *= -1;
      bounce();
    }
    // check bottom bound
    if (y > max_y) {
      y = max_y + (max_y - y);
      dy *= -1;
      bounce();
    }

    // actually move the window to a whole-pixel location
    proxy.moveTo(Math.floor(x), Math.floor(y));
  };

  const isOpen = () => {
    // (the DVD is still open) when (the proxy window is not closed)
    return !proxy.closed;
  };

  // call to actually open the window
  initWindow();

  // return only the properties we want to expose to outside files
  return {
    getWindow: () => {
      return proxy;
    },
    isOpen,
    step,
  };
};

// declare a TypeScript interface / return type for makeDVD()
export interface DVD {
  getWindow: () => Window;
  isOpen: () => boolean;
  step: (deltaTimeSeconds: number) => void;
}
