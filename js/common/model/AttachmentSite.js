// Copyright 2015-2020, University of Colorado Boulder

/**
 * An attachment site is a single point in model space to which a biomolecule may attach. Typically, one biomolecule
 * (e.g. a DnaMolecule) owns the attachment site, so if the biomolecule that owns it moves, the attachment site should
 * move with it.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

// constants
const ATTACHED_THRESHOLD = 10; // Threshold used to decide whether or not a biomolecule is attached, in picometers.

class AttachmentSite {

  /**
   * @param {Object} owner - the molecule upon which this attachment site exists
   * @param {Vector2} initialPosition
   * @param {number} initialAffinity
   */
  constructor( owner, initialPosition, initialAffinity ) {

    // @public (read-only) {Object}
    this.owner = owner;

    // @public {Property.<Vector2> - position of this attachment site - it is a property so that it can be followed in
    // the event that the biomolecule upon which it exists is moving
    this.positionProperty = new Property( initialPosition );

    // @public {Property.<MobileBiomolecule>} - a property that tracks which if any biomolecule is attached to or moving
    // towards attachment with this site
    this.attachedOrAttachingMoleculeProperty = new Property( null );

    // @public {NumberProperty} - affinity of the attachment site, meaning how strongly things attach
    this.affinityProperty = new NumberProperty( initialAffinity, { range: new Range( 0.0, 1.0 ) } );
  }

  /**
   * Return the affinity of attachment site
   * @returns {number}
   * @public
   */
  getAffinity() {
    return this.affinityProperty.get();
  }

  /**
   * Indicates whether or not a biomolecules is currently attached to this site.
   * @returns {boolean} - true if a biomolecule is fully attached, false if not.  If a molecule is on its way but not
   * yet at the site, false is returned.
   * @public
   */
  isMoleculeAttached() {
    return this.attachedOrAttachingMoleculeProperty.get() !== null &&
           this.positionProperty.get().distance( this.attachedOrAttachingMoleculeProperty.get().getPosition() ) < ATTACHED_THRESHOLD;
  }

  /**
   * @param {AttachmentSite} obj
   * @returns {boolean}
   * @public
   */
  equals( obj ) {
    if ( this === obj ) { return true; }

    if ( !( obj instanceof AttachmentSite ) ) { return false; }

    const otherAttachmentSite = obj;

    return ( this.affinityProperty.get() === otherAttachmentSite.affinityProperty.get() ) &&
           this.positionProperty.get().equals( otherAttachmentSite.positionProperty.get() );
  }
}

geneExpressionEssentials.register( 'AttachmentSite', AttachmentSite );

export default AttachmentSite;
