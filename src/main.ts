import './reset.css';
import './styles.css'; //how does it know to import styles if there was no export in styles****

const pipButton = document.querySelector('#pipButton') as HTMLButtonElement;
const dropButton = document.querySelector('#dropButton') as HTMLButtonElement;
const colorOutput = document.querySelector('#colorOutput') as HTMLDivElement;
const placeholder = document.querySelector('#placeholder') as HTMLDivElement;
const clipButton = document.querySelector('#clipButton') as HTMLButtonElement;

//is there a method name for the way to open multiple tabs for the dvd file because here we have pip so what was the term
//for the way we opened multiple tabs in dvd file****

//for pip we can have one tab, it will go on top of the other tabs we open, and it will close when the main tab closes****
//for multiple tabs we can have multiple, they will not lay on top of the current tab, and the popups will remain if we close
//the main tab but will not apply any of the JS to it (to move and in general if we close the main tab on popup multiple windows)****

//does the window element represent our whole brwoser only in the current window we are in
//the window element is the root element of the browser and it ends up being representative of the browser window,
//the html document, or events on the browser itself (the ones specific to the browser not the events we create 
//with add event listener or onclick)****,
// the navigator, picture and picture, and where things on the global scope are
//which means anything on that window (if we write in the console and make a var banna and if we say window.banana we get that
//var value back)**** (even if we just declare banana it would return)****
//when we open our dvd windows they have a different window and its a different window context and we have the window
//proxy for the dvd and its a reference to another window (this allows us to communicate between the pop ups and the main window)
//so each window is not related to the other (not even the main window or only to do the opening and closing of windows and keep
//the count of windows open or)**** for dvds but for pip if we open the new window its a copy of the main window
//and we pass information from the main window to the pip and vice versa and each window is related to each other****

const handleColorRequest = (win: Window) => {
  // check for browser support
  // the eye dropper and everything else on slides 
  // is a web API, or native API that comes with the browser and libraries are things we load through npm
  // and network API's are third party API's (like pokemon API, and API's where we call out to a server) 
  if (!win.EyeDropper) {
    colorOutput.innerText = 'Your browser does not support the EyeDropper API';
    return;
  }

  // create an EyeDropper
  //this allows us the create the eye dropper on the window
  //we need the () because we are creating an instance of the eyedropper class
  const eyeDropper = new win.EyeDropper();

  //eyeDropper.open().then((result) => { // do stuff }).catch((e) => { // handle error })
  //try { 
  // const result = await eyeDropper.open()
  // // do stuff
  // } catch (e) {
  // //handle error
  // }
  //we have .then() with a callback and the second one hides the callback (but the callback is still there) with the await keyword
  //the result is what gets returned by the await or then (these two are equal)(still pauses executaition and waits until
  //we are done then keeps going for both)

  // trigger the EyeDropper
  eyeDropper
    .open() //the eyedropper is then opened and it returns a promise as a result of opening it 
    .then((result: { sRGBHex: string }) => { 
      //so when we click the button to open the eyedropper it opens but how does it handle if we click to get a color does it stay
      //in this .then the whole time when we have the eyedropper open to get the colors and display them****
      // once we have a result
      // update the text display
      colorOutput.innerText = result.sRGBHex;
      // set the interface's background color
      (colorOutput.parentElement as HTMLElement).style.backgroundColor =
        result.sRGBHex; //is parentElement built in and would it be the interface div how does it know
        //to only include the color in that box is it because of the div being a block element and doing the color in that whole div
        //(yes) it changes the color of the div**** (why do we say HTMLElement and not put div with it because the interface is a div)****
    })
    .catch((e) => {
      colorOutput.textContent = e; //if we cant get the color then there could be an error
    });
};

//eye dropper and picutre and picture return a promise and the clipboard does not so we need a promise for it** 
//whenever we use the clipboard do we have to use navigator (does bluetooth, clipboard, etc.)
const handleCopyRequest = async (win: Window) => {
  try {
    // write some text to the clipboard
    await win.navigator.clipboard.writeText(colorOutput.innerText);
  } catch (e) { //what would be an error would it be if there was no color output (yes)**
    //just the ______ when we start the browser (it would save to ourclipboard if we just had the ______ as well)
    console.error(e);
  }
};

const setupListenersFor = (win: Window) => {
  // using .onclick instead of .addEventListener because:
  // .onclick - the button only has one handler that gets overwritten
  // .addEventListener - the button can have several listeners for the same event, we don't want duplicates!

  //onclick is a property and when we set it then it gets overridden (if we have one button and we have 4 functions
  //then if we have an onclick and click a button it would use the most recent method we connected the button to)(1 funciton only
  //for one click)(which is the most recent function)****
  //when we have addeventlistener if we click it once the button will do all 4 functions will run (is this if we have the same
  //button attached to these different methods for onclick and addeventlistener or how would that work)****

  //couldnt we have done addeventlistener here because we have different buttons and they would both
  //call different methods so how would it duplicate****

  clipButton.onclick = () => {
    //we pass in the current window into these methods (yes)
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
  //we get the window HTML and create a style element in it 
  const pipStyle = win.document.createElement('style');
  //copy the text over
  //copy all of the styles and put it into the style element we just created and append it to the 
  //body of our picture and picture window
  pipStyle.innerText = styles.innerText;
  // add the <style> to the PiP window's DOM
  win.document.body.append(pipStyle);

  //we would duplicate the html and instead of moving the content like we do with the pip button event handler
  //we could generate html and append that directly (we would make another html for the pip then apply it when the button is clicked)
  //we would have to build the HTML in JS and instead of appending it to the main document we would append it to the pip
  //document)(so would it be seperate HTML or within the JS make the HTML why would we do that)**
};

//so eyedropper is the only one that returns a promise and for window and clipboard we have to create our own
//promise**** (difference between promise for pip window and clipboard)****
pipButton.addEventListener('click', async () => {
  // one way to get around using an unsupported property with TypeScript is
  // to cast it "as unknown as any" - then it can be anything!
  // it can be just any if we wanted 
  if (!(window as unknown as any).documentPictureInPicture) {
    //if the window as not return the picture in picture then it returns a message to say the browser does not support
    //the picture in picture mode
    colorOutput.innerText = 'Your browser does not support the PiP API';
    return;
  }

  // request a PiP window (async/await)
  //so pip and eye dropper only return promises by default without having us to say async in method signature
  //and clipboard (handlecopyrequest) does not so we have to make a promise ourself for it
  //thats why we dont need an async for pip window and eyedropper but we do for clipboard)
  //this is when we want to actually wait for the pip to load in if its supported whereas above 
  //its is not supported or cant load the pip in
  //we wait until the window is finished being requested here if its supported (until the pip fully loads in)
  //picture and picture does not open another window like another dvd but it opens it from
  //request window and this makes it stay on top of everything and it does not have a navigation bar (also responsible
  //for having one window open at a time)(we dont have control over size and placement of picture and picture)
  const pipWindow: Window = await (
    window as unknown as any
  ).documentPictureInPicture.requestWindow();

  // copy some CSS from the main window to the PiP window
  // its copying everything in the style element on the main page but there is still the styles.css and the 
  // reset.css that are not part of the copy over and it only copies from the HTML
  // how would we copy from the styles.css and reseet.css**
  copyStyles(pipWindow);

  //this gets the interface element which is all of our content but when we say content.parentElement 
  //how is it a div because if we get the parent of the interface div wouldnt that be the body (yes and we can say HTML body element)
  const content = document.querySelector('#interface') as HTMLDivElement;
  const parent = content.parentElement as HTMLDivElement; //HTMLBodyElement

  // move the interface into the pipWindow
  // here we get the html (before we got the CSS only)**
  pipWindow.document.body.appendChild(content);
  // reset the event handlers
  // why do we reset the event handlers if we move the interface from the browser to the pip 
  // we assign the onclick handlers so they are getting overridden or repalced and it gets put it a new
  // window and we need the window to talk to the eye dropper and the clipboard (it reassigns the window to pipwindow for
  // the click event handlers)**
  setupListenersFor(pipWindow);
  // show the placeholder
  // in styles.css we have the placeholder none so we do display flex here to override that (we did not need
  //the styles.css)
  placeholder.style.display = 'flex';
  //does this go ontop of our interface in the main window or does it replace whats there**
  //could we have just not had this to have our data show up in main window too when we opened pip window**

  // when the PiP closes
  // is page hide built in and only used with pip (used for other purposes as well)
  // so this accounts for when we close the window ourselves right**
  pipWindow.addEventListener('pagehide', () => {
    // put the content back in the main window
    // can we say parent.document.body.appendChild(content); or why would we only say append child only here (parent is the body
    //already thats why)
    //the content knows who the parent is and we just reassign the parent back to the parent (so whenever we have the .parentElement
    //keyword we dont need to write document. along with it when using the variable that holds the .parentElement)**
    parent.appendChild(content);
    // reset the event handlers
    setupListenersFor(window);
    // hide the placeholder
    // we hide the placeholder that says the pip window is opened
    // display is built into CSS to show (flex or)** or hide (none) something (could we have used a classList as well in HTML 
    // for the placeholder)**
    placeholder.style.display = 'none';
  });
});

//set up the event listeners intiially when the page loads (why would we do this initially)
//window is the current window so we just have window available on the global scope for free 
//so window always represents the main window (the bigger window) no matter what right it won't reference the pip window
//if we have it opened right when we say window**
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
 * when the parent is closed does the picture in picture also close here (yes)**
 * 
 * and we have a color picker and we can find a pixel for a color and it works outside the browser window and gives us color 
 * on our task bar and our home screen if we wanted (how is that part of the eyedropper tool)** 
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
 * let it work on the window (where did we do this specifically was it when we said as unknown as any what does this do
 * why couldnt we say any) (yes)(so in regular JS the eyedropper works on the window)**
 * 
 * what does it mean by defintions for non-mainline feature for eyedropper on slide 4 (does this mean since the eyedropper
 * does not exist in TS as a mainline element we have to make a definition for it)**
 * main controls the eyedropper in terms of launching it and changing the interface element based on the color we chose
 * as well as the launchin and using the pip right**
 * the eyedropper TS lets us use eyedropper properties and the eydropper itself in TS since its not defined in TS**
 * 
 * what does system level mean in slide 4**
 * 
 * CLIPBOARD:
 * 
 * read: lets us read rich information (structured markup, image files)
 * readtext: reading only strings (text)
 * 
 * write: write any string into the**
 * writetext: encode the**
 * 
 * stick with readtext and writetext usually because working with strings is easier and it gets complicated if we work with
 * read and write only** (how does it get complicated)** (slide 5)**
 * 
 * 
 * INDEX.HTML:
 * 
 * we have a style element in the head because as we open the picture and picture it loses the styles for that
 * window so we can grab the id from the styles and apply the styles in the picture and picture button** (why does it lose
 * its styles when we open pip and open it back up in the main browser when we exit pip)(I thought we just copied the 
 * styles over how does it lose the styles)**
 * 
 * we have a placeholder div thats hidden (how is it hidden because we dont give it a classlist 
 * in the HTML (we say display: none in CSS)) but when we open the picture and picture it gets shown (it gives the interface
 * to the other window and shows the interface on the new window)(in reality it)**
 * why do we transfer the data over to the pip or to the main window and not just copy the data over instead**
 * 
 * are web API's restful (same for third party API's and libraries)**
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
 * eye dropper properties****
 * 
 * WINDOW MOVEMENT:
 * 
 * to open child windows (these windows dont stay on top of everything else and dont leave when we close parent 
 * window and we can have multiple child windows with these new mtethods instead of 1)(when we close the parent
 * window the children remain but they dont move why)**
 * 
 * for picture in picture it stays on top of all the other tabs, we can only have 1 pip, and the pip will close
 * when parent tab is closed**
 * 
 * we can have DVDs and we can have the DVD screens go around the window and bounce off the bounds 
 * we could also close all the windows and they could go away when we open multilpe windows (the main window keeps 
 * track of all the children and close them if needed by using request animation frame to change their 
 * position each frame and close them if needed)****
 * 
 * for slide 6 the window represents the variable we have for window and we can open a window, 
 * move the window to a specific location (all at one time or like an animation but it needs the elapsed time and the current time
 * which is the request animation frame), close the window with close(), and closed returns true if the window is closed or false 
 * if the window is not closed** (is there not an opened to say true if its opened or false if its not)(there is no opened)
 * 
 * go over currentColor (slide 6)**
 * does svg inline refer to the path we made with the svg tag in our dvd and that allows us to add 
 * CSS to it and edit the SVG however we want**
 * does svg as <img> refer to putting the svg as an image tag but we can't add styles to it**
 * for closures is that just defining variabes (and methods)** with let and const inside of a class (or var too)** and**
 * 
 * DVD BRANCH:
 * 
 * why was it that when I created a new dvd it got bigger and bigger as it when around the screen and it mostly stuck
 * to the bottom of the screen**
 * 
 * MAIN.TS:
 * 
 * we have our buttons we seeclted from the HTML and we have an array of DVD objects and whenever we click the add button
 * it makes a new DVD and adds it to the array and adds it to the count on the parent window**
 * 
 * if we want to close eveyrthing we get each child and close it (this was the loop at the bottom of main.ts)**
 * 
 * we have drive windows which uses the previous time stamp and time stamp (current)**
 * to use how much time has elapsed and gives us a number of ms between 
 * each frame and we can use that to have our movement be consistent (per second because here we measure ms)**
 * rather than per frame (consistent across all softwares) and we close everything when we are done (we click the close all button
 * on the parent browser)**
 * 
 * main is more a manager and DVD.TS is under the hood whats happening and the functionality of how eveyrthing works****
 * 
 * DVD.TS:
 * 
 * we can use the funciton scope of let and const to trick TS into making things like private properties (we have proxy, height
 * x,y,etc. that we dont want to define outside the interface or class)** (does var also count or no or how does scope
 * work in classes for var because its rather function or global scope)****
 * if we use var in classes is that only the class scope or no** 
 * 
 * at down at the bottom of the DVD.TS it returns the things main will be aware of otherwise eveyrthing else is hidden inside 
 * of the funciton closure (or class closure)**
 * 
 * and down below that we have an interface to describe what we need to return to main so we make sure to return everything to main
 * we need to and nothing more or nothing less**
 * 
 * initwindow sets the width and height and gets the maximum and minimum x and y postion for the window and if our task bar
 * was on the bottom then**
 * 
 * we pick a starting speed and we multilpy by 1 or negative so we can have up or down or left and right movement (we only multiply
 * by negative 1 though so if we hit the bottom wouldnt it keep going at the bottom and not 
 * move towards the top in the oppossoite direction)****
 * 
 * we can then open the popup which is the proxy for a random width and height**
 * 
 * DVD.HTML:
 * 
 * we get reset CSS and we add some styles in the HTML rather than making a CSS file and we have a DIV with an SVG file in it**
 * why did we do reset CSS here how do we know when to use reset CSS in other files**
 * 
 * we have fill with current color and the border of the div is current color and current color is a CSS keyword to look
 * at parent keyword and change the color if its hits the edge of the screen for the DVD SVG and the border around it**
 * 
 * we have step which lets us move at a consistent speed ragrdless of software for our x and y and we 
 * bounce from the edge of the screen if we are at the minimum or maximum x and y position and bounce changes the 
 * color of the DVD and it lets us bounce (math.random times a big number is just all F's as a number** and colors
 * are a number between 0 and 16777215 then we convert that to a base 16 string and gives us digits and A-F and if we got 0 
 * then it wont be 6 characters because)** (so we add 0's so we get 6 digits no matter what)** (why do we need 6 digits)**
 * 
 * to add SVGS we just make an image tag with .svg, but we cant alter anything inside the SVG if we use this method
 * (like CSS and what else)** but the other
 * way is just include the SVG data (tag)** in our HTML like setting the fill and we can make ID's and we can target the ID with code and CSS
 * to target just that part of the SVG but the downside is that if we want the SVG to show up in multilpe areas we have to copy and paste
 * it wherever we want to ues it****
 * 
 * go over svg in an image element (block or inline).vs. and svg being inline and what the differences and similarities are (slide 6)**
 * 
 * HOW TO TAKE VITE IN LOCAL HOST TO PUT IT ON WEB SERVER ON PEOPLE.RIT.EDU:
 * 
 * vite has been working as a local dev server but when we do npm run build it takes our project files and compiles them and 
 * puts it into a src/dist folder which has HTML,CSS, JS, and other files such as audio or images then we take the folder
 * and put it onto banjo** (is this folder within our project folder usually)** (slide 8)**
 * 
 * by default for the npm run build is that it just goes to people.rit.edu but we have our name on there
 * to get to our own files and to get around that we need to tell vite to use this
 * base URL and we edit our package.JSON to include the base URL and if we dont have this nothing will work except the HTML**
 * so do we only have to add our name to our package.JSON or what exaclty do we have to add onto it** (slide 9)**
 * 
 * when we say npm run build then it will work on our browser (TSC is TS compiller and if there are errors we can't build) it then
 * generates our HTML, CSS, JS, and our other files (if we had a bunch of libraries in our build and if its in our JS 
 * and the has is based on the content and if the content or hash does not change then)** (slide 10)**
 * 
 * so basically to fix our link we have to change it in the package.JSON and edit the build command or just edit the 
 * JSON file (slides 9-10)**
 * 
 * what does it mean by smooshes for slide 8 does it make it like a zip file or**
 * 
 * for slide 10 when it says rerun the build if we do this the first time (edit out package.JSON to follow the
 * right url)** we dont have to rerun the build right**
 * 
 * it remembers what the files were and it remembers that hash and it will point to the new hash and it lets us make sure we have 
 * the latest code** (what does this mean and what is the hash)** (slide 9-10 or slide 11-12)**
 * 
 * for slide 12 if we did the roll up options first we dont need to rerun and we can just run it once right**
 * 
 * if we have more than 1 HTML files vite does not know about the extra HTML files and will not show them
 * in the output and will always show index.html by default only** and (dvd.html)** was not linked directly from
 * our index.html** and roll up options is what lets us build with our additional HTML files and we say there is a main index.html
 * and the dvd.HTML which tells vite there is more than 1 HTML (do we always need to specify a main: what if we dont does it 
 * assume index.ts is the main)** (same for CSS and JS or can vite detect multiple files in those
 * cases)**(can we put any name for before the : to define our HTML files or how do we know what to put) (slides 11-12)**
 * (do we always need a main: then the main file then after the name: can be whatever we want for the other files or)**
 * 
 * for slide 10 how do we know what the path will be for our data where do we start creating our path**
 * 
 */