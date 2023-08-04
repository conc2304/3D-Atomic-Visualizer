
# 3D Atomic Visualizer
A Webgl based 3D user interface to visualize the atomic structure of elements on the periodic table and view their elemental properties.

## 1. Introduction
Author: Jose Conchello \
Course:  CS50 (Harvard Extention School Summer 2023) \
Project Title: 3D Atomic Visualizer \
Project Video: https://youtu.be/1rKQbis-Bmw \
Github Repo: https://github.com/conc2304/3D-Atomic-Visualizer \
Github Page: https://conc2304.github.io/3D-Atomic-Visualizer/ \

## 2. Quickstart Guide / Prerequisites
This project is built using Node.js. Therefore, you must have Node.js and npm installed on your computer. If you don't have Node.js installed, the project will not function as intended.

You can verify your installation by running `node -v` and `npm -v` in your terminal or command prompt. This project requires a node version of at least 16.0 and an npm version of at least 5.2 to run this 'Create React App'. If Node.js is not installed or is outdated, visit the [Node.js website](https://nodejs.org/) to download and install the latest stable release for your operating system.

**NOTE** \
It should be noted that some of the underlying Web APIs that drive the 3D WebGL engine may not be available in all browsers.  As such, this application has been developed using modern browsers.  It is recommended to view this application in a Chrome browser for best results.

The 3D interfaces have not been designed to be mobile responsive (out of scope for this project) and so it is recommended to view this application through a desktop (preferabbly fullscreen browser).

### Available Scripts

In the project directory, you can run:

#### `npm install`
You only need to do this once for the project before you serve or start the application.  This will install all of the necessary dependencies required to run this application.

#### `npm start`
You need to run this every time you want to relaunch the application.\
This command runs the app in the development mode.\
Once you have started or served the application with npm start, you open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 3. Overview of the project.
This project is an interactive 3D application whose purpose is to create an engaging and interactive space to visualize the atomic structure of elements. The primary drive of this application was to, as a CS50 student, learn a new web programming technique that leverages new web technologies to create dynamic and animated user interfaces in 3D. 

At a high level, this application is a 3D carousel of elements from the periodic table. The carousel allows a user to click through the different items in the carousel to bring them into focus. Each element tile is tied to an atomic structure visualizer.  

### Atomic Structure Visualization
The visualizer simulates any given element's electrons by adding the correct amount of electrons for each shell of the electron and orbiting them around the nuclus. For each atom we have its' electron configuration as a string like this one for Fluorine is "1s2 2s2 2p5". Electrons in atoms are found in areas known as "Orbitals", and orbitals are found within the various electron shells. Each energy level (or shell), has specific types of Orbitals that can be found in its shell  (s, p, d, f) referred to an S-Orbital Electron on so on. In this example of Flourine ("1s2 2s2 2p5") this means that there are 2 S-Orbital electrons in the first shell, 2 S-Orbitals in the second shell, and 5 additional P-Orbitals in the second shell. This gives us an atom with 2 electron shells, one with 2 electrons and one with 7 atoms. Technically speaking, these orbitals come in a couple varieties of orbital patterns that are more complex than a single plane rotation around the central point. But do to the complexity of those orbital patterns, I decided to visualize the atomic strcutre using the Boht Model.  The typical visualization of the Bohr model is a central nucleus with electrons orbiting it in concentric circles, kind of like planets orbiting the sun. Each circle represents a different energy level or shell.

### Application Features
The primary point of interaction is through the Element Tag component (referred to as 'Tile' from now on).

- Each element in the periodic table has a Tile that displays the element's name, symbol, and atomic number. 
  - For example Hydrogen | H | 1
  - Each tile has an info icon button as a question mark.
  - The focused element will have a 3D "icon" of an atom with 2 electrons in front of it.
  
- The carousel of periodic elements shows up to 5 elements at a time, keeping the active/focused item front and center facing the user. 
  
- The application starts with the first element of the periodic table focused in the carousel.
  
- A user can click on any of the inactive Tiles in the view to make that element the active carousel item.
  
- As a user selects a new item, the carousel is shifted in the direction of the click (unfortunately I did not have enough time to implement an infinitely scrolling carousel for this project so it does not loop around).

- There are hover states for all of the interactive elements. This is meant to help users know that the element to indicate that it is clickable.
  - The mouse cursor will change from a default cursor to a pointer for any interactive component.
  - The orange Tile will lighten in color on hover 
  - The info button on the Tile will scale in size and change color.
  - The atom "icon" at the foot of the active Tile, will scale in size
  - When the atomic structure is visualized, it will scale in size on hover.

- A user can click on the atom icon at the foot of the active tile to swith to the atomic structure visualizer. 
  - They can also click on the active tile to open the visualizer.
- When a user opens the atomic structure visualizer, all of the Tiles hide in order to make space for the visualizer.
- Clicking on the atomic stucture visualizer will close the visualizer and bring the Tiles back into view.

- Tiles that are inactive are rendered smaller and horizontally flat on the floor, while the active tile is larger, vertical, and up front.

- A user can click on the info icon ("?") of a Tile, in the upper right hand corner.  When they do, an info modal is overlaid infront of the screen that highlights, in text, more information to the user.
  - They can click outside of the modal to close it.

- A user can use the auto complete input field in the bottom right hand corner of the application.
  - This field allows users to search for an element by name or by dropdown and once selected it will update the currently selected carousel item to the item selected.

#### 3D Navigation
 A user can also navigate the 3D space with their mouse: rotate, zoom, and pan
  - Rotate: Click and drag the left mouse button over the application window to rotate around the target (center point).
  - Pan (left, right, up, and down) : Press and hold the right mouse button, then move the mouse to pan the camera in the direction of the mouse.
  - Zoom: Scroll up or down using the mouse wheel to zoom in or out.




Additionally, I aimed to learn to build user interfaces similar to how it would be done in a professional setting, using React.js' paradigm around user interface development. So to that end, I used [Create React App](https://create-react-app.dev/) to quickly bootstrap the application and focus on component and feature development. On 

 We are sourcing our data for the Elements on the Periodic table by fetching them from ["Bowserinator/Periodic-Table"](https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json).


