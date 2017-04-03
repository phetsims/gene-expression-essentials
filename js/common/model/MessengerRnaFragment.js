// Copyright 2015, University of Colorado Boulder

/**
 * Class that represents a fragment of messenger ribonucleic acid, or mRNA, in the model. The fragments exist for a short
 * time as mRNA is being destroyed, but can't be translated.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MessengerRnaFragmentAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/MessengerRnaFragmentAttachmentStateMachine' );
  var SquareSegment = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/SquareSegment' );
  var Shape = require( 'KITE/Shape' );
  var WindingBiomolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/WindingBiomolecule' );

  /**
   * This creates the mRNA fragment as a single point, with the intention of growing it.
   *
   * @param {GeneExpressionModel} model
   * @param {Vector2} position
   * @constructor
   */
  function MessengerRnaFragment( model, position ) {
    WindingBiomolecule.call( this, model, new Shape().moveToPoint( position ), position );

    // Add the first, and in this case only, segment to the shape segment list.
    this.shapeSegments.add( new SquareSegment( position ) ); //TODO
  }

  geneExpressionEssentials.register( 'MessengerRnaFragment', MessengerRnaFragment );

  return inherit( WindingBiomolecule, MessengerRnaFragment, {

    /**
     * Release this mRNA fragment from the destroyer molecule.
     */
    releaseFromDestroyer: function() {
      this.attachmentStateMachine.detach();
    },

    /**
     *
     * @returns {MessengerRnaFragmentAttachmentStateMachine}
     */
    createAttachmentStateMachine: function() {
      return new MessengerRnaFragmentAttachmentStateMachine( this );
    }
  } );
} );
