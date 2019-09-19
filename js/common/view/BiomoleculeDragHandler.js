// Copyright 2015-2017, University of Colorado Boulder

/**
 * drag handler for biomolecules
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

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

  return inherit( SimpleDragHandler, BiomoleculeDragHandler );
} );