import './reset.css';
import './styles.css';

const pipButton = document.querySelector('#pipButton') as HTMLButtonElement;
const dropButton = document.querySelector('#dropButton') as HTMLButtonElement;
const colorOutput = document.querySelector('#colorOutput') as HTMLDivElement;
const placeholder = document.querySelector('#placeholder') as HTMLDivElement;
const clipButton = document.querySelector('#clipButton') as HTMLButtonElement;

const handleColorRequest = (win: Window) => {
  if (!win.EyeDropper) {
    colorOutput.innerText = 'Your browser does not support the EyeDropper API';
    return;
  }

  const eyeDropper = new win.EyeDropper();

  eyeDropper
    .open()
    .then((result: { sRGBHex: string }) => {
      colorOutput.innerText = result.sRGBHex;
      (colorOutput.parentElement as HTMLElement).style.backgroundColor =
        result.sRGBHex;
    })
    .catch((e) => {
      colorOutput.textContent = e;
    });
};

const handleCopyRequest = async (win: Window) => {
  try {
    await win.navigator.clipboard.writeText(colorOutput.innerText);
  } catch (e) {
    console.error(e);
  }
};

const setupListenersFor = (win: Window) => {
  clipButton.onclick = () => {
    handleCopyRequest(win);
  };

  dropButton.onclick = () => {
    handleColorRequest(win);
  };
};

const copyStyles = (win: Window) => {
  const styles = document.querySelector('#interfaceStyles') as HTMLStyleElement;
  const pipStyle = win.document.createElement('style');
  pipStyle.innerText = styles.innerText;
  win.document.body.append(pipStyle);
};

pipButton.addEventListener('click', async () => {
  const pipWindow: Window = await (
    window as unknown as any
  ).documentPictureInPicture.requestWindow();

  copyStyles(pipWindow);

  const content = document.querySelector('#interface') as HTMLDivElement;
  const parent = content.parentElement as HTMLDivElement;
  pipWindow.document.body.appendChild(content);
  setupListenersFor(pipWindow);
  placeholder.style.display = 'flex';

  pipWindow.addEventListener('pagehide', () => {
    parent.appendChild(content);
    setupListenersFor(window);
    placeholder.style.display = 'none';
  });
});

setupListenersFor(window);
