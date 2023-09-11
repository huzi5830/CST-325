/*
 * An "object" representing a 3d vector to make operations simple and concise.
 *
 * Similar to how we work with plain numbers, we will work with vectors as
 * an entity unto itself.  Note the syntax below: var Vector3 = function...
 * This is different than you might be used to in most programming languages.
 * Here, the function is meant to be instantiated rather than called and the
 * instantiation process IS similar to other object oriented languages => new Vector3()
 */

var Vector3 = function(x, y, z) {
  this.x = x; this.y = y; this.z = z;

  // Sanity check to prevent accidentally using this as a normal function call
  if (!(this instanceof Vector3)) {
    console.error("Vector3 constructor must be called with the 'new' operator");
  }

  if (typeof x == 'undefined'){ this.x = 0}
  if (typeof y == 'undefined'){ this.y = 0}
  if (typeof z == 'undefined'){ this.z = 0}

  // todo - make sure to set a default value in case x, y, or z is not passed in
}

Vector3.prototype = {

  //----------------------------------------------------------------------------- 
  set: function(x, y, z) {
    this.x = x; this.y = y; this.z = z;
    // todo set 'this' object's values to those from x, y, and z
    return this;
  },

  //----------------------------------------------------------------------------- 
  clone: function() {
    return new Vector3(this.x, this.y, this.z);
  },

  //----------------------------------------------------------------------------- 
  copy: function(other) {
    this.x = other.x; this.y = other.y; this.z = other.z;
    // copy the values from other into 'this'
    return this;
  },

  //----------------------------------------------------------------------------- 
  negate: function() {
    this.x *= -1; this.y *= -1; this.z *= -1;
    // multiply 'this' vector by -1
    // This SHOULD change the values of this.x, this.y, and this.z
    return this;
  },

  //----------------------------------------------------------------------------- 
  add: function(v) {
    this.x += v.x; this.y += v.y; this.z += v.z;
    // todo - add v to 'this' vector
    // This SHOULD change the values of this.x, this.y, and this.z
    return this;
  },

  //----------------------------------------------------------------------------- 
  subtract: function(v) {
    this.x -= v.x; this.y -= v.y; this.z -= v.z;
    // todo - subtract v from 'this' vector
    // This SHOULD change the values of this.x, this.y, and this.z
    return this;
  },

  //----------------------------------------------------------------------------- 
  multiplyScalar: function(scalar) {
    this.x *= scalar; this.y *= scalar; this.z *= scalar;
    // multiply 'this' vector by "scalar"
    // This SHOULD change the values of this.x, this.y, and this.z
    return this;
  },

  //----------------------------------------------------------------------------- 
  length: function() {
    let x = this.x ** 2;
    let y = this.y ** 2;
    let z = this.z ** 2;
    
    let magnitude = Math.sqrt(x + y + z);
    
    // Return the magnitude (A.K.A. length) of 'this' vector
    // This should NOT change the values of this.x, this.y, and this.z
    return magnitude;
  },

  //----------------------------------------------------------------------------- 
  lengthSqr: function() {
    let x = this.x ** 2;
    let y = this.y ** 2;
    let z = this.z ** 2;
    // todo - return the squared magnitude of this vector ||v||^2
    // This should NOT change the values of this.x, this.y, and this.z

    // There are many occasions where knowing the exact length is unnecessary 
    // and the square can be substituted instead (for performance reasons).  
    // This function should NOT have to take the square root of anything.
    return (x+ y+ z)
  },

  //----------------------------------------------------------------------------- 
  normalize: function() {
    let mag = this.length()
    this.x /= mag
    this.y /= mag
    this.z /= mag
    // todo - Change the components of this vector so that its magnitude will equal 1.
    // This SHOULD change the values of this.x, this.y, and this.z
    return this;
  },

  //----------------------------------------------------------------------------- 
  dot: function(other) {
    let dotX = this.x * other.x
    let dotY = this.y * other.y
    let dotZ = this.z * other.z
    // todo - return the dot product betweent this vector and "other"
    // This should NOT change the values of this.x, this.y, and this.z
    return (dotX + dotY + dotZ);
  },


  //============================================================================= 
  // The functions below must be completed in order to receive an "A"

  //----------------------------------------------------------------------------- 
  fromTo: function(fromPoint, toPoint) {
    if (!(fromPoint instanceof Vector3) || !(toPoint instanceof Vector3)) {
      console.error("fromTo requires to vectors: 'from' and 'to'");
    }

    let x = toPoint.x - fromPoint.x
    let y= toPoint.y - fromPoint.y
    let z = toPoint.z - fromPoint.z
    
    let vector = new Vector3(x,y,z)
    return vector 
    // todo - return the vector that goes from "fromPoint" to "toPoint"
    //        NOTE - "fromPoint" and "toPoint" should not be altered
  },

  //----------------------------------------------------------------------------- 
  rescale: function(newScale) {
  let currentMagnitude = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  let scalingFactor = newScale / currentMagnitude;
  this.x *= scalingFactor;
  this.y *= scalingFactor;
  this.z *= scalingFactor;
  return this;
  },

  //----------------------------------------------------------------------------- 
  angle: function(v1, v2) {
    let dotProduct = v1.dot(v2)
    let magV1 = v1.length()
    let magV2 = v2.length()
    let angleRadians = Math.acos(dotProduct / (magV1 * magV2));
    let angleDegrees = angleRadians * (180/Math.PI)
    // todo - calculate the angle in degrees between vectors v1 and v2. Do NOT
    //        change any values on the vectors themselves
    return angleDegrees;
  },

  //----------------------------------------------------------------------------- 
  project: function(vectorToProject, otherVector) {
    let top = vectorToProject.dot(otherVector)
    let bottom = otherVector.lengthSqr()
    let scalar = top/bottom
    let projection = otherVector.clone()
    projection.normalize();
    projection.multiplyScalar(scalar);
    return projection

    // todo - return a vector that points in the same direction as "otherVector"
    //        but whose length is the projection of "vectorToProject" onto "otherVector"
    //        NOTE - "vectorToProject" and "otherVector" should NOT be altered (i.e. use clone)
    //        See "Vector Projection Slides" under "Extras" for more info.

  }
};

 
