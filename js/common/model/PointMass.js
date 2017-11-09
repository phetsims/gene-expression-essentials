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
    this.position = new Vector2( 0, 0 );
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
    }

  }, {
    MASS: MASS
  } );
} );
