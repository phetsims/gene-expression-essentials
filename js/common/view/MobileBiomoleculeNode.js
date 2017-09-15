// Copyright 2015, University of Colorado Boulder

/**
 * Base class for displaying and interacting with mobile biomolecules. In essence, this observes the shape of the
 * biomolecule, which changes as it moves.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var BiomoleculeDragHandler = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/BiomoleculeDragHandler' );
  var Color = require( 'SCENERY/util/Color' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var GradientUtil = require( 'GENE_EXPRESSION_ESSENTIALS/common/util/GradientUtil' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RnaPolymerase = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/RnaPolymerase' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {ModelViewTransform2} modelViewTransform
   * @param {MobileBiomolecule} mobileBiomolecule
   * @param {Object} options
   * @constructor
   */
  function MobileBiomoleculeNode( modelViewTransform, mobileBiomolecule, options ) {
    var self = this;
    Node.call( self, { cursor: 'pointer' } );
    options = _.extend( {
      lineWidth: 1
    }, options );

    // @protected (read-only) {ModelViewTransform2} - scale-only transform for scaling the shape without translation
    this.scaleOnlyModelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      Vector2.ZERO,
      modelViewTransform.getMatrix().getScaleVector().x
    );

    // @protected {Path} - main path that represents the biomolecule
    this.shapeNode = new Path( new Shape(), {
      stroke: Color.BLACK,
      lineWidth: options.lineWidth
    } );

    this.addChild( this.shapeNode );

    // update the shape whenever it changes
    function handleShapeChanged( shape ) {

      // update the shape
      self.shapeNode.shape = null;
      // self.shapeNode.setShape( modelViewTransform.modelToViewShape( shape ) );
      self.shapeNode.setShape( self.scaleOnlyModelViewTransform.modelToViewShape( shape ) );
    }

    mobileBiomolecule.shapeProperty.link( handleShapeChanged );

    // update this node's position when the corresponding model element moves
    function handlePositionChanged( position ) {
      self.setTranslation( modelViewTransform.modelToViewPosition( position ) );
      // self.center = modelViewTransform.modelToViewPosition( position );
      if ( position.y < 200 ){
        if ( mobileBiomolecule.setLowerRightPosition ){
          console.log( '------------------- mRNA -------------------' );
        }
        else{
          console.log( '~~~~~~~~~~~~~~~~~~ Polymerase ~~~~~~~~~~~~~~~~~~' );
        }
        console.log( 'position.toString() = ' + position.toString() );
        console.log( 'mobileBiomolecule.shapeProperty.value.bounds = ' + mobileBiomolecule.shapeProperty.value.bounds );
        console.log( 'self.globalBounds = ' + self.globalBounds );
      }
    }

    mobileBiomolecule.positionProperty.link( handlePositionChanged );

    function handleColorChanged( color ) {

      // see the comment above on gradientPaint
      if ( self.shapeNode.shape.bounds.isFinite() ) {
        self.shapeNode.fill = GradientUtil.createGradientPaint( self.shapeNode.shape, color );
      }
    }

    // Update the color whenever it changes.
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

    var dragHandler = new BiomoleculeDragHandler( mobileBiomolecule, modelViewTransform );
    // Drag handling.
    this.addInputListener( dragHandler );

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
      mobileBiomolecule.positionProperty.unlink( handlePositionChanged );
      mobileBiomolecule.shapeProperty.unlink( handleShapeChanged );
      mobileBiomolecule.colorProperty.unlink( handleColorChanged );
      mobileBiomolecule.existenceStrengthProperty.unlink( handleExistenceStrengthChanged );
      mobileBiomolecule.zPositionProperty.unlink( handleZPositionChanged );
      mobileBiomolecule.attachedToDnaProperty.unlink( handleAttachedToDnaChanged );
      self.removeInputListener( dragHandler );
      mobileBiomolecule.movableByUserProperty.unlink( handleMovableByUserChanged );
      mobileBiomolecule.userControlledProperty.unlink( handleUserControlledChanged );
      self.shapeNode.shape = null;
      self.shapeNode.dispose();
    };
  }

  geneExpressionEssentials.register( 'MobileBiomoleculeNode', MobileBiomoleculeNode );

  return inherit( Node, MobileBiomoleculeNode, {

    /**
     * @public
     */
    dispose: function() {
      this.disposeMobileBiomoleculeNode();
      Node.prototype.dispose.call( this );
    }

  } );
} );