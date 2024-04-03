import './reset.css';
import './styles.css';
import { makeDVD, DVD } from './dvd';

const dvdButton = document.querySelector('#dvdButton') as HTMLButtonElement;
const dvdCount = document.querySelector('#dvdCount') as HTMLParagraphElement;
const dvdCloseAllButton = document.querySelector(
  '#dvdCloseAll',
) as HTMLButtonElement;

const dvds: DVD[] = [];

dvdButton.addEventListener('click', () => {
  // create the DVD entity and add it to dvds array
  //for each dvd associate it with the class that has all the methods the
  //dvd popup should have
  dvds.push(makeDVD());
  // update the displayed count
  // we get the current count of the array for how many dvd popups there are
  dvdCount.innerText = dvds.length.toString();
});

dvdCloseAllButton.addEventListener('click', () => {
  // close all the DVD windows
  // this cloeses all the windows
  dvds.forEach((dvd) => {
    dvd.getWindow().close();
  });
});

let previousTimeStamp: number;


const driveWindows: FrameRequestCallback = (timeStamp) => {
  // manage the calculations for time-between-frames
  // time between each request animation frame and how much time has elapsed since we tried to update things**
  // this is when we first start to define the previous time stamp right**
  if (previousTimeStamp === undefined) {
    previousTimeStamp = timeStamp;
  }
  
  //this will always be positive becase timestamp will always be larger than previoustimestamp**
  const elapsed = timeStamp - previousTimeStamp;

  // drive each DVD window
  // the dvd is the current dvd we are on and the index is the index of the array of dvd's we are on** 
  dvds.forEach((dvd, index) => {
    if (dvd.isOpen()) {
      // move it if it's still open
      // elapsed is in ms and we chose step take in time in seconds so the movement speeds are in pixels per second
      // for dvd.ts and we divide by 1,000 to pass in seconds to use in dvd.ts for pixels per second**
      // how do we know if something is in ms or seconds** (is everything in JS by ms)** (we chose to pass in seconds
      // for dvd.ts so we need to divide by 1,000 to get seconds)** (could we have also done ms or why did we only do seconds)**
      // how did we know its pixels per second how do we know the unit**
      dvd.step(elapsed / 1000);
    } else {
      // remove it if it has been closed
      // we end up closing at the current index and during the next frame it removes each item from the array
      // 1 at a time (we could also assign it to an empty array if it was not a constant variable)** 
      //(why did we make it constant variable)**
      dvds.splice(index, 1);
      //we set the innertext to the arrays current length 
      //we change the innertext to adjust in the main window because we are decreasing the dvd's in the array** 
      dvdCount.innerText = dvds.length.toString();
    }
  });

  //as we keep going in this method we replace the previous time with the current timestamp (timestamp will always
  //be larger than previoustimestamp)**
  previousTimeStamp = timeStamp;

  //we keep calling this each frame
  //we get a new timestamp per frame for free when we call driveWindows** (how)** (how do we know what to call to get it for free)**
  //how do we know what the time stamp is (based on the frame)**
  window.requestAnimationFrame(driveWindows);
};

//initially start the method off 
//when we call drivewindows we get a timestamp for free (is the timestamp as soon as the browser
//starts (when the browser is finished loading in or when the browser is opened)** and it starts counting up in ms)****
window.requestAnimationFrame(driveWindows);
