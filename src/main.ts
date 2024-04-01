import './reset.css';
import './styles.css'; //how does it know to import styles if there was no export in styles**

const pipButton = document.querySelector('#pipButton') as HTMLButtonElement;
const dropButton = document.querySelector('#dropButton') as HTMLButtonElement;
const colorOutput = document.querySelector('#colorOutput') as HTMLDivElement;
const placeholder = document.querySelector('#placeholder') as HTMLDivElement;
const clipButton = document.querySelector('#clipButton') as HTMLButtonElement;

//does the window element represent our whole brwoser only in the current window we are in**
const handleColorRequest = (win: Window) => {
  // check for browser support
  // the eye dropper is a built in library in JS or method**
  if (!win.EyeDropper) {
    colorOutput.innerText = 'Your browser does not support the EyeDropper API';
    return;
  }

  // create an EyeDropper
  //this allows us the create the eye dropper on the window**
  //why do we use () here but not when we check if the window has the eye dropper**
  //how do we know when to use the ()**
  const eyeDropper = new win.EyeDropper();

  // trigger the EyeDropper
  eyeDropper
    .open() //is it the .open() that returns a promise (or is it the eyedropper when we create it and try to use it here)**
    .then((result: { sRGBHex: string }) => { //does .then() and await do the same thing and just waits until the operation is done
      //or how are they different**(.then() and await are only used for promises right)**
      //was it eyedropper that only returns a promise or what else**
      // once we have a result
      // update the text display
      colorOutput.innerText = result.sRGBHex;
      // set the interface's background color
      (colorOutput.parentElement as HTMLElement).style.backgroundColor =
        result.sRGBHex; //is parentElement built in and would it be the interface div how does it know
        //to only include the color in that box is it because of the div being a block element and doing the color in that whole div**
        //how does it know to not put the colors on top of the elements**
    })
    .catch((e) => {
      colorOutput.textContent = e; //when would there be an error (if we click with the eye dropper and it cant get the color
      //because wherever we click there will be a color so is it only if it cant get it)**
      //we make the color output the error message if we cant get the color**
    });
};

//why did we put async here but not in the eyedropper is it because the eyedropper already is a promise but here we
//are creating a promise otherwise it would have not been a promise**
//whenever we use the clipboard do we have to use navigator keyword then clipboard**
//with the eyedropper do we only have to say navigator usually too or what is navigator used for**
const handleCopyRequest = async (win: Window) => {
  try {
    // write some text to the clipboard
    await win.navigator.clipboard.writeText(colorOutput.innerText);
  } catch (e) { //what would be an error would it be if there was no color output when we clicked a color or 
    //just the ______ when we start the browser
    //or how would that save**
    console.error(e);
  }
};

const setupListenersFor = (win: Window) => {
  // using .onclick instead of .addEventListener because:
  // .onclick - the button only has one handler that gets overwritten
  // .addEventListener - the button can have several listeners for the same event, we don't want duplicates!
  //onclick basically does one event then when we click again it stops doing that event and does the newest one (gets overridden)**
  //addeventlistener does the event for each click so if we press a button 5 times fast then it does the event and adds the rest into
  //a queue to do the rest of the events**
  //why dont we want duplicates for out buttons**

  clipButton.onclick = () => {
    //we pass in the current window into these methods**
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
  //we get the window HTML and create a style element in it (we dont have access to the popup window HTML but we add
  //styles to it)**
  const pipStyle = win.document.createElement('style');
  // copy the text over
  //we make the style element we just created innertext equal to the styles innertext (the content inside the element with that
  //id)**so we can use the styles in our popup that we had in our main window
  //otherwise if we did not have this in the HTML and CSS or JS instead then**
  pipStyle.innerText = styles.innerText;
  // add the <style> to the PiP window's DOM
  // if we created an element in the window already for a style element why do we have to append it** (why do we say 
  //document.body here but only .document with pipstyle)** 
  win.document.body.append(pipStyle);
};

pipButton.addEventListener('click', async () => {
  // one way to get around using an unsupported property with TypeScript is
  // to cast it "as unknown as any" - then it can be anything!
  //how come we just didnt say as any only so it can be anything**
  //is documentpictureinpicture build in for pip only is it not build in for clipbaord or eyedropper**
  if (!(window as unknown as any).documentPictureInPicture) {
    //if the window as not return the picture in picture then it returns a message to say the browser does not support
    //the picture in picture mode**
    colorOutput.innerText = 'Your browser does not support the PiP API';
    return;
  }

  // request a PiP window (async/await)
  //so pip and eye dropper only return promises by default without having us to say async in method signature right**
  //and clipboard (handlecopyrequest) does not so we have to make a promise ourself for it** 
  //thats why we dont need an async for pip window and eyedropper but we do for clipboard)**
  //this is when we want to actually wait for the pip to load in if its supported whereas above 
  //its is not supported or cant load the pip in**
  //we wait until the window is finished being requested here if its supported (until the pip fully loads in)**
  const pipWindow: Window = await (
    window as unknown as any
  ).documentPictureInPicture.requestWindow();

  // copy some CSS from the main window to the PiP window
  //what does copy styles do and how does it know which styles to copy and we call pipwindow because that represents
  //the loaded window because we said it was of type window and we have to wait for it to load then
  //apply styles to it**
  copyStyles(pipWindow);

  //this gets the interface element which is all of our content but when we say content.parentElement 
  //how is it a div because if we get the parent of the interface div wouldnt that be the body**
  const content = document.querySelector('#interface') as HTMLDivElement;
  const parent = content.parentElement as HTMLDivElement;

  // move the interface into the pipWindow
  // why do we move the content from the main window to the pipwindow why cant we just copy it over
  // is this specifically for pip**
  pipWindow.document.body.appendChild(content);
  // reset the event handlers
  // why do we reset the event handlers if we move the interface from the browser to the pip  (do we usually only
  //do this with pip why)**
  setupListenersFor(pipWindow);
  // show the placeholder
  //how does it know to show the placeholder where the interface was on the main screen**
  //there was no show or hide class so was this under the interface before (we didnt change the z-index though)**
  //why do we do display flex here if we already did it in the styles in index.html**
  //I thought we would have put show here instead since the style already have flex**
  //can we do this or classlist for HTML element how do we know which to use**
  placeholder.style.display = 'flex';

  // when the PiP closes
  // is page hide built in and only used with pip**
  pipWindow.addEventListener('pagehide', () => {
    // put the content back in the main window
    // can we say parent.document.body.appendChild(content); or why would we only say append child only here**
    // does parent represent a div here or the body** (which div)**
    parent.appendChild(content);
    // reset the event handlers
    //why do we reset the event handlers and how does it know what window is and how does it know
    //window is the main window**
    setupListenersFor(window);
    // hide the placeholder
    //we hide the placeholder that says the pip window is opened
    placeholder.style.display = 'none';
  });
});

//set up the event listeners intiially when the page loads (why would we do this initially)**
setupListenersFor(window);


/**
 * NEW NOTES
 * 
 * we will talk about picture and picture, eyedropper, clipboard, window, and build and we will talk about building and deploying
 * with vite to put on a server for others to see rather than a local host like vite we have been doing**
 * 
 * we have an open picutre and picture button that opens the content in another window and it stays on top of everything and youtube
 * also has picture and picture to view videos and it applies
 * for whatever tab we want to go to and we get only one picture and picture per browser**
 * picture and picture allows only one window and it goes on top of all the other tabs we go to**
 * when the parent is closed does the picture in picture also close here**
 * 
 * and we have a color picker and we can find a pixel for a color and it works outside the browser window and gives us color 
 * on our task bar and our home screen if we wanted** 
 * 
 * it also updates the background color and puts the hexcode on the background for out interface div**
 * 
 * picture and picture was originally for a video element only but now we can now do it with whatever DOM element we want (not available on
 * firefox though)**
 * 
 * 
 * EYEDROPPER:
 * 
 * opens an eyedropper picker tool when we press pick color
 * only available in chrome, edge, and opera 
 * because of this it does not exist on the window object as far as typescript is concered and we have to trick it to
 * let it work on the window** (where did we do this specifically was it when we said as unknown as any what does this do
 * why couldnt we say any)**
 * 
 * what does it mean by defintions for non-mainline feature for eyedropper on slide 4**
 * main controls the eyedropper in terms of launching it and changing the interface element based on the color we chose
 * as well as the pip right**
 * 
 * CLIPBOARD:
 * 
 * read: lets us read rich information (structured markup, image files)
 * readtext: reading only strings (text)
 * 
 * write: write any string into the**
 * wiretext: encode the**
 * 
 * stick with readtext and writetext because working with strings is easier and it gets complicated if we work with
 * read and write only** (how does it get complicated)** (slide 5)**
 * 
 * 
 * INDEX.HTML:
 * 
 * we have a style element in the head because as we open the picture and picture it loses the styles for that
 * window so we can grab the id from the styles and apply the styles in the picture and picture button** (why does it lose
 * its styles when we open pip and open it back up in the main browser when we exit pip)**
 * 
 * we have a placeholder div thats hidden (how is it hidden because we dont give it a classlist 
 * in the HTML)** but when we open the picture and picture it gets shown (it gives the interface
 * to the other window and shows the interface on the new window)(in reality it)**
 * why do we transfer the data over to the pip or to the main window and not just copy the data over instead**
 * 
 * are eyedropper, pip, clipboard, window, and build all API's or which ones are API's (are they restful API's)**
 * 
 * MAIN.TS:
 * 
 * has selectors for HTML and has handle color and handle copy request and since the eyedropper and the clipbaord API
 * use the window object we have to reset the listeners as we open the picture and picture**
 * 
 * the functions uses the window as a parameter which is the main window or the picture and picture (small window) when its open**
 * so when we say window depending on if the pip is open or the actual brwoser window it will use that
 * and we dont have to specify because they are both windows**
 * 
 * for the copy request we just say window.naviaror.clipboard(write some text) and we write the color output
 * and it returns a promise to let us know its complete and we use await to wait until we get the color or an error
 * then show it on our window**
 * 
 * difference between await and .then for promises and are they only used in promises to stop everything** (or current file)**
 * until we loaded everything or the promise is done**
 * 
 * for eye dropper we assume we have supporrt and make our eyedropped and we use .then because eyedropper returns a promise**
 * why do we assume we have support what if we dont do we just throw an error if the promise did not work for eye dropper**
 * 
 * do promises use await or then (what the difference dont they both involve waiting to loading something)**
 * 
 * we create a style tag for the picture in picture window then copy the style from one window to the next and we copy that picture and
 * picture style into the child which is the child window and back to the parent when we close the pip window**
 * 
 * inside the picture and picture button event handler we check for brwoser availability and we see if the dociuetpictureandpicture
 * poperty exists and we trick TS to use the unknown property and we take the window property and we cast it as unknown then as any 
 * an TS can be anything for the window and that way we can use the picture and picture mode**
 * 
 * we can do request window and that returns a pip window to us then we copy styles then grab the interface and find out what the parent was
 * then append the interface content to the window, set up the new windows, and display that event handler**
 * 
 * whenever the pip window closes we appened the content back to the parent and we set up the event listeners again for the 
 * parent window and make the placeholder none to show the smaller window was closed** 
 * 
 * EYEDROPPER.TS:
 * 
 * since TS does not support eye dropper we add out own interfaces and extended the window property to have these
 * eye dropper properties**
 * 
 * WINDOW MOVEMENT:
 * 
 * to open child windows (these windows dont stay on top of everything else and dont leave when we close parent 
 * window and we can have multiple child windows with these new mtethods instead of 1)**
 * 
 * for picture in picture it stays on top of all the other tabs, we can only have 1 pip, and can it still show
 * even if the parent tab is closed**
 * 
 * we can have DVDs and we can have the DVD screens go around the window and bounce off the bounds 
 * we could also close all the windows and they could go away when we open multilpe windows (the main window keeps 
 * track of all the children and close them if needed by using request animation frame to change their 
 * position each frame and close them if needed)**
 * 
 * DVD BRANCH:
 * 
 * MAIN.TS:
 * 
 * we have our buttons we seeclted from the HTML and we have an array of DVD objects and whenever we click the add button
 * it makes a new DVD and adds it to the array and adds it to the count on the parent window**
 * 
 * if we want to close eveyrthing we get each child and close it**
 * 
 * we have drive windows which uses the previous time stamp to use how much time has elapsed and gives us a number of ms between
 * each frame and we can use that to have our movement be consistent rather than per frame (consistent across all
 * softwares) and we close everything when we are done**
 * 
 * this is more a manager and DVD.TS is under the hood whats happening**
 * 
 * DVD.TS:
 * 
 * we can use the funciton scope of let and const to trick TS into making things like private properties (we have proxy, height
 * x,y,etc. that we dont want to define outside the interface)** 
 * 
 * at down at the bottom of the DVD.TS it returns the things main will be aware of otherwise eveyrthing else is hidden inside 
 * of the funciton closure**
 * 
 * and down below that we have an interface to describe what everything we reutn is so we make sure to return everything to main
 * we need to and nothing more or nthig less**
 * 
 * initwindow sets the width and height and gets the maximum and minimum x and y postion for the window and if our task bar
 * was on the bottom then**
 * 
 * we pick a starting speed and we multilpy by 1 or negative so we can have up or down or left and right movement**
 * 
 * we can then open the popup which is the proxy for a random width and height**
 * 
 * DVD.HTML:
 * 
 * we get reset CSS and we add some styles in the HTML rather than making a CSS file and we have a DIV with an SVG file in it**
 * 
 * we have fill with current color and the border of the div is current color and current color is a CSS keyword to look
 * at parent keyword and change the color if its hits the edge of the screen for the DVD SVG and the border around it**
 * 
 * we have step which lets us move at a consistent speed ragrdless of software for our x and y and we 
 * bounce from the edge of the screen if we are at the minimum or maximum x and y position and bounce changes the 
 * color of the DVD and it lets us bounce (math.random times a big number is just all F's as a number and colors
 * are a number between 0 and 16777215 then we convert that to a bse 16 string and gives us digits and A-F and if we got 0 
 * then it wont be 6 characters because)** (so we add 0's so we get 6 digits no matter what)** (why do we need 6 digits)**
 * 
 * to add SVGS we just make an image tag with .svg, but we cant alater anything inside the SVG if we use this method but the other
 * way is just include the SVG data in our HTML like setting the fill and we can make ID's and we cna target the ID with code and CSS
 * to target just that part of the SVG but the downside is that if we want the SVG to show up in multilpe areas we have to copy and paste
 * it wherever we want to ues it**
 * 
 * HOW TO TAKE VITE IN LOCAL HOST TO PUT IT ON WEB SERVER ON PEOPLE.RIT.EDU:
 * 
 * vite has been working as a local dev server but when we do npm run build it takes our project files and compiles them and 
 * puts it into a src/dist which has HTML,CSS, JS, and other files such as audio or images then we take the folder
 * and put it onto banjo**
 * 
 * by default for the npm run build is that it just goes to people.rit.edu but we have our name on there
 * to get to our own files and to get around that we need to tell vite to use this
 * base URL and we edt our pakacage.JSON to include the base URL and if we dont have this nothing will work except the HTML**
 * 
 * when we say npm run build then it will work on our brwoser (TSC is TS compiller and if there are errors we cant build) it then
 * generates out HTML, CSS, JS, and our other files (if we had a bunch of libraries in our build and if its in our JS 
 * and the has is based on the content and if the content or hash does not change then)**
 * 
 * it remembers what the files were and it remembers that hash and it will point to the new hash and it lets us make sure we have 
 * the latest code**
 * 
 * if we have more than 1 HTML files vite does not know about the extra HTML files and was not linked directly from
 * our INDEX.HTML and roll up is what lets us build with our additional HTML files and we say there is a main index.HTML
 * and the dvd.HTML which tells vite there is more than 1 HTML** (same for CSS and JS)**
 * 
 */