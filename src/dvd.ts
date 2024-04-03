// some constants to make tweaking the movement easier
const MAX_PX_PER_SECOND = 100;
const MIN_PX_PER_SECOND = 50;
//the constants are there so we can change the speed in one place for the movement of the 
//windows 

// this approach uses JS Closures
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
// instead of a JS Class
// closures act similar to a class and we dont need to make a new instance and we dont need this. anywhere
// the return statement returns what we say it does and when we create a dvd thats what exists within it in main
// so we can use this only 
// can we still make a new instance of the class though or no**
export const makeDVD = (): DVD => { //this allows us to know what the funciton signature will look like in the class
  // and that way main knows what to expect from a dvd** and makeDVD knows to use whats in the interface otherwise
  // TS will yell at us
  // a reference to the moving window
  let proxy: Window;

  // boundary numbers
  //are these the boundaries on where the popups can go based on the whole screen so it does not go out of bounds and can bounce
  //for the popups (yes)
  let max_x: number;
  let max_y: number;
  let min_x: number;
  let min_y: number;

  // position and size numbers
  // is this the position (x and y) for the popup window and the width and height for the popup window (yes)**
  let width: number;
  let height: number;
  let x: number;
  let y: number;

  // speed numbers
  // is this how fast each of the popup windows can move (yes)
  // and is it based on delta time and not frames so its constant on all softwares (yes)
  let dx: number;
  let dy: number;

  const initWindow = () => {
    // size of the window
    // when we do proxy = window.open we use it there to make the window 
    width = 200;
    height = 200;

    // screen boundaries
    // the minimum x and y takes into account the task bars and other things not on the browser
    // but the maximum x and y are for how big we can be for the bounds (why does it not take into account the task bars as well)**
    max_x = window.screen.width - width;
    max_y = window.screen.height - height;
    min_x = window.screen.width - window.screen.availWidth;
    min_y = window.screen.height - window.screen.availHeight;

    // starting position
    // pick a random spot for the popup to go 
    // we get somewhere between the minmum and maximum and we subtract for the random to keep it in range 
    // we subtract our maximum value from our minimum value so we can stay in bounds because if we just did maximum then** 
    x = Math.floor(min_x + Math.random() * (max_x - min_x));
    y = Math.floor(min_y + Math.random() * (max_y - min_y));

    // starting speed
    const upper = MAX_PX_PER_SECOND - MIN_PX_PER_SECOND;
    // when it bounces it will neagte the speed and move in the other direction (this gives us the average between our
    //maximum and minimum speed)**(could we have just used 1 value for speed why do we have 2 of them then subtract)**
    //what happens if the upper is negative where would it go**
    dx =
      Math.floor(Math.random() * upper + MIN_PX_PER_SECOND) *
      (Math.random() > 0.5 ? 1 : -1);
    dy =
      Math.floor(Math.random() * upper + MIN_PX_PER_SECOND) *
      (Math.random() > 0.5 ? 1 : -1);

    // actually open the window (and save a reference into proxy)
    proxy = window.open(
      './dvd.html', // URL to load (load the html into the popup)
      '_blank', // into a _blank page (we have a popup so we make it a blank window with out HTML in it)**
      `popup,width=${width},height=${height},screenX=${x},screenY=${y}`, 
    ) as Window;
  };

  const bounce = () => {
    // when the screen edge is hit
    // update the body text color to a random color
    //what does the # do here does it give us a base 16 number with the # for the color to apply on the dvd (yes)
    //we change the color here so the current color refers to this color in the dvd.html (I thought it was only for text color though
    //to use current color or is it when we just define any color)**
    proxy.document.body.style.color =
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    // 16777215 is FFFFFF in decimal
    // pick a random integer from 0 - 16777214, and convert it to a base-16 string
    // if math.random comes back as 0 then its a single 0 and we have to pad out the beginnning with 0's to get it to 6 characters
    // if we dont have 6 numbers or characters (for hex its numbers or characters)** it adds 0's until to the beginning 
    //until there are 6 entries of the hex code**
  };

  const step = (deltaTimeSeconds: number) => {
    // attempt to move
    // this makes it so its constant based on whatever machine and whatever refresh rate the machine uses
    // so it wont be the same across softwares because of the refresh rate** 
    x = x + dx * deltaTimeSeconds;
    y = y + dy * deltaTimeSeconds;
    //so we make x and y initially to make the window size for each window when we open it
    // then we override it with the rate it should move
    //at per frame (how does that work)****

    // check left bound
    // when we get passed our boundary we reset our poisition but we add the padding onto it 
    // so it bounces instead of going passed the bounds (keeps the bounces crisp)
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
    // how does it not teleport the dvd popup and instead does it slowly is it because we initially apply delta time to it
    // it looks like its moving smoothly because its moving in small steps frequecntly but its not transisiting or sliding 
    // and its moving in small amounts based on how we set it up 
    proxy.moveTo(Math.floor(x), Math.floor(y));
  };

  const isOpen = () => {
    // (the DVD is still open) when (the proxy window is not closed)
    return !proxy.closed;
    //we say the window is still opened so we return true because not closed is true
    //otherwise we return false because the window is closed and we have a ! (yes)
  };

  // call to actually open the window
  initWindow(); //so when we click add it runs make dvd but we call this here to open the popup
  //after everythign is created for the window (we call init window so that we can initially set up a dvd when we make one in main)
  //why do we call initwindow if we call the make dvd class from main or do methods only get defined and not called within the class
  //itself and we have to actually call methods from the class for it to work**
  //when we click the create button from main.ts
  //it makes everything then call init window to apply these changes then it makes
  //the window so we dont need to worry if we override the x and the y for the movement in step because we already
  //applied the size of the window****
  //the methods in init window only set up the methods for each dvd and we have to actually call them for us to
  //apply the method to the window****

  // return only the properties we want to expose to outside files
  // we want main to be able to use the proxy which is the current window 
  // and we return these methods to use it in main with each dvd
  return {
    getWindow: () => { //why do we return a method here and not just proxy**** (or is this not a method what is this)****
      //difference between this and a method****
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
  //difference betweeh using the : and the equals sign for const isOpen = for example instead of the :**
}
