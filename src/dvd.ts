// some constants to make tweaking the movement easier
const MAX_PX_PER_SECOND = 100;
const MIN_PX_PER_SECOND = 50;
//what would the movement be like without these values**

// this approach uses JS Closures
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
// instead of a JS Class
// so for closures we make these variables only available in the scope of this method (so do all methods that use let or
// const in their methods they count as closures??)** what is the difference between closures and JS classes** (is this a class
// or a method)**
export const makeDVD = (): DVD => { //are we saying the class is of type dvd we made for the interface at the end why
  //do we only specify certain things in the interface and not everything**
  // a reference to the moving window
  let proxy: Window;

  // boundary numbers
  //are these the boundaries on where the popups can go based on the whole screen so it does not go out of bounds and can bounce
  //for the popups**
  let max_x: number;
  let max_y: number;
  let min_x: number;
  let min_y: number;

  // position and size numbers
  // is this the position (x and y) for the popup window and the width and height for the popup window**
  let width: number;
  let height: number;
  let x: number;
  let y: number;

  // speed numbers
  // is this how fast each of the popup windows can move**
  // and is it based on delta time and not frames so its constant on all softwares**
  let dx: number;
  let dy: number;

  const initWindow = () => {
    // size of the window
    // this refers to the popup window for the dvd right for initWindow method**
    width = 200;
    height = 200;

    // screen boundaries
    // we get the actual screen sizes then we subtract the width and height we had (200,200) for the maximum x and y**
    // for the minimum x and y we get the actual screen sizes then we subtract the (what is the availwidth and height)**
    //how do we know what to subtract for the minmum and maximum x and y**
    max_x = window.screen.width - width;
    max_y = window.screen.height - height;
    min_x = window.screen.width - window.screen.availWidth;
    min_y = window.screen.height - window.screen.availHeight;

    // starting position
    // pick a random spot for the popup to go to based on the maximum and minimum and y values we calcuated so it does not spawn 
    // out of bounds** (how did we know to do this calculation specifically)**
    x = Math.floor(min_x + Math.random() * (max_x - min_x));
    y = Math.floor(min_y + Math.random() * (max_y - min_y));

    // starting speed
    // how did we know to do this calculation for the upper and what is the upper**
    const upper = MAX_PX_PER_SECOND - MIN_PX_PER_SECOND;
    // is this the values for the x and y for the rate the popups move (why do we only use minimum 
    // and not maximum here for the rate for the speed)** 
    // how did we know to calculate it like this**
    dx =
      Math.floor(Math.random() * upper + MIN_PX_PER_SECOND) *
      (Math.random() > 0.5 ? 1 : -1);
    dy =
      Math.floor(Math.random() * upper + MIN_PX_PER_SECOND) *
      (Math.random() > 0.5 ? 1 : -1);

    // actually open the window (and save a reference into proxy)
    proxy = window.open(
      './dvd.html', // URL to load
      '_blank', // into a _blank page (I thought target blank meant a new window what does the _blank do)**
      `popup,width=${width},height=${height},screenX=${x},screenY=${y}`, // with these params (how do we know what to put
      //for the features section is this what is usually put, the popup and the measurements)**
    ) as Window;
  };

  const bounce = () => {
    // when the screen edge is hit
    // update the body text color to a random color
    //what does the # do here does it give us a base 16 number with the # for the color to apply on the dvd**
    proxy.document.body.style.color =
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    // 16777215 is FFFFFF in decimal
    // pick a random integer from 0 - 16777214, and convert it to a base-16 string
    // and fill the beginning with 0 if it's less than 6 digits long
    //why do we need the color to be 6 digits long when would it be less than 6 digits**
    //what does the padstart do does it fill the number with 0's in the beginning until the 6 digits are reached how
    //does it know to stop adding 0's**
  };

  const step = (deltaTimeSeconds: number) => {
    // attempt to move
    //we change the x and y position based on the current x and y and the dx and dy based on deltatime so
    //its constant across softwares**
    x = x + dx * deltaTimeSeconds;
    y = y + dy * deltaTimeSeconds;

    // check left bound
    // for the x value how do we know to calculate it this way and we multiply by negative 1
    // since we change direction to go oppossite direction if it hits a bound**
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
    // how does it not teleport the dvd popup and instead does it slowly is it because we initially apply delta time to it**
    proxy.moveTo(Math.floor(x), Math.floor(y));
  };

  const isOpen = () => {
    // (the DVD is still open) when (the proxy window is not closed)
    return !proxy.closed;
    //we say the window is still opened so we return true because not closed is true
    //otherwise we return false because the window is closed and we have a !**
  };

  // call to actually open the window
  initWindow(); //so when we click add it runs make dvd but we call this here to open the popup
  //after everythign is created for the window**

  // return only the properties we want to expose to outside files
  // we want main to be able to use the proxy which is the current window 
  // then the isopen to see if the window is opened then the step to get where the popup currently is (its position as we move
  //each frame)** (how do we know its each frame if we dont get the value each frame)**
  return {
    getWindow: () => {
      return proxy;
    },
    isOpen,
    step,
  };
};

// declare a TypeScript interface / return type for makeDVD()
// we do an export here because**
// we need the return value because**
// could we have made the interface without what each method should return**
export interface DVD {
  getWindow: () => Window;
  isOpen: () => boolean;
  step: (deltaTimeSeconds: number) => void;
}
