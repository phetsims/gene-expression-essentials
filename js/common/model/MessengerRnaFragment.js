// Copyright 2015-2022, University of Colorado Boulder

/**
 * Class that represents a fragment of messenger ribonucleic acid, or mRNA, in the model. The fragments exist for a short
 * time as mRNA is being destroyed, but can't be translated.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import { Shape } from '../../../../kite/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import MessengerRnaFragmentAttachmentStateMachine from './attachment-state-machines/MessengerRnaFragmentAttachmentStateMachine.js';
import SquareSegment from './SquareSegment.js';
import WindingBiomolecule from './WindingBiomolecule.js';

// constants
const MRNA_WINDING_ALGORITHMS = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

class MessengerRnaFragment extends WindingBiomolecule {

  /**
   * This creates the mRNA fragment as a single point, with the intention of growing it.
   *
   * @param {GeneExpressionModel} model
   * @param {Vector2} position
   */
  constructor( model, position ) {
    super( model, new Shape().moveToPoint( position ), position, {
      windingParamSet: MRNA_WINDING_ALGORITHMS[ dotRandom.nextInt( MRNA_WINDING_ALGORITHMS.length ) ]
    } );

    // Add the first, and in this case only, segment to the shape segment list.
    this.shapeSegments.push( new SquareSegment( this, position ) );
  }

  /**
   * Release this mRNA fragment from the destroyer molecule.
   * @public
   */
  releaseFromDestroyer() {
    this.attachmentStateMachine.detach();
  }

  /**
   * Creates the attachment state machine
   * @returns {MessengerRnaFragmentAttachmentStateMachine}
   * @public
   */
  createAttachmentStateMachine() {
    return new MessengerRnaFragmentAttachmentStateMachine( this );
  }
}

geneExpressionEssentials.register( 'MessengerRnaFragment', MessengerRnaFragment );

export default MessengerRnaFragment;