// Copyright 2015, University of Colorado Boulder

/**
 * Node that, when clicked on, will add an RNA polymerase to the model.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BiomoleculeCreatorNode = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/BiomoleculeCreatorNode' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var RnaPolymerase = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/RnaPolymerase' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );

  // constants

  // Scaling factor for this node when used as a creator node. May be significantly different from the size of the
  // corresponding element in the model.
  var SCALING_FACTOR = 0.07;
  var SCALING_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
    new Vector2( 0, 0 ),
    new Vector2( 0, 0 ),
    SCALING_FACTOR
  );

  /**
   * @param {BiomoleculeToolBoxNode} biomoleculeBoxNode - Biomolecule box, which is a sort of tool box, in which
   * this creator node exists.
   *
   * @constructor
   */
  function RnaPolymeraseCreatorNode( biomoleculeBoxNode ) {
    var self = this;
    BiomoleculeCreatorNode.call( self, new MobileBiomoleculeNode( SCALING_MVT, new RnaPolymerase() ),
      biomoleculeBoxNode.canvas,
      biomoleculeBoxNode.mvt,

      function( pos ) { // Molecule creator function.
        var rnaPolymerase = new RnaPolymerase( biomoleculeBoxNode.model, pos );
        biomoleculeBoxNode.model.addMobileBiomolecule( rnaPolymerase );
        return rnaPolymerase;
      },

      function( mobileBiomolecule ) {
        biomoleculeBoxNode.model.removeMobileBiomolecule( mobileBiomolecule );
      },

      biomoleculeBoxNode
    );
  }

  geneExpressionEssentials.register( 'RnaPolymeraseCreatorNode', RnaPolymeraseCreatorNode );

  return inherit( BiomoleculeCreatorNode, RnaPolymeraseCreatorNode );
} );