// Copyright 2015-2017, University of Colorado Boulder

/**
 * Base class for proteins. Defines the methods used for growing a protein.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  //modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var GenericUnattachedAndAvailableState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericUnattachedAndAvailableState' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MobileBiomolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MobileBiomolecule' );
  var Property = require( 'AXON/Property' );
  var ProteinAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/ProteinAttachmentStateMachine' );

  // constants
  var MAX_GROWTH_FACTOR = 1; // Max value for the growth factor, indicates that it is fully grown.

  /**
   *
   * @param {GeneExpressionModel} model
   * @param {Shape} initialShape
   * @param {Color} baseColor
   * @constructor
   */
  function Protein( model, initialShape, baseColor ) {
    MobileBiomolecule.call( this, model, initialShape, baseColor );

    // Property that gets set when this protein is fully formed and released.
    this.fullGrownProperty = new Property( false ); // @public(read-only)

    // A value between 0 and 1 that defines how fully developed, or "grown"  this protein is.
    this.fullSizeProportion = 0; // @private
  }

  geneExpressionEssentials.register( 'Protein', Protein );
  return inherit( MobileBiomolecule, Protein, {

    /**
     * @override
     * Create the attachment state machine that will govern the way in which this biomolecule attaches to and detaches
     * from other biomolecules.
     * @returns {ProteinAttachmentStateMachine}
     * @public
     */
    createAttachmentStateMachine: function() {
      return new ProteinAttachmentStateMachine( this );
    },

    /**
     * Set the size of this protein by specifying the proportion of its full size.
     * @param {number} proportion - Value between 0 and 1 indicating the proportion of this protein's fully grown size
     * @public
     */
    setFullSizeProportion: function( proportion ) {
      assert && assert( proportion >= 0 && proportion <= 1, 'proportion value out of range: ' + proportion );
      if ( this.fullSizeProportion !== proportion ) {
        this.fullSizeProportion = proportion;
        this.shapeProperty.set( this.getScaledShape( proportion ) );
        this.colorProperty.notifyListenersStatic(); // TODO: Is this really necessary and, if so, why?
      }
    },

    /**
     * @returns {number}
     * @public
     */
    getFullSizeProportion: function() {
      return this.fullSizeProportion;
    },

    /**
     * @param {number} growthFactor
     * @protected
     */
    getScaledShape: function( growthFactor ) {
      throw new Error( 'getScaledShape should be implemented in descendant classes of Protein' );
    },

    /**
     * Method to get an untranslated (in terms of position, not language) version of this protein's shape when it fully
     * grown. This is intended for use in creating control panel shapes that match this protein's shape.
     *
     * @return Shape representing the fully developed protein.
     * @public
     */
    getFullyGrownShape: function() {
      return this.getScaledShape( MAX_GROWTH_FACTOR );
    },

    /**
     * @public
     */
    createInstance: function() {
      throw new Error( 'createInstance should be implemented in descendant classes of Protein' );
    },

    /**
     * Release this protein from the ribosome and allow it to drift around in the cell.
     * @public
     */
    release: function() {
      this.attachmentStateMachine.setState( new GenericUnattachedAndAvailableState() );
      this.fullGrownProperty.set( true );
    },

    /**
     * Set the position of this protein such that its "attachment point", which is the point from which it grows when it
     * is being synthesized, is at the specified location.
     *
     * @param attachmentPointLocation
     * @public
     */
    setAttachmentPointPosition: function( attachmentPointLocation ) {
      throw new Error( 'setAttachmentPointPosition should be implemented in descendant classes of Protein' );
    }
  } );
} );