// Copyright 2015, University of Colorado Boulder

/**
 * Class that represents a node for collecting a single protein and a
 * counter of the number of the protein type collected.
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
  var Color = require( 'SCENERY/util/Color' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ProteinA = require( 'GENE_EXPRESSION_ESSENTIALS/manualgeneexpression/model/ProteinA' );
  var ProteinB = require( 'GENE_EXPRESSION_ESSENTIALS/manualgeneexpression/model/ProteinB' );
  var ProteinC = require( 'GENE_EXPRESSION_ESSENTIALS/manualgeneexpression/model/ProteinC' );
  var GradientUtil = require( 'GENE_EXPRESSION_ESSENTIALS/common/util/GradientUtil' );
  var FlashingShapeNode = require( 'GENE_EXPRESSION_ESSENTIALS/manualgeneexpression/view/FlashingShapeNode' );

  // constants
  var FLASH_COLOR = new Color( 173, 255, 47 );
  var SCALE_FOR_FLASH_NODE = 1.5;

  // Tweak warning: This is used to make sure that the counters on
  // the various protein nodes end up horizontally aligned.  This will
  // need to be adjust if the protein shapes change a lot.
  var VERTICAL_DISTANCE_TO_COUNT_NODE = 40;

  var proteinStringConstructorMap = {
    'ProteinA': ProteinA,
    'ProteinB': ProteinB,
    'ProteinC': ProteinC
  };


  /**
   *
   * @param {ManualGeneExpressionModel} model
   * @param {string} proteinClassName
   * @param {Matrix3} transform
   * @param {Dimension2} size
   * @constructor
   */
  function ProteinCaptureNode( model, proteinClassName, transform, size ) {
    var self = this;
    Node.call( self );

    var proteinShape = Shape.rectangle( -10, -10, 20, 20 ); // Arbitrary initial shape.
    var fullBaseColor = Color.PINK; // Arbitrary initial color.

    // Get the shape of the protein.
    var protein = new proteinStringConstructorMap[ proteinClassName ]();
    proteinShape = protein.getFullyGrownShape().transformed( transform );
    fullBaseColor = protein.colorProperty.get();

    // Add the background node.  This is invisible, and exists only to
    // make the node a specific size.
    self.addChild( new Path( Shape.rectangle( -size.width / 2, -size.height / 2, size.width, size.height ), {
      fill: new Color( 0, 0, 0, 0 )
    } ) );

    // Add the node that will flash when a protein is created, stay lit
    // until the protein is captured, and turn off once it is captured.
    var flashingCaptureNodeShape = proteinShape.transformed( Matrix3.scaling( SCALE_FOR_FLASH_NODE, SCALE_FOR_FLASH_NODE ) );
    var flashingCaptureNode = new FlashingShapeNode( flashingCaptureNodeShape, FLASH_COLOR, 350, 350, 4, false, true );
    self.addChild( flashingCaptureNode );

    // Add the node that will represent the spot where the protein can
    // be captured, which is a black shape (signifying emptiness)
    // until a protein is captured, then it changes to look filled in.
    var captureAreaNode = new Path( proteinShape );
    self.addChild( captureAreaNode );
    var gradientPaint = GradientUtil.createGradientPaint( proteinShape, fullBaseColor );

    // Add the node that represents a count of the collected type.
    var countNode = new Text( '', { font: new PhetFont( { size: 18, weight: 'bold' } ) } );
    self.addChild( countNode );
    model.getCollectedCounterForProteinType( proteinClassName ).link( function( proteinCaptureCount ) {
      countNode.text = proteinCaptureCount;
      countNode.x = ( captureAreaNode.bounds.getCenterX() - countNode.bounds.width / 2);
      countNode.y = captureAreaNode.bounds.getCenterY() + VERTICAL_DISTANCE_TO_COUNT_NODE;
    } );

    // Watch for a protein node of the appropriate type to become
    // fully grown and, when it does, flash a node in order to signal
    // the user that the protein should be placed here.
    model.mobileBiomoleculeList.addItemAddedListener( function( biomolecule ) {
      if ( biomolecule instanceof proteinStringConstructorMap[ proteinClassName ] ) {
        var protein = biomolecule;
        protein.fullGrownProperty.link( function( isFullyFormed, wasFullyFormed ) {
          if ( isFullyFormed && !wasFullyFormed ) {
            flashingCaptureNode.startFlashing();
          }
        } );
      }
    } );

    // Get the capture count property for this protein.
    var captureCountProperty = model.getCollectedCounterForProteinType( proteinClassName );

    // Observe the capture indicator and set the state of the nodes
    // appropriately.
    captureCountProperty.link( function( captureCount ) {
      if ( captureCount > 0 ) {
        captureAreaNode.fill = gradientPaint;
      }
      else {
        // No proteins capture, so set to black to appear empty.
        captureAreaNode.fill = Color.BLACK;
      }
    } );

    // Observe the biomolecules and make sure that if none of the
    // protein that this collects is in the model, the highlight is off.
    model.mobileBiomoleculeList.addItemRemovedListener( function( biomolecule ) {
      if ( biomolecule instanceof proteinStringConstructorMap[ proteinClassName ] &&
           model.getProteinCount( proteinStringConstructorMap[ proteinClassName ] ) === 0 ) {
        // Make sure highlight is off.
        flashingCaptureNode.forceFlashOff();
      }
    } );
  }

  geneExpressionEssentials.register( 'ProteinCaptureNode', ProteinCaptureNode );
  return inherit( Node, ProteinCaptureNode, {},
    //statics
    {
      SCALE_FOR_FLASH_NODE: SCALE_FOR_FLASH_NODE

    } );
} );
