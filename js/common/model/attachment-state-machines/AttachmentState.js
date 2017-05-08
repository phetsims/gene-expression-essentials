// Copyright 2015, University of Colorado Boulder

/**
 * Base class for individual attachment states, used by the various attachment state machines.
 *
 * @author John Blanco
 * @author Mohamed Safi
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
    // does nothing in base type
  }

  geneExpressionEssentials.register( 'AttachmentState', AttachmentState );

  return inherit( Object, AttachmentState, {

    /**
     * Step function for this attachment state and is called by the step function of AttachmentStateMachine
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @param {number} dt
     * @public
     */
    step: function( enclosingStateMachine, dt ) {
      // By default does nothing, override to implement unique behavior.
    },

    /**
     * This is called whenever biomolecules state changes. This is called when setState function of
     * AttachmentStateMachine is called
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @public
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
