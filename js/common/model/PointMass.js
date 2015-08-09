//  Copyright 2002-2014, University of Colorado Boulder
/**
 * This class defines a point in model space that also has mass.  It is
 * is used to define the overall shape of the mRNA, which uses a spring
 * algorithm to implement the winding/twisting behavior.
 *
 *@author John Blanco
 *@author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  //constants
  var MASS = 0.25; // In kg.  Arbitrarily chosen to get the desired behavior.

  //sratch Vector2 instances used for intermediate computations - To reduce Garbage overhead
  var ACCELERATION_VECTOR = new Vector2();
  var VELOCITY_VECTOR = new Vector2();



  /**
   *
   * @param {Vector2} initialPosition
   * @param {number} targetDistanceToPreviousPoint
   * @constructor
   */
  function PointMass( initialPosition, targetDistanceToPreviousPoint ) {
    // private
    this.position = new Vector2( 0, 0 );
    this.velocity = new Vector2( 0, 0 );
    this.acceleration = new Vector2( 0, 0 );
    this.previousPointMass = null;
    this.nextPointMass = null;

    this.setPosition( initialPosition );
    this.targetDistanceToPreviousPoint = targetDistanceToPreviousPoint;// In picometers.
  }

  return inherit( Object, PointMass, {

    /**
     * @param {number} x
     * @param {number} y
     */
    setPosition: function( x, y ) {
      if ( _.isFinite( x.x) ) {
        return this.setPositionByVector( x );
      }
      this.position.setXY( x, y );

    },

    /**
     * @param {Vector2} position
     */
    setPositionByVector: function( position ) {
      this.setPosition( position.x, position.y );
    },

    /**
     * @returns {Vector2}
     */
    getPosition: function() {
      return this.position;
    },

    /**
     * @param {Vector2} velocity
     * @returns {Vector2}
     */
    getVelocity: function() {
      return this.velocity;
    },

    /**
     * @param {Vector2} acceleration
     */
    setAcceleration: function( acceleration ) {
      this.acceleration.set( acceleration );
    },

    /**
     * @returns {PointMass}
     */
    getPreviousPointMass: function() {
      return this.previousPointMass;
    },

    /**
     * @param {PointMass} previousPointMass
     */
    setPreviousPointMass: function( previousPointMass ) {
      this.previousPointMass = previousPointMass;
    },

    /**
     * @returns {PointMass}
     */
    getNextPointMass: function() {
      return this.nextPointMass;
    },

    /**
     * @param {PointMass} nextPointMass
     */
    setNextPointMass: function( nextPointMass ) {
      this.nextPointMass = nextPointMass;
    },

    /**
     * @returns {number}
     */
    getTargetDistanceToPreviousPoint: function() {
      return this.targetDistanceToPreviousPoint;
    },

    /**
     * @param {PointMass} p
     * @returns {number}
     */
    distance: function( p ) {
      return this.getPosition().distance( p.getPosition() );
    },

    /**
     * @param {number} deltaTime
     */
    update: function( deltaTime ) {

      // The original code is here -> this.velocity.set( this.velocity.plus( this.acceleration.timesScalar( deltaTime ) ) );
      // code modified for performance reason
      ACCELERATION_VECTOR.x = this.acceleration.x * deltaTime;
      ACCELERATION_VECTOR.y = this.acceleration.y * deltaTime;

      VELOCITY_VECTOR.x  = this.velocity.x + ACCELERATION_VECTOR.x;
      VELOCITY_VECTOR.y  = this.velocity.y + ACCELERATION_VECTOR.y;

      this.velocity.setXY(VELOCITY_VECTOR.x,VELOCITY_VECTOR.y);
      this.position.setXY( this.position.x + this.velocity.x * deltaTime, this.position.y + this.velocity.y * deltaTime );
    },

    translate: function( translationVector ) {
      this.setPosition( this.position.x + translationVector.x, this.position.y + translationVector.y );
    },

    /**
     * @param {number} targetDistance
     */
    setTargetDistanceToPreviousPoint: function( targetDistance ) {
      this.targetDistanceToPreviousPoint = targetDistance;
    },

    clearVelocity: function() {
      this.velocity.setXY( 0, 0 );
    }

  }, {

    MASS: MASS
  } );

} );
