// Copyright 2015-2020, University of Colorado Boulder

/**
 * drag handler for biomolecules
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import inherit from '../../../../phet-core/js/inherit.js';
import SimpleDragHandler from '../../../../scenery/js/input/SimpleDragHandler.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

/**
 *
 * @param {MobileBiomolecule} biomolecule
 * @param {ModelViewTransform2} modelViewTransform
 * @constructor
 */
function BiomoleculeDragHandler( biomolecule, modelViewTransform ) {
  const self = this;
  SimpleDragHandler.call( self, {
    allowTouchSnag: true,

    start: function( event, trail ) {
      // The user is moving this, so they have control.
      biomolecule.userControlledProperty.set( true );
    },

    translate: function( translationParams ) {
      const modelDelta = modelViewTransform.viewToModelDelta( translationParams.delta );
      biomolecule.translate( modelDelta.x, modelDelta.y );
    },

    end: function( event ) {
      // The user is no longer moving this, so they have relinquished control.
      biomolecule.userControlledProperty.set( false );
    }
  } );

}

geneExpressionEssentials.register( 'BiomoleculeDragHandler', BiomoleculeDragHandler );

inherit( SimpleDragHandler, BiomoleculeDragHandler );
export default BiomoleculeDragHandler;