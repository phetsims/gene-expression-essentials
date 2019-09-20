// Copyright 2015-2019, University of Colorado Boulder

/**
 * Class that represents a fragment of messenger ribonucleic acid, or mRNA, in the model. The fragments exist for a short
 * time as mRNA is being destroyed, but can't be translated.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MessengerRnaFragmentAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/MessengerRnaFragmentAttachmentStateMachine' );
  const Shape = require( 'KITE/Shape' );
  const SquareSegment = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/SquareSegment' );
  const WindingBiomolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/WindingBiomolecule' );

  // constants
  const MRNA_WINDING_ALGORITHMS = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

  /**
   * This creates the mRNA fragment as a single point, with the intention of growing it.
   *
   * @param {GeneExpressionModel} model
   * @param {Vector2} position
   * @constructor
   */
  function MessengerRnaFragment( model, position ) {
    WindingBiomolecule.call( this, model, new Shape().moveToPoint( position ), position, {
      windingParamSet: MRNA_WINDING_ALGORITHMS[ phet.joist.random.nextInt( MRNA_WINDING_ALGORITHMS.length ) ]
    } );

    // Add the first, and in this case only, segment to the shape segment list.
    this.shapeSegments.push( new SquareSegment( this, position ) );
  }

  geneExpressionEssentials.register( 'MessengerRnaFragment', MessengerRnaFragment );

  return inherit( WindingBiomolecule, MessengerRnaFragment, {

    /**
     * Release this mRNA fragment from the destroyer molecule.
     * @public
     */
    releaseFromDestroyer: function() {
      this.attachmentStateMachine.detach();
    },

    /**
     * Creates the attachment state machine
     * @returns {MessengerRnaFragmentAttachmentStateMachine}
     * @public
     */
    createAttachmentStateMachine: function() {
      return new MessengerRnaFragmentAttachmentStateMachine( this );
    }
  } );
} );
