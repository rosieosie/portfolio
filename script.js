// Home page spinners image duplication -------------------------------------------------------------------------------
// Adapted from https://codepen.io/kevinpowell/pen/BavVLra?editors=1010
let reduplicated = false;
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
            duplicatedItem.classList.add("duplicate");
            spinnerInner.appendChild(duplicatedItem);
        });  
    });
};



// Centre first 3 images in spinner & centre text div---------------------------------------------------------------------------------


function calcSpinners() { 
    spinners.forEach((spinner) => {

        const spinnerInner = spinner.querySelector(".spinner-inner");
        const image = spinnerInner.querySelector("#image");
        const imageWidth = image.clientWidth;
        
        // 16 =  1rem gap
        const totalImageWidth = imageWidth * 3 + 16 * 2;
        const centreCalc =  (totalImageWidth - document.documentElement.clientWidth) / 2;

        if (spinnerInner.classList.contains("reverse")) {
            spinnerInner.style.right = centreCalc + totalImageWidth + 16 + "px";
        } else {
            spinnerInner.style.left = "-" + centreCalc + "px";
        }

        //Calc correct distance for smooth spin
        spinnerInner.style.setProperty("--distance", centreCalc * 2 + "px")
    });
};

function getImageWidth() {
    let index = 1
    spinners.forEach((spinner) => {
        const spinnerInner = spinner.querySelector(".spinner-inner");
        const image = spinnerInner.querySelector("#image");
        const imageWidth = image.clientWidth;
        document.body.style.setProperty(`--width-${index}`, imageWidth + "px");
        index++;
    });
}

window.onload = (e) => {
    calcSpinners();
    reduplicateImages();
    getImageWidth()
}



let prevWidth = window.innerWidth;
window.addEventListener('resize', function() {
    let width = window.innerWidth;
    if (width !== prevWidth) {
        prevWidth = width;
        if (width > 1844) {
            console.log(width);
            if (!reduplicated) {
                reduplicateImages();
            }
        }
        calcSpinners();
    }
});

function reduplicateImages() {
    spinners.forEach((spinner) => {
          const spinnerInner = spinner.querySelector(".spinner-inner");
          const spinnerContent = Array.from(spinnerInner.children);
          spinnerContent.forEach((item) => {
                if (!item.classList.contains("duplicate")) {
                    const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute("aria-hidden", true);
                spinnerInner.appendChild(duplicatedItem);
                }
                
            
          });  
      });
    reduplicated = true;
};