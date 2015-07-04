//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Node that, when clicked on, will add an mRNA destroyer to the active area.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var BiomoleculeCreatorNode = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/view/BiomoleculeCreatorNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/model/StubGeneExpressionModel' );
  var MessengerRnaDestroyer = require( 'GENE_EXPRESSION_BASICS/common/model/MessengerRnaDestroyer' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_BASICS/common/view/MobileBiomoleculeNode' );

  // constants
  // Scaling factor for this node when used as a creator node.  May be
  // significantly different from the size of the corresponding element
  // in the model.
  var SCALING_FACTOR = 0.07;
  var SCALING_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ),
    new Vector2( 0, 0 ), SCALING_FACTOR );

  /**
   *
   * @param {BiomoleculeToolBoxNode} biomoleculeBoxNode
   * @constructor
   */
  function MessengerRnaDestroyerCreatorNode( biomoleculeBoxNode ) {
    var thisNode = this;
    BiomoleculeCreatorNode.call( thisNode,
      new MobileBiomoleculeNode( SCALING_MVT, new MessengerRnaDestroyer( new StubGeneExpressionModel() ) ),
      biomoleculeBoxNode.canvas,
      biomoleculeBoxNode.mvt,
      function( pos ) {
        var mRnaDestroyer = new MessengerRnaDestroyer( biomoleculeBoxNode.model, pos );
        biomoleculeBoxNode.model.addMobileBiomolecule( mRnaDestroyer );
        return mRnaDestroyer;

      },
      function( mobileBiomolecule ) {
        biomoleculeBoxNode.model.removeMobileBiomolecule( mobileBiomolecule );
      },
      biomoleculeBoxNode
    );
  }


  return inherit( BiomoleculeCreatorNode, MessengerRnaDestroyerCreatorNode );

} );
