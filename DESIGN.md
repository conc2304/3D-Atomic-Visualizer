## 1. Introduction

For this final project in CS50, my primary objective was to learn to how to develop an interactive web application in 3D as well as to explore UI/3D animation techniques.  The project originally started without a real objective; I simply wanted to make a 3D carousel of items in which the carousel items animation user interaction as well as for transitioning states. To top it off, it was my goal to  learn to build user interfaces similar to how it would be done in a professional setting, using React.js' paradigm around user interface development (more on that soon). To that end technical design decisions were centered around delivering higher level features and components and avoid reinventing the wheel. 

## 2. Technical Choices
Choice of libraries or frameworks (e.g., why React? Why a particular state management library?).
Explanation of important packages and their roles in the project.

### FrontEnd TechStack:
- Languages: Typescript/Javascript.
- Frameworks & Libraries: 
  - [React](https://react.dev/) 
    - A javascript library developed by Meta (ex Facebook) for buildint user interfaces and single page applications using component driven architecture.
  - [Three.js](https://threejs.org/) 
    - Cross-browser javascript library and API for creating and rendering 3D graphics in the browser using WebGl (WebGraphicsLanguage) 
  - [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
    - A javascript abstraction library built on Three.js that uses React's component driven patterns and hook system to render WebGl components.
  - [React Three Drie](https://github.com/pmndrs/drei)
    - A javascript abstraction library of with utilities to reduce builerplate code in React Three Fiber applications.
  - [React Spring (for Three.js)](https://www.react-spring.dev/docs/guides/react-three-fiber)
    - An javascript animation library that works with React Three Fiber to produce "spring" based motion using physics instead of easing functions.
  - [Material UI](https://mui.com/)
    - A javascript UI library/framework that provides mid-low level React components and design system architecture.
  - [ColorTranslator](https://www.npmjs.com/package/colortranslator)
    - A javascript utility library used for converting colors from and to various formats to help standardize color input for libraries that only take certain color values.
  - [lodash](https://lodash.com/)
    - A javascript utility library to handle low level utilities.
  
- Bootstrapping: [Create React App](https://create-react-app.dev/)
  - A command-line tool from Facebook for standing up React application. It bakes in modern build tools and configurations and sets a basic project structure.
  

### Design Decisions:
**Typescript**\
The primary drivers for the technical stack decisions was to use first and foremost use Typescript and React.  The motivation for this come from professional experience of having worked with both in the past. The combination brings tremendous gains to the developer experience with benefits from how Typescript integrates IDEs like VSCode.  With Typescript (in combination with ESLint), the IDE is able to perfom autocompletion, highlighting error, and displaying expected types when interfacing with vendeor APIs that have typescript supprt.  The other major benefit of using typescript is that it creates "self-documenting code".  By that I mean that the type annotations and interfaces to be able to quickly understand the shape of datastructure, the types for function parameters, as well as their expected return value.

**React**\
The second, and equally as important, design decision was to use React as the development framework of choice. React is built for modularity and reusability, its patterns encourage being reusable components that can be easily reconfigured through props. The modularity of it helps to keep component any component from doing too much and reaching too far.  With a lot of vanilla javascript applications, it becomes hard to keep track of what components are connected to each other and how they may affect eachother.  With react's component pattern there is a clear data flow that is unidirectional going from parent to the child and events are bubbled up from child to parent. Of note we are using React's functional component design pattern which was introduced in React 16 which leave the class bassed component pattern to pursue functional programming paradigms.

**React Three Fiber**
Because I wanted to buld an interactive 3D application, React Three Fiber was the first choice since it take out alot of the boilerplate that comes with standing up a Three.js scene.  This allowed me eto focus on building interactive 3D components and focusing on user experience features rather than implementation details.

**React Spring**
Used for animation. It is implemented with the useSpring() hook and then those values are applied to a decorated animation component "<animated.div />" that handles updating and interpolating between the old and new value.
We use this to trigger more interesting user interactions.

### React Primer/Glossary
These are concepts that are foundational to React component development.
So rather than explaining them everytime they are used, I will explain it here once.

Hooks : functions that let you "hook into" React state and lifecycle features from function components.

  - useState:  adds state management to a functional component.  It returns and array with the current state and a function to update it.
```ts
const [count, setCount] = useState(0);
```
- useEffect: handles component lifecycle methods. Think of it like instruction on what to do when the component is initialized or unitialized.  It is also useful for watching to changes in state and recalculating derrived values only when that count depencency changes
```ts
useEffect(() => {
  // whenever count changes, useEffect gets called
    document.title = `Clicked ${count} times`;
}, [count]);

```
  
- useRef: returns a reference to the object that it was attached to. It is used to access DOM elements directly.
  ```ts 
  const inputEl = useRef(null);
  ...
  <input ref={inputEl} ... />
  ```

- useMemo: used to memoize calculations and values and will only recompute when one of its dependencies changes
```ts
const expensiveValue = useMemo(() => {
    computeExpensiveValue(depA, depB);
}, [depA, depB]);
```

- memo: not a hook, but still a react concept.  It is a higher order compenent that is used to ensure that a prop only rerenders when its props have changed. Typically, whenever a component re-renders, every child component will rerender regardless of if its props have changed.

### React Component Anatomy

```ts
// type definition for props
type HelloWorldProps = {
    name: string;
    lastName?: string; // optional prop
};

const HelloWorld = (props: HelloWorldProps):JSX.Element => {
  // if lastName is not set then default to "Unknown"
  const {name, lastName ="Unknown"} = props; 
  return <h1>Hello, {name} {lastName}</h1>;
}

// implementation
<div>
  <Hello World name="Jose" />
  <Hello World name="Jose" lastName="Conchello" />
</div>
// If a component has no children then it can be used as a self closing tag
```

#### What is JSX
**JSX** stands for "Javascript XML". It is a syntactic sugar, primarily used in React to describe components. One main difference is that JSX uses camelCasing for properties unlike HTML's kebab-case. Another difference is the ability to use template strings inside of the JSX to express variable values.



## 3. Architecture
### Overview of the project's structure.

All of the source code for the project is located in the `./src` directory of the root folder. Anything not directly named was generated by Create React App in it's bootstrapping process.

* -> Generated by Create React App
```txt
project-root-directory/
│
├── src/
│   ├── components/
│   │   ├── atom/
│   │   │   ├── index.tsx 
│   │   │   ├── electron.tsx 
│   │   │   ├── nucleus.tsx
│   │   │   └── utils.ts 
│   │   ├── carousel/
│   │   │   └── index.tsx 
│   │   ├── element/ 
│   │   ├── scene/ 
│   │   │   ├── background.tsx
│   │   │   ├── floor.tsx 
│   │   │   └── index.tsx 
│   │   └── ui/
│   │   │   ├── search.tsx 
│   │   │   └── text.tsx 
│   │
│   ├── assets/
│   │   └── Arkitech_Bold.json  // JSON converted font for WebGL
│   │
│   ├── index.tsx * 
│   ├── index.css * 
│   ├── app.tsx
│   ├── app.css
│   ├── types.ts  // shared type definitions
│   └── constants.ts // shared application constants
│
├── public/ *
│   ├── index.html
│   └── favicon.ico
│
├── .gitignore *
├── package.json * but augmented with new dependencies
└── README.md
└── DESIGN.md
```

### File Overview / Table of File Contents
#### Description of the main components and their interactions.
<!-- Atom -->
- src/components/atom/index.tsx 
  - parent responsible for assembling atom structure and visualization
- src/components/atom/electron.tsx : 
  -renders the electrons of atom as Mesh Geometries
  animates their orbit
- src/components/atom/nucleus.tsx : 
  - renders the nuclues of atom as Mesh Geometries
- src/components/atom/utils : 
  - helper functions for atom building

<!-- Carousel -->
- src/components/carousel/index.tsx :
  - responsible for rendering the placement and orientation carousel items 
  - bubbling events to parents for state management
  
  <!-- Element -->
- src/components/element/index.tsx :
  - element tile that is the primary user intaction point
  - Responsible for displaying periodic element data as 3D Tile
  - rendering the atom visualizer
- src/components/element/infoModal.tsx :
  - Pop up modal that shows textual details about an element
  - is triggered by clicking on the info icon in ./index.tsx

<!-- Scene -->
- src/components/scene/background.tsx :
  - renders the backdrop of the 3D scene as an animated mesh material
- src/components/scene/floor.tsx :
  - renders the floor of the scene as a reflective mesh material 
- src/components/scene/index.tsx :
  - The Great Orchestrator - 
  - Highest leve component and is responsible for assembling all of the pieces together. 
  - Fetches the periodic element  data that is passed down to the other components to render the ElementTiles and the Atom visualizer.
  - Recieves events from child components that updating state that is then passed back down to components to rerender with new props

<!-- UI -->
- src/components/ui/search.tsx :
  - Implementation of MUI Autocomplete component to search and select for a Periodic Element.  It bubble selection event to <Scene /> component to update the selected Element
- src/components/ui/text.tsx :
  - rendering component for text in 3D space



## 4. Data Flow & State Management
As with typical Flux State Management architecture pattern designed by the developers of React, where data flow is unidirectional. State is passed down through the application through a technique called prop drilling. And state is then updated by children component by bubbling up events to their parent props. This project was small enough that I did not need a large state orchestrator like React-Redux.


## 5. APIs & External Services
I am relying on "Bowserinator" github page to fetch the Periodic Table in json format to use in the app.
"https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json"
This is done in the use effect() call in the <Scene /> compontent.


## 6. Styling and Theming
Instead of using the traditional imported stylesheet approach that is conventionally taught. The use of global css/scss creates a lot of problems as projects scale where a change in one css file can accidentally have far reaching implications because it is not known at the time of development (whithout searching the codebase for implementations) what styles affect what components. So In this application we do a lot of inline styleing either through the style prop of a component or through the use of MUI's sx prop.  By inlining styles in our code we able to collocate the styles with the logic. This allows us to see everything we need to in one file anbd not have to have tons of files open at once. Additionally this allows for dynamic styling that is driven by state and props and renders it in an encapsulated way that is guarunteed to not affect other components accidentally.

