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
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var BoundedDoubleProperty = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/BoundedDoubleProperty' );

  // constants
  var ATTACHED_THRESHOLD = 10; // Threshold used to decide whether or not a biomolecule is attached, in picometers.

  /**
   * @param {Vector2} initialLocation
   * @param {number} initialAffinity
   * @constructor
   */
  function AttachmentSite( initialLocation, initialAffinity ) {
    PropertySet.call( this, {
      // Location of this attachment site.  It is a property so that it can be
      // followed in the event that the biomolecule upon which it exists is
      // moving.
      location: initialLocation,

      // A property that tracks which if any biomolecule is attached to or moving
      // towards attachment with this site.
      attachedOrAttachingMolecule: null
    } );

    // Property that represents the affinity of the attachment site.
    this.affinityProperty = new BoundedDoubleProperty( initialAffinity, 0.0, 1.0 );
  }

  geneExpressionEssentials.register( 'AttachmentSite', AttachmentSite );

  return inherit( PropertySet, AttachmentSite, {

    get affinity() {
      return this.getAffinity();
    },

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
      return this.attachedOrAttachingMolecule !== null &&
             this.location.distance( this.attachedOrAttachingMolecule.getPosition() ) < ATTACHED_THRESHOLD;
    },

    /**
     * @param {Object} obj
     * @returns {boolean}
     */
    equals: function( obj ) {
      if ( this === obj ) { return true; }

      if ( !( obj instanceof AttachmentSite ) ) { return false; }

      var otherAttachmentSite = obj;

      return (this.affinity === otherAttachmentSite.affinity) && this.location.equals( otherAttachmentSite.location );
    }


  } );

} );