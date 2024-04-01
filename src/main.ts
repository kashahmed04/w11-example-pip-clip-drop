import './reset.css';
import './styles.css';

const pipButton = document.querySelector('#pipButton') as HTMLButtonElement;
const dropButton = document.querySelector('#dropButton') as HTMLButtonElement;
const colorOutput = document.querySelector('#colorOutput') as HTMLDivElement;
const placeholder = document.querySelector('#placeholder') as HTMLDivElement;
const clipButton = document.querySelector('#clipButton') as HTMLButtonElement;

const handleColorRequest = (win: Window) => {
  // check for browser support
  if (!win.EyeDropper) {
    colorOutput.innerText = 'Your browser does not support the EyeDropper API';
    return;
  }

  // create an EyeDropper
  const eyeDropper = new win.EyeDropper();

  // trigger the EyeDropper
  eyeDropper
    .open()
    .then((result: { sRGBHex: string }) => {
      // once we have a result
      // update the text display
      colorOutput.innerText = result.sRGBHex;
      // set the interface's background color
      (colorOutput.parentElement as HTMLElement).style.backgroundColor =
        result.sRGBHex;
    })
    .catch((e) => {
      colorOutput.textContent = e;
    });
};

const handleCopyRequest = async (win: Window) => {
  try {
    // write some text to the clipboard
    await win.navigator.clipboard.writeText(colorOutput.innerText);
  } catch (e) {
    console.error(e);
  }
};

const setupListenersFor = (win: Window) => {
  // using .onclick instead of .addEventListener because:
  // .onclick - the button only has one handler that gets overwritten
  // .addEventListener - the button can have several listeners for the same event, we don't want duplicates!

  clipButton.onclick = () => {
    handleCopyRequest(win);
  };

  dropButton.onclick = () => {
    handleColorRequest(win);
  };
};

const copyStyles = (win: Window) => {
  // get the interface styles from the main window
  const styles = document.querySelector('#interfaceStyles') as HTMLStyleElement;
  // make a <style> in the PiP window
  const pipStyle = win.document.createElement('style');
  // copy the text over
  pipStyle.innerText = styles.innerText;
  // add the <style> to the PiP window's DOM
  win.document.body.append(pipStyle);
};

pipButton.addEventListener('click', async () => {
  // one way to get around using an unsupported property with TypeScript is
  // to cast it "as unknown as any" - then it can be anything!
  if (!(window as unknown as any).documentPictureInPicture) {
    colorOutput.innerText = 'Your browser does not support the PiP API';
    return;
  }

  // request a PiP window (async/await)
  const pipWindow: Window = await (
    window as unknown as any
  ).documentPictureInPicture.requestWindow();

  // copy some CSS from the main window to the PiP window
  copyStyles(pipWindow);

  const content = document.querySelector('#interface') as HTMLDivElement;
  const parent = content.parentElement as HTMLDivElement;

  // move the interface into the pipWindow
  pipWindow.document.body.appendChild(content);
  // reset the event handlers
  setupListenersFor(pipWindow);
  // show the placeholder
  placeholder.style.display = 'flex';

  // when the PiP closes
  pipWindow.addEventListener('pagehide', () => {
    // put the content back in the main window
    parent.appendChild(content);
    // reset the event handlers
    setupListenersFor(window);
    // hide the placeholder
    placeholder.style.display = 'none';
  });
});

setupListenersFor(window);


/**
 * NEW NOTES
 * 
 * 
 * 
 */