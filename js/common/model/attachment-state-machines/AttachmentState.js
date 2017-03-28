// Copyright 2015, University of Colorado Boulder

/**
 * Base class for individual attachment states, used by the various attachment
 * state machines.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */

define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @abstract class
   * @constructor
   */
  function AttachmentState() {

  }

  geneExpressionEssentials.register( 'AttachmentState', AttachmentState );

  return inherit( Object, AttachmentState, {

    /**
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @param {number} dt
     */
    stepInTime: function( enclosingStateMachine, dt ) {
      // By default does nothing, override to implement unique behavior.
    },

    /**
     * @param {AttachmentStateMachine} enclosingStateMachine
     */
    entered: function( enclosingStateMachine ) {
      // By default does nothing, override to implement unique behavior.
    }

  }, {
    // Distance within which a molecule is considered to be attached to an attachment site. This essentially avoids
    // floating point issues.
    ATTACHED_DISTANCE_THRESHOLD: 1 // In picometers.
  } );
} );
