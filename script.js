// Home page spinners image duplication -------------------------------------------------------------------------------
// Adapted from https://codepen.io/kevinpowell/pen/BavVLra?editors=1010

const spinners = document.querySelectorAll(".spinner");

// If a user hasn't opted in for recuded motion, then we add the animation
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
};

function addAnimation() {
    spinners.forEach((spinner) => {
      // add data-animated="true" to every `.scroller` on the page
      spinner.setAttribute("data-animated", true);
        

    

        // Make an array from the elements within `.scroller-inner`
        const spinnerInner = spinner.querySelector(".spinner-inner");
        const spinnerContent = Array.from(spinnerInner.children);
    
        // For each item in the array, clone it
        // add aria-hidden to it
        // add it into the `.spinner-inner`
        spinnerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden", true);
            spinnerInner.appendChild(duplicatedItem);
        });


        
    });
};


// Centre first 3 images in spinner ---------------------------------------------------------------------------------

let image = document.querySelector("#image");
let imageWidth = image.clientWidth;

// 16 =  1rem gap
let totalImageWidth = imageWidth * 3 + 16 * 2;
let centreCalc =  (totalImageWidth - window.innerWidth) / 2
let left = "-" + centreCalc + "px"

document.querySelector('.spinner-inner').style.left = left;
//Calc correct distance for smooth spin
document.querySelector('.spinner-inner').style.setProperty("--distance", centreCalc * 2 + "px")
