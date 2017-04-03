// Copyright 2015, University of Colorado Boulder

/**
 * Node that, when clicked on, will add an mRNA destroyer to the active area.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // modules
  var BiomoleculeCreatorNode = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/BiomoleculeCreatorNode' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MessengerRnaDestroyer = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MessengerRnaDestroyer' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/StubGeneExpressionModel' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  // Scaling factor for this node when used as a creator node. May be significantly different from the size of the
  // corresponding element in the model.
  var SCALING_FACTOR = 0.07;
  var SCALING_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ),
    new Vector2( 0, 0 ), SCALING_FACTOR );

  /**
   *
   * @param {BiomoleculeToolBoxNode} biomoleculeBoxNode
   * @constructor
   */
  function MessengerRnaDestroyerCreatorNode( biomoleculeBoxNode ) {
    var self = this;
    BiomoleculeCreatorNode.call( self,
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

  geneExpressionEssentials.register( 'MessengerRnaDestroyerCreatorNode', MessengerRnaDestroyerCreatorNode );

  return inherit( BiomoleculeCreatorNode, MessengerRnaDestroyerCreatorNode );
} );