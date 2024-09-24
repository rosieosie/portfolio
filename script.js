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

// Soft body?!! -------------------------------------------------------------------------------------------------
let canvas;
let ctx;
let particle;

document.addEventListener('DOMContentLoaded', function(){ 
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight * 0.8;
    particle = new Particle(100, 100, 0, 0);
    particle.update()
    particle.checkEdges();
    particle.show();
    other = new Particle(200, 200, 0, 0);
    other.update()
    other.checkEdges();
    other.show();
    window.requestAnimationFrame(draw);
    // create array of particles in starting positions
})



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let gravity = new Vector(0, 0.3)
    particle.applyForce(gravity);
    particle.checkEdges();
    particle.update();
    particle.show();
    other.applyForce(gravity);
    other.checkEdges();
    other.update();
    other.show();
    let spring = new Spring(particle, other, 100, 0.01)
    spring.update();
    spring.show();
    window.requestAnimationFrame(draw);
}

// spring class adapted from https://www.gorillasun.de/blog/spring-physics-and-connecting-particles-with-springs/
class Spring {
    constructor(particleA, particleB, restLength, stiffness) {
        this.particleA = particleA;
        this.particleB = particleB;
        this.restLength = restLength;
        this.stiffness = stiffness;
        this.damping = 0.005
    }
    update() {
        let d = this.particleA.position.copy().subtract(this.particleB.position);
        let dst = d.magnitude();
        let deformAmount = dst - this.restLength;
        let restorativeForce = this.stiffness * deformAmount;
        let dir = d.copy().normalize();
        let f = dir.copy().multiply(restorativeForce);
        this.particleA.applyForce(f.copy().multiply(-1));
        this.particleB.applyForce(f);
        // add damping so that the springing slows to a stop
        let vel = this.particleA.velocity.copy().subtract(this.particleB.velocity);
        let dampingForce = vel.copy().multiply(this.damping);
        this.particleA.applyForce(dampingForce.copy().multiply(-1));
        this.particleB.applyForce(dampingForce);
    }
    
    show() {
        ctx.beginPath();
        ctx.moveTo(this.particleA.position.x, this.particleA.position.y);
        ctx.lineTo(this.particleB.position.x, this.particleB.position.y);
        ctx.stroke();
    }
}

class Particle {
    constructor(x, y, ax, ay){
        this.position = new Vector(x, y);
        this.velocity = new Vector (0, 0);
        this.acceleration = new Vector (ax, ay);
        this.mass=1;
        this.cWidth = canvas.width;
        this.cHeight = canvas.height;
    }

    applyForce(force) {
        let f = force.copy().divide(this.mass);
        this.acceleration.add(f);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.multiply(0);
    }

    checkEdges() {
        let bounce = -0.98
        if (this.position.x > this.cWidth) {
            this.position.x = this.cWidth;
            this.velocity.x *= bounce;
        } else if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x *= bounce;
        }
        if (this.position.y > this.cHeight) {
            this.position.y = this.cHeight;
            this.velocity.y *= bounce;
        } else if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y *= bounce;
        }
    }

    show() {
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, 50, 50, Math.PI / 3, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Add another vector to this vector
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    // Subtract another vector from this vector
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    // Multiply this vector by a scalar
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    // Divide this vector by a scalar
    divide(scalar) {
        if (scalar !== 0) {
            this.x /= scalar;
            this.y /= scalar;
        }
        return this;
    }

    // Get the magnitude (length) of the vector
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Normalize the vector to a unit vector
    normalize() {
        let mag = this.magnitude();
        if (mag > 0) {
            this.divide(mag);
        }
        return this;
    }

    // Get the distance between two vectors
    distance(v) {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Set the vector to have a specific magnitude
    setMagnitude(mag) {
        this.normalize().multiply(mag);
        return this;
    }

    // Limit the magnitude of the vector
    limit(max) {
        if (this.magnitude() > max) {
            this.setMagnitude(max);
        }
        return this;
    }

    // Create a copy of this vector
    copy() {
        return new Vector(this.x, this.y);
    }
    
    // Static method to create a vector from two points (useful in physics)
    static fromPoints(p1, p2) {
        return new Vector(p2.x - p1.x, p2.y - p1.y);
    }
}

// particle class - movement, edges
// string class
// body class 