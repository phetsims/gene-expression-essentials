// Copyright 2015, University of Colorado Boulder

/**
 * Base class for displaying and interacting with mobile biomolecules. In essence, this observes the shape of the
 * biomolecule, which changes as it moves.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Color = require( 'SCENERY/util/Color' );
  var GradientUtil = require( 'GENE_EXPRESSION_ESSENTIALS/common/util/GradientUtil' );
  var RnaPolymerase = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/RnaPolymerase' );
  var BiomoleculeDragHandler = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/BiomoleculeDragHandler' );


  /**
   *
   * @param {ModelViewTransform2} mvt
   * @param {MobileBiomolecule} mobileBiomolecule
   * @param {number} outlineStroke
   * @constructor
   */
  function MobileBiomoleculeNode( mvt, mobileBiomolecule, outlineStroke ) {
    var self = this;
    Node.call( self, { cursor: 'pointer' } );
    outlineStroke = outlineStroke || 1;

    var path = self.getPathByMobileBioMoleculeType( mobileBiomolecule, {
      stroke: Color.BLACK,
      lineWidth: outlineStroke
    } );

    self.addChild( path );

    function handleShapeChanged( shape ) {
      // Create a shape that excludes any offset.
      var centeredShape = self.centeredShape( shape, mvt );
      path.setShape( centeredShape );
      // Account for the offset.
      var offset = mvt.modelToViewPosition( mobileBiomolecule.getPosition() );

      // For shapes with just one point, the Java Version of GeneralPath's "Bounds" returns a width of
      // zero and height of 1 but kite's shape bounds returns infinity in such cases. Since the MessengerRna starts with
      // a single point, the Gradient fill code fails as the bounds of the shape at that point is infinity.
      // So the following check is added before calling createGradientPaint - Ashraf
      if ( _.isFinite( centeredShape.bounds.centerX ) ) {
        path.centerX = offset.x;
        path.centerY = offset.y;
        path.fill = GradientUtil.createGradientPaint( centeredShape, mobileBiomolecule.colorProperty.get() );
      }

    }

    // Update the shape whenever it changes.
    mobileBiomolecule.shapeProperty.link( handleShapeChanged );

    function handleColorChanged( color ) {
      var moleculeShape = self.centeredShape( mobileBiomolecule.getShape(), mvt );

      //see the comment above on gradientPaint
      if ( _.isFinite( moleculeShape.bounds.centerX ) ) {
        path.fill = GradientUtil.createGradientPaint( moleculeShape, color );
      }
    }

    //Update the color whenever it changes.
    mobileBiomolecule.colorProperty.link( handleColorChanged );

    function handleExistenceStrengthChanged( existenceStrength ) {
      assert && assert( existenceStrength >= 0 && existenceStrength <= 1 ); // Bounds checking.
      self.setOpacity( Math.min( Number( existenceStrength ), 1 + mobileBiomolecule.zPositionProperty.get() ) );
    }

    // Update its existence strength (i.e. fade level) whenever it changes.
    mobileBiomolecule.existenceStrengthProperty.link( handleExistenceStrengthChanged );

    function handleZPositionChanged( zPosition ) {
      assert && assert( zPosition >= -1 && zPosition <= 0 ); // Parameter checking.
      // The further back the biomolecule is, the more transparent it is in order to make it look more distant.
      self.setOpacity( Math.min( 1 + zPosition, mobileBiomolecule.existenceStrengthProperty.get() ) );

      // Also, as it goes further back, this node is scaled down a bit, also to make it look further away.
      self.setScaleMagnitude( 1 );
      self.setScaleMagnitude( 1 + 0.15 * zPosition );
    }

    // Update the "closeness" whenever it changes.
    mobileBiomolecule.zPositionProperty.link( handleZPositionChanged );

    function handleAttachedToDnaChanged( attachedToDna ) {
      if ( mobileBiomolecule instanceof RnaPolymerase && attachedToDna ) {
        self.moveToBack();
      }
    }

    // If a polymerase molecule attaches to the DNA strand, move it to the back of its current layer so that nothing can
    // go between it and the DNA molecule. Otherwise odd-looking things can happen.
    mobileBiomolecule.attachedToDnaProperty.link( handleAttachedToDnaChanged );

    var dragHandler = new BiomoleculeDragHandler( mobileBiomolecule, self, mvt );
    // Drag handling.
    self.addInputListener( dragHandler );

    function handleMovableByUserChanged( movableByUser ) {
      self.setPickable( movableByUser );
    }
    // Interactivity control.
    mobileBiomolecule.movableByUserProperty.link( handleMovableByUserChanged );

    function handleUserControlledChanged( userControlled ) {
      self.moveToFront();
    }
    // Move this biomolecule to the top of its layer when grabbed.
    mobileBiomolecule.userControlledProperty.link( handleUserControlledChanged );

    this.disposeMobileBiomoleculeNode = function() {
      mobileBiomolecule.shapeProperty.unlink( handleShapeChanged );
      mobileBiomolecule.colorProperty.unlink( handleColorChanged );
      mobileBiomolecule.existenceStrengthProperty.unlink( handleExistenceStrengthChanged );
      mobileBiomolecule.zPositionProperty.unlink( handleZPositionChanged );
      mobileBiomolecule.attachedToDnaProperty.unlink( handleAttachedToDnaChanged );
      self.removeInputListener( dragHandler );
      mobileBiomolecule.movableByUserProperty.unlink( handleMovableByUserChanged );
      mobileBiomolecule.userControlledProperty.unlink( handleUserControlledChanged );
    };
  }

  geneExpressionEssentials.register( 'MobileBiomoleculeNode', MobileBiomoleculeNode );

  return inherit( Node, MobileBiomoleculeNode, {

    // @public
    dispose: function() {
      this.disposeMobileBiomoleculeNode();
      Node.prototype.dispose.call( this );
    },

    /**
     *
     * @param {MobileBiomolecule} mobileBiomolecule
     * @param {Object} options
     */
    getPathByMobileBioMoleculeType: function( mobileBiomolecule, options ) {

      var path = new Path( new Shape(), options );
      path.boundsMethod = 'unstroked';
      return path;
    },

    /**
     * Get a shape that is positioned such that its center is at point (0, 0).
     *
     * @param shape
     * @param {ModelViewTransform2} mvt
     */
    centeredShape: function( shape, mvt ) {
      var viewShape = mvt.modelToViewShape( shape );
      return viewShape;
    }
  } );
} );