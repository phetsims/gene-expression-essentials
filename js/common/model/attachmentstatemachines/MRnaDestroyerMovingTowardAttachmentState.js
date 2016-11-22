// Copyright 2015, University of Colorado Boulder
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
  var GenericMovingTowardsAttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/GenericMovingTowardsAttachmentState' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );

  /**
   *
   * @constructor
   * @param  {RnaDestroyerAttachmentStateMachine} rnaDestroyerAttachmentStateMachine
   */
  function MRnaDestroyerMovingTowardAttachmentState( rnaDestroyerAttachmentStateMachine ) {
    GenericMovingTowardsAttachmentState.call( this );
    this.rnaDestroyerAttachmentStateMachine = rnaDestroyerAttachmentStateMachine;
  }

  geneExpressionEssentials.register( 'MRnaDestroyerMovingTowardAttachmentState', MRnaDestroyerMovingTowardAttachmentState );

  return inherit( GenericMovingTowardsAttachmentState, MRnaDestroyerMovingTowardAttachmentState, {

    /**
     * @Override
     * @param {AttachmentStateMachine} asm
     */
    entered: function( asm ) {
      //GenericMovingTowardsAttachmentState.prototype.entered.call( this );
      asm.biomolecule.movableByUserProperty.set( false );
    }

  } );

} );