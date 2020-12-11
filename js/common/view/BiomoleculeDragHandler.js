// Copyright 2015-2020, University of Colorado Boulder

/**
 * drag handler for biomolecules
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import SimpleDragHandler from '../../../../scenery/js/input/SimpleDragHandler.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

class BiomoleculeDragHandler extends SimpleDragHandler {

  /**
   * @param {MobileBiomolecule} biomolecule
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( biomolecule, modelViewTransform ) {
    super( {
      allowTouchSnag: true,

      start: ( event, trail ) => {
        // The user is moving this, so they have control.
        biomolecule.userControlledProperty.set( true );
      },

      translate: translationParams => {
        const modelDelta = modelViewTransform.viewToModelDelta( translationParams.delta );
        biomolecule.translate( modelDelta.x, modelDelta.y );
      },

      end: event => {
        // The user is no longer moving this, so they have relinquished control.
        biomolecule.userControlledProperty.set( false );
      }
    } );

  }
}

geneExpressionEssentials.register( 'BiomoleculeDragHandler', BiomoleculeDragHandler );

export default BiomoleculeDragHandler;