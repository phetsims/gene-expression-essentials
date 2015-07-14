//  Copyright 2002-2014, University of Colorado Boulder
/**
 * This class defines a shape that encloses a segment of the mRNA.  These
 * segments, connected together, are used to define the outline shape of
 * the mRNA strand. The path of the strand within these shape segments is
 * worked out elsewhere.
 * <p/>
 * Shape segments keep track of the length of mRNA that they contain, but
 * the don't explicitly contain references to the points that define the
 * shape.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Rectangle = require( 'DOT/Rectangle' );
  var Property = require( 'AXON/Property' );
  var AttachmentSite = require( 'GENE_EXPRESSION_BASICS/common/model/AttachmentSite' );

  // constants
  // Factor to use to avoid issues with floating point resolution.
  var FLOATING_POINT_COMP_FACTOR = 1E-7;


  function ShapeSegment() {

    // Bounds of this shape segment.
    this.bounds = new Property( new Rectangle() ); //TODO

    // Attachment point where anything that attached to this segment would
    // attach.  Affinity is arbitrary in this case.
    this.attachmentSite = new AttachmentSite( new Vector2(), 1 );

    // Max length of mRNA that this segment can contain.
    this.capacity = Number.MAX_VALUE;


  }

  return inherit( Object, ShapeSegment, {

    /**
     * @param {number} capacity
     */
    setCapacity: function( capacity ) {
      this.capacity = capacity;
    },

    /**
     * @returns {number}
     */
    getRemainingCapacity: function() {
      return this.capacity - this.getContainedLength();
    },

    /**
     * @returns {Vector2}
     */
    getLowerRightCornerPos: function() {
      return new Vector2( this.bounds.get().getMaxX(), this.bounds.get().getMinY() );
    },

    /**
     * @param {Vector2} newLowerRightCornerPos
     */
    setLowerRightCornerPos: function( newLowerRightCornerPos ) {
      var currentLowerRightCornerPos = new Vector2( this.getLowerRightCornerPos() );
      var delta = new Vector2( newLowerRightCornerPos ).minus( currentLowerRightCornerPos );
      var newBounds = this.bounds.get().transformed( Matrix3.translation( delta.x, delta.y ) ).getBounds2D();
      this.bounds.set( newBounds );
      this.updateAttachmentSiteLocation();
    },

    /**
     * @returns {Vector2}
     */
    getUpperLeftCornerPos: function() {
      return new Vector2( this.bounds.get().getMinX(), this.bounds.get().getMaxY() );
    },

    /**
     * @param {Vector2} upperLeftCornerPosition
     */
    setUpperLeftCornerPosition: function( upperLeftCornerPosition ) {
      this.bounds.set( new Rectangle( upperLeftCornerPosition.x,
        upperLeftCornerPosition.y - this.bounds.get().getHeight(),
        this.bounds.get().getWidth(),
        this.bounds.get().getHeight() ) );
      this.updateAttachmentSiteLocation();
    },

    /**
     *
     * @param {Vector2} translationVector
     */
    translate: function( translationVector ) {
      this.bounds.set( new Rectangle( this.bounds.get().x + translationVector.x,
        this.bounds.get().y + translationVector.y,
        this.bounds.get().getWidth(),
        this.bounds.get().getHeight() ) );
      this.updateAttachmentSiteLocation();
    },

    /**
     * @returns {Rectangle}
     */
    getBounds: function() {
      return new Rectangle( this.bounds.get().x, this.bounds.get().y, this.bounds.get().getWidth(), this.bounds.get().getHeight() );
    },

    /**
     * @returns {boolean}
     */
    isFlat: function() {
      return this.getBounds().height === 0;
    },

    updateAttachmentSiteLocation: function() {
      this.attachmentSite.locationProperty.set( this.getUpperLeftCornerPos() );
    },

    /**
     * Get the length of the mRNA contained by this segment.
     *
     * @return {number}
     */
    getContainedLength: function() {
      throw new Error( 'getContainedLength should be implemented in descendant classes of ShapeSegment ' );
    },

    /**
     * Add the specified length of mRNA to the segment.  This will
     * generally cause the segment to grow.  By design, flat segments grow
     * to the left, square segments grow up and left.  The shape segment
     * list is also passed in so that new segments can be added if needed.
     *
     * @param {number} length
     * @param {EnhancedObservableList} shapeSegmentList
     */
    add: function( length, shapeSegmentList ) {
      throw new Error( 'add should be implemented in descendant classes of ShapeSegment ' );
    },

    /**
     * Remove the specified amount of mRNA from the segment.  This will
     * generally cause a segment to shrink.  Flat segments shrink in from
     * the right, square segments shrink from the lower right corner
     * towards the upper left.  The shape segment list is also a parameter
     * so that shape segments can be removed if necessary.
     *
     * @param {number} length
     * @param {EnhancedObservableList} shapeSegmentList
     */
    remove: function( length, shapeSegmentList ) {
      throw new Error( 'remove should be implemented in descendant classes of ShapeSegment ' );
    },

    /**
     * Advance the mRNA through this shape segment.  This is what happens
     * when the mRNA is being translated by a ribosome into a protein.  The
     * list of shape segments is also a parameter in case segments need to
     * be added or removed.
     *
     * @param length
     * @param {EnhancedObservableList} shapeSegmentList
     */
    advance: function( length, shapeSegmentList ) {
      throw new Error( 'advance should be implemented in descendant classes of ShapeSegment ' );
    },


    /**
     * Advance the mRNA through this segment but also reduce the segment
     * contents by the given length.  This is used when the mRNA is being
     * destroyed.
     *
     * @param length
     * @param  {EnhancedObservableList} shapeSegmentList
     */
    advanceAndRemove: function( length, shapeSegmentList ) { //TODO EnhancedObservableList
      throw new Error( 'advance should be implemented in descendant classes of ShapeSegment ' );
    }


  }, {

    FLOATING_POINT_COMP_FACTOR: FLOATING_POINT_COMP_FACTOR

  } );


} );

//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.model;
//
//import java.awt.geom.AffineTransform;
//import java.awt.geom.Rectangle2D;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//
///**
// * This class defines a shape that encloses a segment of the mRNA.  These
// * segments, connected together, are used to define the outline shape of
// * the mRNA strand. The path of the strand within these shape segments is
// * worked out elsewhere.
// * <p/>
// * Shape segments keep track of the length of mRNA that they contain, but
// * the don't explicitly contain references to the points that define the
// * shape.
// */
//public abstract class ShapeSegment {
//
//    // Factor to use to avoid issues with floating point resolution.
//    private static final double FLOATING_POINT_COMP_FACTOR = 1E-7;
//
//    // Bounds of this shape segment.
//    public final Property<Rectangle2D> bounds = new Property<Rectangle2D>( new Rectangle2D.Double() );
//
//    // Attachment point where anything that attached to this segment would
//    // attach.  Affinity is arbitrary in this case.
//    public final AttachmentSite attachmentSite = new AttachmentSite( new Vector2D(), 1 );
//
//    // Max length of mRNA that this segment can contain.
//    public double capacity = Double.POSITIVE_INFINITY;
//
//    public void setCapacity( double capacity ) {
//        this.capacity = capacity;
//    }
//
//    public double getRemainingCapacity() {
//        return capacity - getContainedLength();
//    }
//
//    public Vector2D getLowerRightCornerPos() {
//        return new Vector2D( bounds.get().getMaxX(), bounds.get().getMinY() );
//    }
//
//    public void setLowerRightCornerPos( Vector2D newLowerRightCornerPos ) {
//        Vector2D currentLowerRightCornerPos = new Vector2D( getLowerRightCornerPos() );
//        Vector2D delta = new Vector2D( newLowerRightCornerPos ).minus( currentLowerRightCornerPos );
//        Rectangle2D newBounds = AffineTransform.getTranslateInstance( delta.getX(), delta.getY() ).createTransformedShape( bounds.get() ).getBounds2D();
//        bounds.set( newBounds );
//        updateAttachmentSiteLocation();
//    }
//
//    public Vector2D getUpperLeftCornerPos() {
//        return new Vector2D( bounds.get().getMinX(), bounds.get().getMaxY() );
//    }
//
//    public void setUpperLeftCornerPosition( Vector2D upperLeftCornerPosition ) {
//        bounds.set( new Rectangle2D.Double( upperLeftCornerPosition.getX(),
//                                            upperLeftCornerPosition.getY() - bounds.get().getHeight(),
//                                            bounds.get().getWidth(),
//                                            bounds.get().getHeight() ) );
//        updateAttachmentSiteLocation();
//    }
//
//    public void translate( Vector2D translationVector ) {
//        bounds.set( new Rectangle2D.Double( bounds.get().getX() + translationVector.getX(),
//                                            bounds.get().getY() + translationVector.getY(),
//                                            bounds.get().getWidth(),
//                                            bounds.get().getHeight() ) );
//        updateAttachmentSiteLocation();
//    }
//
//    public Rectangle2D getBounds() {
//        return new Rectangle2D.Double( bounds.get().getX(), bounds.get().getY(), bounds.get().getWidth(), bounds.get().getHeight() );
//    }
//
//    public boolean isFlat() {
//        return getBounds().getHeight() == 0;
//    }
//
//    protected void updateAttachmentSiteLocation() {
//        attachmentSite.locationProperty.set( getUpperLeftCornerPos() );
//    }
//
//    /**
//     * Get the length of the mRNA contained by this segment.
//     *
//     * @return
//     */
//    public abstract double getContainedLength();
//
//    /**
//     * Add the specified length of mRNA to the segment.  This will
//     * generally cause the segment to grow.  By design, flat segments grow
//     * to the left, square segments grow up and left.  The shape segment
//     * list is also passed in so that new segments can be added if needed.
//     *
//     * @param length
//     * @param shapeSegmentList
//     */
//    public abstract void add( double length, WindingBiomolecule.EnhancedObservableList<ShapeSegment> shapeSegmentList );
//
//    /**
//     * Remove the specified amount of mRNA from the segment.  This will
//     * generally cause a segment to shrink.  Flat segments shrink in from
//     * the right, square segments shrink from the lower right corner
//     * towards the upper left.  The shape segment list is also a parameter
//     * so that shape segments can be removed if necessary.
//     *
//     * @param length
//     * @param shapeSegmentList
//     */
//    protected abstract void remove( double length, MessengerRna.EnhancedObservableList<ShapeSegment> shapeSegmentList );
//
//    /**
//     * Advance the mRNA through this shape segment.  This is what happens
//     * when the mRNA is being translated by a ribosome into a protein.  The
//     * list of shape segments is also a parameter in case segments need to
//     * be added or removed.
//     *
//     * @param length
//     * @param shapeSegmentList
//     */
//    public abstract void advance( double length, MessengerRna.EnhancedObservableList<ShapeSegment> shapeSegmentList );
//
//
//    /**
//     * Advance the mRNA through this segment but also reduce the segment
//     * contents by the given length.  This is used when the mRNA is being
//     * destroyed.
//     *
//     * @param length
//     * @param shapeSegmentList
//     */
//    public abstract void advanceAndRemove( double length, MessengerRna.EnhancedObservableList<ShapeSegment> shapeSegmentList );
//
//    /**
//     * Flat segment - has no height, so rRNA contained in this segment is
//     * not wound.
//     */
//    public static class FlatSegment extends ShapeSegment {
//
//        public FlatSegment( Vector2D origin ) {
//            bounds.set( new Rectangle2D.Double( origin.getX(), origin.getY(), 0, 0 ) );
//            updateAttachmentSiteLocation();
//        }
//
//        @Override public double getContainedLength() {
//            // For a flat segment, the length of mRNA contained is equal to
//            // the width.
//            return bounds.get().getWidth();
//        }
//
//        @Override public void add( double length, MessengerRna.EnhancedObservableList<ShapeSegment> shapeSegmentList ) {
//            assert getContainedLength() <= capacity; // This shouldn't be called if there is no remaining capacity.
//            double growthAmount = length;
//            if ( getContainedLength() + length > capacity ) {
//                // This segment can't hold the specified length.  Add a new
//                // square segment to the end of the segment list and put
//                // the excess in there.
//                ShapeSegment newSquareSegment = new SquareSegment( getLowerRightCornerPos() );
//                growthAmount = capacity - getContainedLength(); // Clamp growth at remaining capacity.
//                newSquareSegment.add( length - growthAmount, shapeSegmentList );
//                shapeSegmentList.insertAfter( this, newSquareSegment );
//            }
//            // Grow the bounds linearly to the left to accommodate the
//            // additional length.
//            bounds.set( new Rectangle2D.Double( bounds.get().getX() - growthAmount,
//                                                bounds.get().getY(),
//                                                bounds.get().getWidth() + growthAmount,
//                                                0 ) );
//            updateAttachmentSiteLocation();
//        }
//
//        @Override public void remove( double length, MessengerRna.EnhancedObservableList<ShapeSegment> shapeSegmentList ) {
//            bounds.set( new Rectangle2D.Double( bounds.get().getX(), bounds.get().getY(), bounds.get().getWidth() - length, 0 ) );
//            // If the length has gotten to zero, remove this segment from
//            // the list.
//            if ( getContainedLength() < FLOATING_POINT_COMP_FACTOR ) {
//                shapeSegmentList.remove( this );
//            }
//            updateAttachmentSiteLocation();
//        }
//
//        @Override public void advance( double length, MessengerRna.EnhancedObservableList<ShapeSegment> shapeSegmentList ) {
//            ShapeSegment outputSegment = shapeSegmentList.getPreviousItem( this );
//            ShapeSegment inputSegment = shapeSegmentList.getNextItem( this );
//            if ( inputSegment == null ) {
//                // There is no input segment, meaning that the end of the
//                // mRNA strand is contained in THIS segment, so this
//                // segment needs to shrink.
//                double lengthToAdvance = Math.min( length, getContainedLength() );
//                this.remove( lengthToAdvance, shapeSegmentList );
//                outputSegment.add( lengthToAdvance, shapeSegmentList );
//            }
//            else if ( inputSegment.getContainedLength() > length ) {
//                // The input segment contains enough mRNA length to supply
//                // this segment with the needed length.
//                if ( getContainedLength() + length <= capacity ) {
//                    // The new length isn't enough to fill up this segment,
//                    // so this segment just needs to grow.
//                    add( length, shapeSegmentList );
//                }
//                else {
//                    // This segment is full or close enough to being full
//                    // that it can't accommodate all of the specified
//                    // length.  Some or all of that length must go in the
//                    // output segment.
//                    double remainingCapacity = getRemainingCapacity();
//                    if ( remainingCapacity > FLOATING_POINT_COMP_FACTOR ) {
//                        // Not quite full yet - fill it up.
//                        maxOutLength();
//                        // This situation - one in which a segment that is
//                        // having the mRNA advanced through it but it not
//                        // yet full - should only occur when this segment
//                        // is the first one on the shape segment list.  So,
//                        // add a new one to the front of the segment list,
//                        // but first, make sure there isn't something there
//                        // already.
//                        assert outputSegment == null;
//                        ShapeSegment newLeaderSegment = new FlatSegment( this.getUpperLeftCornerPos() ) {{
//                            setCapacity( MessengerRna.LEADER_LENGTH );
//                        }};
//                        shapeSegmentList.insertBefore( this, newLeaderSegment );
//                        outputSegment = newLeaderSegment;
//                    }
//                    // Add some or all of the length to the output segment.
//                    outputSegment.add( length - remainingCapacity, shapeSegmentList );
//                }
//                // Remove the length from the input segment.
//                inputSegment.remove( length, shapeSegmentList );
//            }
//            else {
//                // The input segment is still around, but doesn't have
//                // the specified advancement length within it.  Shrink it
//                // to zero, which will remove it, and then shrink the
//                // advancing segment by the remaining amount.
//                this.remove( length - inputSegment.getContainedLength(), shapeSegmentList );
//                inputSegment.remove( inputSegment.getContainedLength(), shapeSegmentList );
//                outputSegment.add( length, shapeSegmentList );
//            }
//            updateAttachmentSiteLocation();
//        }
//
//        @Override public void advanceAndRemove( double length, MessengerRna.EnhancedObservableList<ShapeSegment> shapeSegmentList ) {
//            ShapeSegment inputSegment = shapeSegmentList.getNextItem( this );
//            if ( inputSegment == null ) {
//                // There is no input segment, meaning that the end of the mRNA
//                // strand is contained in THIS segment, so this segment needs
//                // to shrink.
//                double lengthToRemove = Math.min( length, getContainedLength() );
//                this.remove( lengthToRemove, shapeSegmentList );
//            }
//            else if ( inputSegment.getContainedLength() > length ) {
//                // The input segment contains enough mRNA to satisfy this
//                // request, so remove the length from there.
//                inputSegment.remove( length, shapeSegmentList );
//            }
//            else {
//                // The input segment is still around, but doesn't have
//                // enough mRNA within it.  Shrink the input segment to zero
//                // and then shrink this segment by the remaining amount.
//                this.remove( length - inputSegment.getContainedLength(), shapeSegmentList );
//                inputSegment.remove( inputSegment.getContainedLength(), shapeSegmentList );
//            }
//            updateAttachmentSiteLocation();
//        }
//
//        // Set size to be exactly the capacity.  Do not create any new
//        // segments.
//        private void maxOutLength() {
//            double growthAmount = getRemainingCapacity();
//            bounds.set( new Rectangle2D.Double( bounds.get().getX() - growthAmount,
//                                                bounds.get().getY(),
//                                                capacity,
//                                                0 ) );
//            updateAttachmentSiteLocation();
//        }
//    }
//
//    /**
//     * Class that defines a square segment, which is one in which the mRNA
//     * can be (and generally is) curled up.
//     */
//    public static class SquareSegment extends ShapeSegment {
//
//        // Maintain an explicit value for the length of the mRNA contained
//        // within this segment even though the bounds essentially define
//        // said length.  This helps to avoid floating point issues.
//        private double containedLength = 0;
//
//        public SquareSegment( Vector2D origin ) {
//            bounds.set( new Rectangle2D.Double( origin.getX(), origin.getY(), 0, 0 ) );
//            updateAttachmentSiteLocation();
//        }
//
//        @Override public double getContainedLength() {
//            return containedLength;
//        }
//
//        @Override public void add( double length, MessengerRna.EnhancedObservableList<ShapeSegment> shapeSegmentList ) {
//            add( length );
//        }
//
//        public void add( double length ) {
//            containedLength += length;
//            // Grow the bounds up and to the left to accommodate the
//            // additional length.
//            double sideGrowthAmount = calculateSideLength() - bounds.get().getWidth();
//            assert length >= 0 && sideGrowthAmount >= 0; //
//            bounds.set( new Rectangle2D.Double( bounds.get().getX() - sideGrowthAmount,
//                                                bounds.get().getY(),
//                                                bounds.get().getWidth() + sideGrowthAmount,
//                                                bounds.get().getHeight() + sideGrowthAmount ) );
//            updateAttachmentSiteLocation();
//        }
//
//        @Override public void remove( double length, MessengerRna.EnhancedObservableList<ShapeSegment> shapeSegmentList ) {
//            containedLength -= length;
//            // Shrink by moving the lower right corner up and to the left.
//            double sideShrinkageAmount = bounds.get().getWidth() - calculateSideLength();
//            assert length >= 0 && sideShrinkageAmount >= 0; //
//            bounds.set( new Rectangle2D.Double( bounds.get().getX(),
//                                                bounds.get().getY() + sideShrinkageAmount,
//                                                bounds.get().getWidth() - sideShrinkageAmount,
//                                                bounds.get().getHeight() - sideShrinkageAmount ) );
//            // If the length has gotten to zero, remove this segment from
//            // the list.
//            if ( getContainedLength() <= FLOATING_POINT_COMP_FACTOR ) {
//                shapeSegmentList.remove( this );
//            }
//            updateAttachmentSiteLocation();
//        }
//
//        @Override public void advance( double length, MessengerRna.EnhancedObservableList<ShapeSegment> shapeSegmentList ) {
//            // This should never be called for square shape segments, since
//            // translation should only occur based around flat segments.
//            assert false;
//        }
//
//        @Override public void advanceAndRemove( double length, MessengerRna.EnhancedObservableList<ShapeSegment> shapeSegmentList ) {
//            System.out.println( getClass().getName() + "Unimplemented method called on square shape segment." );
//            assert false; // Shouldn't be called for square segments.
//        }
//
//        // Determine the length of a side as a function of the contained
//        // length of mRNA.
//        private double calculateSideLength() {
//            double desiredDiagonalLength = Math.pow( containedLength, 0.7 ); // Power value was empirically determined.
//            return Math.sqrt( 2 * desiredDiagonalLength * desiredDiagonalLength );
//        }
//    }
//}
