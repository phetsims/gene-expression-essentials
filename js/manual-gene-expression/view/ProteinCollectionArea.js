// Copyright 2015, University of Colorado Boulder

/**
 * Class that represents the collection area, where potentially several different types of protein can be collected.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var kite = require( 'KITE/kite' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ProteinA = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ProteinA' );
  var ProteinB = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ProteinB' );
  var ProteinC = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ProteinC' );
  var ProteinCaptureNode = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/ProteinCaptureNode' );

  /**
   *
   * @param {ManualGeneExpressionModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ProteinCollectionArea( model, mvt ) {
    var self = this;
    Node.call( self );

    // Get a transform that performs only the scaling portion of the mvt.
    var scaleVector = mvt.getMatrix().getScaleVector();
    var scale = mvt.getMatrix().scaleVector.x;

    // The getScaleVector method of Matrix3 always returns positive value for the scales, even though
    // the mvt uses inverted scaling for Y, so changing the assertion statement to check for absolute values
    // see issue #7
    assert && assert( scale === Math.abs( scaleVector.y ) ); // This only handles symmetric transform case.
    var transform = Matrix3.scaling( scale, -scale );

    // Figure out the max dimensions of the various protein types so that the capture nodes can be properly laid out.
    var captureNodeBackgroundSize = new Dimension2( 0, 0 );

    var proteinTypes = [ ProteinA, ProteinB, ProteinC ];
    for ( var i = 0; i < proteinTypes.length; i++ ) {
      var protein = new proteinTypes[ i ]();
      var proteinShapeBounds = protein.getFullyGrownShape().transformed( transform ).getStrokedBounds( new kite.LineStyles( { lineWidth: 1 } ) );
      captureNodeBackgroundSize.width = ( Math.max( proteinShapeBounds.width * ProteinCaptureNode.SCALE_FOR_FLASH_NODE, captureNodeBackgroundSize.width ) );
      captureNodeBackgroundSize.height = ( Math.max( proteinShapeBounds.height * ProteinCaptureNode.SCALE_FOR_FLASH_NODE, captureNodeBackgroundSize.height ) );
    }

    // Add the collection area, which is a set of collection nodes.
    self.addChild( new HBox( {
      children: [ new ProteinCaptureNode( model, 'ProteinA', transform, captureNodeBackgroundSize ),
        new ProteinCaptureNode( model, 'ProteinB', transform, captureNodeBackgroundSize ),
        new ProteinCaptureNode( model, 'ProteinC', transform, captureNodeBackgroundSize ) ],
      spacing: 0
    } ) );

  }

  geneExpressionEssentials.register( 'ProteinCollectionArea', ProteinCollectionArea );

  return inherit( Node, ProteinCollectionArea );
} );
