// Copyright 2015, University of Colorado Boulder
/**
 *  The current Scenery Implementation doesn't support CAG (constructive Area Operations) so we create a
 *  composite Shape which includes the top and bottom portion of the Shapes as separate shape instances.
 *  This node handles the composite shape
 *
 *
 * @author Sharfudeen Ashraf
 *
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Bounds2 = require( 'DOT/Bounds2' );


  /**
   *
   * @param {MobileBioMolecule} mobileBiomolecule
   * @param {Object} options
   * @constructor
   */
  function RibosomeNode( mobileBiomolecule, options ) {
    var thisNode = this;
    var ribosomeShape = mobileBiomolecule.getShape();
    thisNode.topPath = new Path( ribosomeShape.topShape, options );
    thisNode.bottomPath = new Path( ribosomeShape.bottomShape, options );
    Node.call( thisNode );
    thisNode.addChild( thisNode.topPath );
    thisNode.addChild( thisNode.bottomPath );
    var proto = RibosomeNode.prototype;
    Object.defineProperty( proto, 'fill', { set: proto.setFill, get: proto.getFill } );
    Object.defineProperty( proto, 'opacity', { set: proto.setOpacity, get: proto.getOpacity } );

    //TODO perf optimization?
    var emptyBounds = new Bounds2( 0, 0, 0, 0 );
    var emptyComputeShapeBounds = function() { return emptyBounds; };
    var originalTopPathComputeShapeBounds = thisNode.topPath.computeShapeBounds;
    var originalBottomPathComputeShapeBounds = thisNode.bottomPath.computeShapeBounds;

    mobileBiomolecule.attachedToDnaProperty.link( function( attachedToDna ) {
      if ( attachedToDna ) {
        thisNode.topPath.computeShapeBounds = emptyComputeShapeBounds;
        thisNode.bottomPath.computeShapeBounds = emptyComputeShapeBounds;
      }
      else {
        thisNode.topPath.computeShapeBounds = originalTopPathComputeShapeBounds;
        thisNode.bottomPath.computeShapeBounds = originalBottomPathComputeShapeBounds;
      }
    } );
  }

  return inherit( Node, RibosomeNode, {

    /**
     * overriden
     * @param ribosomeShape
     */
    setShape: function( ribosomeShape ) {
      this.topPath.setShape( ribosomeShape.topShape );
      this.bottomPath.setShape( ribosomeShape.bottomShape );

      // Arranges the top and BottomShape (compensates for the lack of union boolean operation)
      // In Java version this was simply a Add of two areas (shapes)
      var topBounds = this.topPath.getLocalBounds();
      this.bottomPath.x = 0;
      this.bottomPath.y = topBounds.height / 1.5;
    },

    setFill: function( fillValue ) {
      this.topPath.fill = fillValue;
      this.bottomPath.fill = fillValue;
    },

    setOpacity: function( opacityValue ) {
      this.topPath.opacity = opacityValue;
      this.bottomPath.opacity = opacityValue;
    }


  } );


} );