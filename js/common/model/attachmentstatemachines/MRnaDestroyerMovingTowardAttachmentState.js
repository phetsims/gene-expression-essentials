// Copyright 2002-2015, University of Colorado Boulder
/**
 /**
 *  Use generic state except that interaction is turned off.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AttachmentState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentState' );

  /**
   *
   * @constructor
   * @param  {RnaDestroyerAttachmentStateMachine} rnaDestroyerAttachmentStateMachine
   */
  function MRnaDestroyerMovingTowardAttachmentState( rnaDestroyerAttachmentStateMachine ) {
    AttachmentState.call( this );
    this.rnaDestroyerAttachmentStateMachine = rnaDestroyerAttachmentStateMachine;
  }

  return inherit( AttachmentState, MRnaDestroyerMovingTowardAttachmentState, {

    /**
     * @Override
     * @param {AttachmentStateMachine} asm
     */
    entered: function( asm ) {
      AttachmentState.prototype.entered.call( this );
      asm.biomolecule.movableByUser = false;
    }

  } );

} );