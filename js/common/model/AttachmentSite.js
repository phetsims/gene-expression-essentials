// Copyright 2015, University of Colorado Boulder

/**
 * An attachment site is a single point in model space to which a biomolecule may attach. Typically, one biomolecule
 * (e.g. a DnaMolecule) owns the attachment site, so if the biomolecule that owns it moves, the attachment site should
 * move with it.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );

  // constants
  var ATTACHED_THRESHOLD = 10; // Threshold used to decide whether or not a biomolecule is attached, in picometers.

  /**
   * @param {Object} owner - the molecule upon which this attachment site exists
   * @param {Vector2} initialLocation
   * @param {number} initialAffinity
   * @constructor
   */
  function AttachmentSite( owner, initialLocation, initialAffinity ) {

    // @public (read-only) {Object}
    this.owner = owner;

    // Location of this attachment site. It is a property so that it can be followed in the event that the biomolecule
    // upon which it exists is moving.
    this.locationProperty = new Property( initialLocation ); // @public

    // A property that tracks which if any biomolecule is attached to or moving towards attachment with this site.
    this.attachedOrAttachingMoleculeProperty = new Property( null ); // @public

    // Property that represents the affinity of the attachment site.
    this.affinityProperty = new NumberProperty( initialAffinity, { range: { min: 0.0, max: 1.0 } } ); // @private
  }

  geneExpressionEssentials.register( 'AttachmentSite', AttachmentSite );

  return inherit( Object, AttachmentSite, {

    /**
     * Return the affinity of attachment site
     * @returns {number}
     * @public
     */
    getAffinity: function() {
      return this.affinityProperty.get();
    },

    /**
     * Indicates whether or not a biomolecules is currently attached to this site.
     * @returns {boolean} - true if a biomolecule is fully attached, false if not.  If a molecule is on its way but not
     * yet at the site, false is returned.
     * @public
     */
    isMoleculeAttached: function() {
      return this.attachedOrAttachingMoleculeProperty.get() !== null &&
             this.locationProperty.get().distance( this.attachedOrAttachingMoleculeProperty.get().getPosition() ) < ATTACHED_THRESHOLD;
    },

    /**
     * @param {AttachmentSite} obj
     * @returns {boolean}
     * @public
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