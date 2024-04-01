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
  //dvd popup should have**
  dvds.push(makeDVD());
  // update the displayed count
  // we get the current count of the array for how many dvd popups there are**
  dvdCount.innerText = dvds.length.toString();
});

dvdCloseAllButton.addEventListener('click', () => {
  // close all the DVD windows
  // how does it know to close because we call get window which is**
  // and what does the close() do is it built in because we did not define it in our class or here**
  dvds.forEach((dvd) => {
    dvd.getWindow().close();
  });
});

let previousTimeStamp: number;

//for the frame request callback do we need it to be able to get the time that has passed in between each frame 
//for the popups as they move around the screen** (why do we need the time)**
const driveWindows: FrameRequestCallback = (timeStamp) => {
  // manage the calculations for time-between-frames
  //this is initially when we start**
  if (previousTimeStamp === undefined) {
    previousTimeStamp = timeStamp;
  }
  const elapsed = timeStamp - previousTimeStamp;
  //does timestamp keep going to the current time and we set that to the previous timestamp so its positive
  //when we subtract because timestamp will always be greater than previoustimestamp**

  // drive each DVD window
  //whats is index we never defined it in here**
  dvds.forEach((dvd, index) => {
    if (dvd.isOpen()) {
      // move it if it's still open
      //we get the time in between each frame and divide it by 1,000 then make call the step method to actually move the popup
      //around the window screen**
      //this is in ms right is it like that for all time in JS**
      //how did we know to do this**
      dvd.step(elapsed / 1000);
    } else {
      // remove it if it has been closed
      //splice modified the original array and removed the index we closed and only removes that thing since there is a 1**
      //could we have done remove or is that for another data type**
      //why dont we clear the whole array and make it an empty array instead because there is only an option to close
      //all the popups**
      dvds.splice(index, 1);
      //we set the innertext to the arrays current length 
      //can we just say 0 here since we close all the popups at once**
      dvdCount.innerText = dvds.length.toString();
    }
  });

  //as we keep going in this method we replace the previous time with the current timestamp**
  //how does it know what to pass for timestamp in the parameter if we never call this**
  previousTimeStamp = timeStamp;

  //we keep calling this each frame**
  window.requestAnimationFrame(driveWindows);
};

//initially start the method off**
window.requestAnimationFrame(driveWindows);
