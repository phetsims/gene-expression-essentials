//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Class that represents the collection area, where potentially several
 * different types of protein can be collected.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Dimensions2 = require( 'DOT/Dimensions2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var ProteinA = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/model/ProteinA' );
  var ProteinB = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/model/ProteinB' );
  var ProteinC = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/model/ProteinC' );
  var ProteinCaptureNode = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/view/ProteinCaptureNode' );

  /**
   *
   * @param {ManualGeneExpressionModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ProteinCollectionArea( model, mvt ) {
    var thisNode = this;
    Node.call( thisNode );

    // Get a transform that performs only the scaling portion of the mvt.
    var scaleVector = mvt.getMatrix().getScaleVector();
    var scale = mvt.getMatrix().scaleVector.x;
    assert && assert( scale === -scaleVector.y ); // This only handles symmetric transform case.
    var transform = Matrix3.scaling( scale, -scale );

    // Figure out the max dimensions of the various protein types so
    // that the capture nodes can be properly laid out.
    var captureNodeBackgroundSize = new Dimensions2( 0, 0 );

    var protienTypes = [ ProteinA, ProteinB, ProteinC ];
    for ( var i = 0; i < protienTypes.length; i++ ) {

      try {
        var protein = new protienTypes[ i ]();
        var proteinShapeBounds = transform.transformed( protein.getFullyGrownShape() ).computeBounds();
        captureNodeBackgroundSize.setSize( Math.max( proteinShapeBounds.getWidth() * ProteinCaptureNode.SCALE_FOR_FLASH_NODE, captureNodeBackgroundSize.getWidth() ),
          Math.max( proteinShapeBounds.getHeight() * ProteinCaptureNode.SCALE_FOR_FLASH_NODE, captureNodeBackgroundSize.getHeight() ) );
      }
      catch( e ) {
        // Not much that can be done here except to essentially
        // re-throw the exception.
        throw new Error( "Exception thrown when instantiating protein, e = " + e );
      }
    }

    // Add the collection area, which is a set of collection nodes.
    thisNode.addChild( new HBox( {
      children: [ new ProteinCaptureNode( model, "ProteinA", transform, captureNodeBackgroundSize ),
        new ProteinCaptureNode( model, "ProteinB", transform, captureNodeBackgroundSize ),
        new ProteinCaptureNode( model, "ProteinC", transform, captureNodeBackgroundSize ) ],
      spacing: 0
    } ) );

  }


  return inherit( Node, ProteinCollectionArea );
} )
;
