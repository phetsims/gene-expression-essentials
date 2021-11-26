// Copyright 2015-2021, University of Colorado Boulder

/**
 * drag handler for biomolecules
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import { DragListener } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

class BiomoleculeDragHandler extends DragListener {

  /**
   * @param {MobileBiomolecule} biomolecule
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( biomolecule, modelViewTransform ) {

    super( {
      positionProperty: biomolecule.positionProperty,
      transform: modelViewTransform,
      allowTouchSnag: true,

      start: () => {

        // The user is moving this, so they have control.
        biomolecule.userControlledProperty.set( true );
      },

      end: () => {

        // The user is no longer moving this, so they have relinquished control.
        biomolecule.userControlledProperty.set( false );
      }
    } );

  }
}

geneExpressionEssentials.register( 'BiomoleculeDragHandler', BiomoleculeDragHandler );

export default BiomoleculeDragHandler;