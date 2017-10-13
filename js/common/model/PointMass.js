// Copyright 2015-2017, University of Colorado Boulder

/**
 * This class defines a point in model space that also has mass. It is is used to define the overall shape of the mRNA,
 * which uses a spring algorithm to implement the winding/twisting behavior.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var MASS = 0.25; // In kg.  Arbitrarily chosen to get the desired behavior.

  /**
   *
   * @param {Vector2} initialPosition
   * @param {number} targetDistanceToPreviousPoint
   * @constructor
   */
  function PointMass( initialPosition, targetDistanceToPreviousPoint ) {

    // @private
    // TODO: Depending on whether the spring algorithm goes away for positioning these points, som of these properties can likely be removed.
    this.position = new Vector2( 0, 0 );
    this.velocity = new Vector2( 0, 0 );
    this.acceleration = new Vector2( 0, 0 );
    this.previousPointMass = null;
    this.nextPointMass = null;
    this.targetDistanceToPreviousPoint = targetDistanceToPreviousPoint; // in picometers

    this.setPosition( initialPosition );
  }

  geneExpressionEssentials.register( 'PointMass', PointMass );

  return inherit( Object, PointMass, {

    /**
     * @param {number} x
     * @param {number} y
     * @public
     */
    setPositionXY: function( x, y ) {
      assert && assert( arguments.length === 2, 'incorrect number of arguments: ' + arguments.length );
      this.position.setXY( x, y );
    },

    /**
     * @param {Vector2} position
     * @public
     */
    setPosition: function( position ) {
      this.setPositionXY( position.x, position.y );
    },

    /**
     * @returns {Vector2}
     * @public
     */
    getPosition: function() {
      return this.position;
    },

    /**
     * @returns {Vector2}
     * @public
     */
    getVelocity: function() {
      return this.velocity;
    },

    /**
     * @param {Vector2} acceleration
     * @public
     */
    setAcceleration: function( acceleration ) {
      this.acceleration.set( acceleration );
    },

    /**
     * @returns {PointMass}
     * @public
     */
    getPreviousPointMass: function() {
      return this.previousPointMass;
    },

    /**
     * @param {PointMass} previousPointMass
     * @public
     */
    setPreviousPointMass: function( previousPointMass ) {
      this.previousPointMass = previousPointMass;
    },

    /**
     * @returns {PointMass}
     * @public
     */
    getNextPointMass: function() {
      return this.nextPointMass;
    },

    /**
     * @param {PointMass} nextPointMass
     * @public
     */
    setNextPointMass: function( nextPointMass ) {
      this.nextPointMass = nextPointMass;
    },

    /**
     * @returns {number}
     * @public
     */
    getTargetDistanceToPreviousPoint: function() {
      return this.targetDistanceToPreviousPoint;
    },

    /**
     * @param {PointMass} p
     * @returns {number}
     * @public
     */
    distance: function( p ) {
      return this.getPosition().distance( p.getPosition() );
    },

    /**
     * @param {number} deltaTime
     * @public
     */
    update: function( deltaTime ) {
      this.velocity.addXY( this.acceleration.x * deltaTime, this.acceleration.y * deltaTime );
      this.position.setXY( this.position.x + this.velocity.x * deltaTime, this.position.y + this.velocity.y * deltaTime );
    },

    /**
     * @param {number} x
     * @param {number} y
     * @public
     */
    translate: function( x, y ) {
      this.setPositionXY( this.position.x + x, this.position.y + y );
    },

    /**
     * @param {number} targetDistance
     * @public
     */
    setTargetDistanceToPreviousPoint: function( targetDistance ) {
      this.targetDistanceToPreviousPoint = targetDistance;
    },

    /**
     * Set the velocity to 0
     * @public
     */
    clearVelocity: function() {
      this.velocity.setXY( 0, 0 );
    }

  }, {
    MASS: MASS
  } );
} );
