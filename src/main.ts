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
  dvds.push(makeDVD());
  // update the displayed count
  dvdCount.innerText = dvds.length.toString();
});

dvdCloseAllButton.addEventListener('click', () => {
  // close all the DVD windows
  dvds.forEach((dvd) => {
    dvd.getWindow().close();
  });
});

let previousTimeStamp: number;

const driveWindows: FrameRequestCallback = (timeStamp) => {
  // manage the calculations for time-between-frames
  if (previousTimeStamp === undefined) {
    previousTimeStamp = timeStamp;
  }
  const elapsed = timeStamp - previousTimeStamp;

  // drive each DVD window
  dvds.forEach((dvd, index) => {
    if (dvd.isOpen()) {
      // move it if it's still open
      dvd.step(elapsed / 1000);
    } else {
      // remove it if it has been closed
      dvds.splice(index, 1);
      dvdCount.innerText = dvds.length.toString();
    }
  });

  previousTimeStamp = timeStamp;

  window.requestAnimationFrame(driveWindows);
};

window.requestAnimationFrame(driveWindows);
