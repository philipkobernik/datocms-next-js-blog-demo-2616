let node_size = 100; //initial
let spacing_distance = 0;

let nodes = [];
let global_hashtags = [];

class Hashtag {
  constructor(p5_, name_) {
		this.p5 = p5_;
    this.name = name_;
		this.textSize = 15;
		// TO DO: Fix overlapping
		this.position = this.p5.createVector(  this.p5.random(spacing_distance * 1.5, this.p5.width - spacing_distance * 1.5), this.p5.random(spacing_distance * 1.5, this.p5.height - spacing_distance * 1.5)  );
    this.isDragged = false;
  }
  
  getName() { return this.name; }
  getPosition() { return this.position; }
  getDragged() {return this.isDragged; }
  
  setPosition(p) { this.position = p; }
  setDragged(b) {this.isDragged = b; }
  
  display() {
		this.p5.fill(0);
		this.p5.noStroke();
    //this.p5.textSize(this.textSize);
    //this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    //print("name: " + this.name + " x: " + this.position.x + " y: " +  this.position.y);
    this.p5.text(this.name, this.position.x, this.position.y);
  }
  
  checkPositions() {
    if (this.p5.mouseX >= this.position.x - this.textSize * 2 && 
				this.p5.mouseX <= this.position.x + this.textSize * 2 && 
				this.p5.mouseY >= this.position.y - this.textSize && 
				this.p5.mouseY <= this.position.y + this.textSize) 
    {
      this.isDragged = true;
    }
  }
}

class Node {
	constructor(p5_, coverImage_, title_, authors_, hashtags_, date_, project_description_, slug_) {
		this.p5 = p5_;

		this.coverImage = coverImage_;
		//this.coverImage = this.p5.loadImage(coverImage_); //image object
		this.title = title_; //string
		this.authors = [];
	//	for (var i = 0; i < authors_.; i++) {
		this.authors.push(authors_); //array of strings
		//}
		// console.log(this.authors);
		this.date = date_; //string
		//this.shortDescription = shortDescription_; //string
		this.project_description = project_description_; //string
		//this.medium = medium_; //array
		//this.category = category_; //string
		this.hashtags = []; //array
		for(var i = 0; i < hashtags_.length; i++){
			var found = false;
			this.hashtags.push(hashtags_[i]["name"]);
			//set the global hashtag array
			for (var j = 0; j < global_hashtags.length; j++) {
				if (global_hashtags[j].getName().includes(hashtags_[i]["name"])) {
					found = true;
				}
			}
			if (!found) {
				console.log("new hashtag added");
				global_hashtags.push(new Hashtag(this.p5, hashtags_[i]["name"]));
			}
		}

		this.slug = slug_; //string

		// for (var i = 0; i < imageGallery_.length; i++) {
		// 	let img = this.p5.loadImage(imageGallery_[i]);
		// 	this.imageGallery.push(  img  );
		// }

		// this.lab_affiliation = lab_affiliation_;

		// set random initial positions
		this.position = this.p5.createVector(  this.p5.random(spacing_distance, this.p5.windowWidth-400 - spacing_distance), this.p5.random(spacing_distance, this.p5.height - spacing_distance)  );
		this.velocity = this.p5.createVector(this.p5.random(0, 1), this.p5.random(0, 1));
		this.acceleration = this.p5.createVector(0, 0);
		this.direction = this.p5.createVector( 1, 1 );
		this.size = node_size;
		this.alpha = 255;
		this.line_alpha = 50;
		this.color = [50, 124, 155];
		this.is_clicked = false; //are we in project mode or homepage mode?
	}

	//getters
	getPosition() { return this.position; }
	getHashtags() { return this.hashtags; }
	getLineAlpha() { return this.line_alpha; }
	//getLabAffiliation() { return this.lab_affiliation; }
	getTitle() { return this.title; }
	getAuthors() { return this.authors; }
	getSize() { return this.size; }
	getVelocity() { return this.velocity; }
	getAcceleration() { return this.acceleration; }

	//setters
	setLineAlpha(l_a) { this.line_alpha = l_a; }

	setClick() { this.is_clicked = !this.is_clicked; }

	inverseX() { this.direction.x *= -1; }
	inverseY() { this.direction.y *= -1; }
	getDirection() { return this.direction; }

	update() {
		this.velocity.add(this.acceleration);
		this.acceleration = this.p5.createVector(0, 0);
		this.velocity.mult(this.direction.x, this.direction.y);
		this.position.add(this.velocity);
		this.velocity.mult(0.1);
		//this.velocity = this.p5.createVector(0, 0);
		//console.log(this.velocity);
		//this.velocity = this.p5.createVector(0, 0);

		if (this.is_clicked) {
			// go to project page
			// TO DO
			window.open("/projects/" + this.slug);
			this.is_clicked = false;
    } 
	}

	display() {
		this.p5.noStroke();
    this.p5.fill(this.color[0], this.color[1], this.color[2], this.alpha);
		this.p5.rectMode(this.p5.CENTER);
		//this.p5.image(this.coverImage, this.getPosition().x, this.getPosition().y, this.size, this.size);
		this.p5.rect(this.getPosition().x, this.getPosition().y, this.size, this.size);
	}

	applyForce(vec) {
		this.acceleration.add(vec);
		//this.acceleration = vec;
  }
}

const setup = (p5, canvasParentRef,props) => {
  p5.createCanvas(p5.windowWidth-400, 555).parent(canvasParentRef);
  p5.background(255);
	p5.noStroke();
	console.log(props);
	node_size = node_size/props.p.length; // the more projects we add, the smaller the nodes will become
	spacing_distance = node_size/2 + 20;
	for(var i =0; i< props.p.length; i++){
		var n = new Node(p5, props.p[i].coverImage, props.p[i].title, props.p[i].author["name"], props.p[i].tags, props.p[i].date, props.p[i].excerpt, props.p[i].slug);
		nodes.push(n);
	}
 }

const draw = p5 => {
	p5.background(255);
	p5.background(234, 227, 148, 100);
	for (var i = 0; i < nodes.length; i++) {
    for (var j = i; j < nodes.length; j++) {
      assignRelatedness(p5, nodes[i], nodes[j]);
    }
	}
	for (var i = 0; i < nodes.length; i++) {
		for (var j = i; j < nodes.length; j++) {
			physicalSimulation(p5, nodes[i], nodes[j]);
		}
		nodes[i].update();
		checkBoundaries(p5, nodes[i]);
		nodes[i].display();
		hover(p5, nodes[i]);
	}
}
const windowResized = p5 => {
	p5.resizeCanvas(p5.windowWidth-400, 555);
  }

const mousePressed = p5 => {
	// var index = 0;
  for (var i = 0; i < nodes.length; i++) {
    if (p5.mouseX > nodes[i].getPosition().x - nodes[i].size / 2 &&
      p5.mouseX < nodes[i].getPosition().x + nodes[i].size / 2 &&
      p5.mouseY > nodes[i].getPosition().y - nodes[i].size / 2 &&
      p5.mouseY < nodes[i].getPosition().y + nodes[i].size / 2) {
      nodes[i].setClick();
    }
    else {
    }
	}
	
	for (var i = 0; i < global_hashtags.length; i++) {
    global_hashtags[i].checkPositions();
  }
}

const mouseDragged = p5 => {
  for (var i = 0; i < global_hashtags.length; i++) {
    if (global_hashtags[i].getDragged() == true) { // if its being dragged
      global_hashtags[i].setPosition(p5.createVector(p5.mouseX, p5.mouseY));
    }
  }
}

const mouseReleased = p5 => {
  for (var i = 0; i < global_hashtags.length; i++) {
    if (global_hashtags[i].getDragged() == true) {
      //global_hashtags[i].setPosition(createVector(mouseX, mouseY));
      global_hashtags[i].setDragged(false);
    }
  }
}

function displayHashtags() {
	for (var i = 0; i < global_hashtags.length; i++) {
		//grab their positions and visualize their names at that coordinate
		global_hashtags[i].display();
	}
}

function hover(p5, p) {
  if (p5.mouseX > p.getPosition().x - p.getSize() / 2 &&
    p5.mouseX < p.getPosition().x + p.getSize() / 2 &&
    p5.mouseY > p.getPosition().y - p.getSize() / 2 &&
		p5.mouseY < p.getPosition().y + p.getSize() / 2) 
	{
		//p5.textSize(16);
		//p5.textAlign(p5.CENTER);
		p5.fill(0);
		p5.text(p.getTitle(), p.getPosition().x - p.getSize()/2, p.getPosition().y - (p.getSize()/2 + 5));
		
		p.setLineAlpha(255);
  } else {
		p.setLineAlpha(20);
	}
}

function assignRelatedness(p5, p1, p2) { //takes in two projects and checks their relation
	var hashtagCounter = 0;
	for (var i = 0; i < p2.getHashtags().length; i++) {
		// console.log(p2.getAuthors(), p2.getHashtags()[i])
		if (p1.getHashtags().includes(p2.getHashtags()[i])) {
			hashtagCounter++;
		}
	}
	if (hashtagCounter > 0) {
		p5.strokeWeight(hashtagCounter);
		var alpha = 50;
		if(p1.getLineAlpha() == 255 || p2.getLineAlpha() == 255){
			alpha = 255;
		}
		p5.stroke(211, 103, 60, alpha)
		p5.line(p1.getPosition().x, p1.getPosition().y, p2.getPosition().x, p2.getPosition().y);
	}

	// if (p1.getLabAffiliation() == p2.getLabAffiliation()) {
	// 	strokeWeight(1);
	// 	var alpha = 20;
	// 	if(p1.getLineAlpha() == 255 || p2.getLineAlpha() == 255){
	// 		alpha = 255;
	// 	}s
	// 	this.p5.stroke(96, 99, 134, alpha);
	// 	this.p5.line(p1.getPosition().x + 5, p1.getPosition().y, p2.getPosition().x + 5, p2.getPosition().y);
	// }

	var nameCounter = 0;
	// console.log("Authors", p2.getAuthors().length);
	for (var i = 0; i < p2.getAuthors().length; i++) {
		// console.log(p1.getAuthors(), p2.getAuthors());
		if (p1.getAuthors().includes(p2.getAuthors()[i])) {
			//print("match!");
			nameCounter++;
		}
	}
	
	if (nameCounter > 0) {
		p5.strokeWeight(nameCounter);
		var alpha = 50;
		if(p1.getLineAlpha() == 255 || p2.getLineAlpha() == 255){
			alpha = 255;
		}
		p5.stroke(96, 99, 134, alpha);
		p5.line(p1.getPosition().x + 5, p1.getPosition().y + 5, p2.getPosition().x +5, p2.getPosition().y + 5);
	}
}

function physicalSimulation(p5, p1, p2) {
	//attractive forces
	var directionVector = p5.createVector(0, 0);
	let pos_difference = p5.createVector((p2.getPosition().x - p1.getPosition().x), (p2.getPosition().y - p1.getPosition().y));
	if (pos_difference.mag() > 10 ) {
		//console.log("pos_difference", pos_difference);
		for (var i = 0; i < p2.getHashtags().length; i++) {
			if (p1.getHashtags().includes(p2.getHashtags()[i])) {
				directionVector.add(pos_difference);
			} else {
				directionVector.sub(pos_difference);
			}
		}
		for (var i = 0; i < p2.getAuthors().length; i++) {
			if (p1.getAuthors().includes(p2.getAuthors()[i])) {
				directionVector.add(pos_difference);
			} else {
				directionVector.sub(pos_difference);
			}
		}
	}
	directionVector.normalize();
	p1.applyForce(directionVector);
	//maybe apply force to the second project? equal and opposite?
}

function checkBoundaries(p5, n) {
	//console.log(n.getPosition());
	if ( n.getPosition().x <= spacing_distance || n.getPosition().x >= p5.windowWidth - 400 - spacing_distance ) {
		//console.log("out of x bounds"); 
		n.inverseX();
	}
	if ( n.getPosition().y <= spacing_distance || n.getPosition().y >= 555 - spacing_distance ) { 
		//console.log("out of y bounds"); 
		n.inverseY();
	}

	// for (var i = 0; i < nodes.length; i++) {
	// 	if (n.getPosition().x + n.getSize()/2 < nodes[i].getPosition().x - nodes[i].getSize()/2 ||
	// 			n.getPosition().x - n.getSize()/2 > nodes[i].getPosition().x + nodes[i].getSize()/2 &&
	// 			(n.getPosition().y + n.getSize()/2 < nodes[i].getPosition().y - nodes[i].getSize()/2 ||
	// 			n.getPosition().y - n.getSize()/2 > nodes[i].getPosition().y + nodes[i].getSize()/2) )
	// 	{
	// 		console.log("bounce");
	// 		//bounce off each other
	// 		n.inverseDirection();
	// 	}
	// }
}

//this organizes the node position based on hashtag location
// function gravitationalPull(p5, p) {
// 	//console.log("pulling");
//   // linear interpolation between node initial position (random) to the hashtag_position location +- some random number
//   var initialPos = p5.createVector(p.getPosition().x, p.getPosition().y);
//   //print(pos);
//   var ht_array = p.getHashtags();

//   var directionVector = p5.createVector(0);

//   for (var i = 0; i < ht_array.length; i++) {
//     for (var j = 0; j < global_hashtags.length; j++) {
//       var finalPos = p5.createVector(global_hashtags[j].getPosition().x, global_hashtags[j].getPosition().y);
//       if (p5.match(global_hashtags[j].getName(), ht_array[i])) {
//         finalPos.sub(initialPos);
//         directionVector.add(finalPos);
//       }
//     }
//   }
//   directionVector.normalize();
//   p.applyForce(directionVector);
// }

export { setup, draw, mousePressed, mouseDragged, mouseReleased, windowResized };
