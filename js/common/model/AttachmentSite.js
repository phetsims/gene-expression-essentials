// Copyright 2015, University of Colorado Boulder

/**
 * An attachment site is a single point in model space to which a biomolecule may attach.  Typically, one biomolecule
 * (e.g. a DnaMolecule) owns the attachment site, so if the biomolecule that owns it moves, the attachment site should
 * move with it.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */

define( function( require ) {
  'use strict';

  // modules
  var BoundedDoubleProperty = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/BoundedDoubleProperty' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // constants
  var ATTACHED_THRESHOLD = 10; // Threshold used to decide whether or not a biomolecule is attached, in picometers.

  /**
   * @param {Vector2} initialLocation
   * @param {number} initialAffinity
   * @constructor
   */
  function AttachmentSite( initialLocation, initialAffinity ) {

      // Location of this attachment site.  It is a property so that it can be
      // followed in the event that the biomolecule upon which it exists is
      // moving.
      this.locationProperty = new Property( initialLocation );

      // A property that tracks which if any biomolecule is attached to or moving
      // towards attachment with this site.
      this.attachedOrAttachingMoleculeProperty = new Property( null );

    // Property that represents the affinity of the attachment site.
    this.affinityProperty = new BoundedDoubleProperty( initialAffinity, 0.0, 1.0 );
  }

  geneExpressionEssentials.register( 'AttachmentSite', AttachmentSite );

  return inherit( Object, AttachmentSite, {

    /**
     * @returns {number}
     */
    getAffinity: function() {
      return this.affinityProperty.get();
    },

    /**
     * Indicates whether or not a biomolecules is currently attached to this site.
     * @return {boolean} - true if a biomolecule is fully attached, false if not.  If a molecule is on its way but not
     * yet at the site, false is returned.
     * @public
     */
    isMoleculeAttached: function() {
      return this.attachedOrAttachingMoleculeProperty.get() !== null &&
             this.locationProperty.get().distance( this.attachedOrAttachingMoleculeProperty.get().getPosition() ) < ATTACHED_THRESHOLD;
    },

    /**
     * @param {Object} obj
     * @returns {boolean}
     */
    equals: function( obj ) {
      if ( this === obj ) { return true; }

      if ( !( obj instanceof AttachmentSite ) ) { return false; }

      var otherAttachmentSite = obj;

      return (this.affinityProperty.get() === otherAttachmentSite.affinityProperty.get() ) &&
             this.locationProperty.get().equals( otherAttachmentSite.locationProperty.get() );
    }
  } );
} );