//  Copyright 2002-2014, University of Colorado Boulder
/**
 *Base class for proteins.  Defines the methods used for growing a protein.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MobileBiomolecule = require( 'GENE_EXPRESSION_BASICS/common/model/MobileBiomolecule' );
  var GenericUnattachedAndAvailableState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/GenericUnattachedAndAvailableState' );
  var ProteinAttachmentStateMachine = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/ProteinAttachmentStateMachine' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Property = require( 'AXON/Property' );

  // constants
  // Max value for the growth factor, indicates that it is fully grown.
  var MAX_GROWTH_FACTOR = 1;


  /**
   *
   * @param {GeneExpressionModel} model
   * @param {Shape} Shape
   * @param {Color} baseColor
   * @constructor
   */
  function Protein( model, initialShape, baseColor ) {
    MobileBiomolecule.call( this, model, initialShape, baseColor );

    // Property that gets set when this protein is fully formed and released.
    this.fullGrown = new Property( false );

    // A value between 0 and 1 that defines how fully developed, or "grown"
    // this protein is.
    this.fullSizeProportion = 0;// private
  }

  return inherit( MobileBiomolecule, Protein, {

    /**
     * Create the attachment state machine that will govern the way in which
     * this biomolecule attaches to and detaches from other biomolecules.
     * @Override
     * @return {ProteinAttachmentStateMachine}
     */
    createAttachmentStateMachine: function() {
      return new ProteinAttachmentStateMachine( this );
    },

    /**
     * Set the size of this protein by specifying the proportion of its full
     * size.
     *
     * @param fullSizeProportion - Value between 0 and 1 indicating the
     *                           proportion of this protein's full grown size that it should be.
     */
    setFullSizeProportion: function( fullSizeProportion ) {
      if ( this.fullSizeProportion !== fullSizeProportion ) {
        this.fullSizeProportion = fullSizeProportion;
        var transform = Matrix3.translation( this.getPosition().x, this.getPosition().y );
        var untranslatedShape = this.getUntranslatedShape( fullSizeProportion );
        this.shapeProperty.set( untranslatedShape.transformed( transform ) );
      }
    },

    getFullSizeProportion: function() {
      return this.fullSizeProportion;
    },

    getUntranslatedShape: function( growthFactor ) {
      throw new Error( 'getUntranslatedShape should be implemented in descendant classes of Protein .' );
    },

    /**
     * Method to get an untranslated (in terms of position, not language)
     * version of this protein's shape when it fully grown.  This is intended
     * for use in creating control panel shapes that match this protein's shape.
     *
     * @return Shape representing the fully developed protein.
     */
    getFullyGrownShape: function() {
      return this.getUntranslatedShape( MAX_GROWTH_FACTOR );
    },

    createInstance: function() {
      throw new Error( 'createInstance should be implemented in descendant classes of Protein .' );
    },

    /**
     * Release this protein from the ribosome and allow it to drift around in
     * the cell.
     */
    release: function() {
      this.attachmentStateMachine.setState( new GenericUnattachedAndAvailableState() );
      this.fullGrown.set( true );
    },

    /**
     * Set the position of this protein such that its "attachment point",
     * which is the point from which it grows when it is being synthesized,
     * is at the specified location.
     *
     * @param attachmentPointLocation
     */
    setAttachmentPointPosition: function( attachmentPointLocation ) {
      throw new Error( 'setAttachmentPointPosition should be implemented in descendant classes of Protein .' );
    }


  } );


} );

//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.model;
//
//import java.awt.Color;
//import java.awt.Shape;
//import java.awt.geom.AffineTransform;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.BooleanProperty;
//import edu.colorado.phet.geneexpressionbasics.common.model.attachmentstatemachines.AttachmentState;
//import edu.colorado.phet.geneexpressionbasics.common.model.attachmentstatemachines.AttachmentStateMachine;
//import edu.colorado.phet.geneexpressionbasics.common.model.attachmentstatemachines.ProteinAttachmentStateMachine;
//
///**
// * Base class for proteins.  Defines the methods used for growing a protein.
// *
// * @author John Blanco
// */
//public abstract class Protein extends MobileBiomolecule {
//
//    //-------------------------------------------------------------------------
//    // Class Data
//    //-------------------------------------------------------------------------
//
//    // Max value for the growth factor, indicates that it is fully grown.
//    private static final double MAX_GROWTH_FACTOR = 1;
//
//    //-------------------------------------------------------------------------
//    // Instance Data
//    //-------------------------------------------------------------------------
//
//    // Property that gets set when this protein is fully formed and released.
//    public final BooleanProperty fullGrown = new BooleanProperty( false );
//
//    // A value between 0 and 1 that defines how fully developed, or "grown"
//    // this protein is.
//    private double fullSizeProportion = 0;
//
//    //-------------------------------------------------------------------------
//    // Constructor
//    //-------------------------------------------------------------------------
//
//    protected Protein( GeneExpressionModel model, Shape initialShape, Color baseColor ) {
//        super( model, initialShape, baseColor );
//    }
//
//    //-------------------------------------------------------------------------
//    // Methods
//    //-------------------------------------------------------------------------
//
//    /**
//     * Create the attachment state machine that will govern the way in which
//     * this biomolecule attaches to and detaches from other biomolecules.
//     *
//     * @return
//     */
//    @Override protected AttachmentStateMachine createAttachmentStateMachine() {
//        return new ProteinAttachmentStateMachine( this );
//    }
//
//    /**
//     * Set the size of this protein by specifying the proportion of its full
//     * size.
//     *
//     * @param fullSizeProportion - Value between 0 and 1 indicating the
//     *                           proportion of this protein's full grown size that it should be.
//     */
//    public void setFullSizeProportion( double fullSizeProportion ) {
//        assert fullSizeProportion >= 0 && fullSizeProportion <= 1;
//        if ( this.fullSizeProportion != fullSizeProportion ) {
//            this.fullSizeProportion = fullSizeProportion;
//            AffineTransform transform = AffineTransform.getTranslateInstance( getPosition().getX(), getPosition().getY() );
//            Shape untranslatedShape = getUntranslatedShape( fullSizeProportion );
//            shapeProperty.set( transform.createTransformedShape( untranslatedShape ) );
//        }
//    }
//
//    public double getFullSizeProportion() {
//        return fullSizeProportion;
//    }
//
//    protected abstract Shape getUntranslatedShape( double growthFactor );
//
//    /**
//     * Method to get an untranslated (in terms of position, not language)
//     * version of this protein's shape when it fully grown.  This is intended
//     * for use in creating control panel shapes that match this protein's shape.
//     *
//     * @return Shape representing the fully developed protein.
//     */
//    public Shape getFullyGrownShape() {
//        return getUntranslatedShape( MAX_GROWTH_FACTOR );
//    }
//
//    public abstract Protein createInstance();
//
//    /**
//     * Release this protein from the ribosome and allow it to drift around in
//     * the cell.
//     */
//    public void release() {
//        attachmentStateMachine.setState( new AttachmentState.GenericUnattachedAndAvailableState() );
//        fullGrown.set( true );
//    }
//
//    /**
//     * Set the position of this protein such that its "attachment point",
//     * which is the point from which it grows when it is being synthesized,
//     * is at the specified location.
//     *
//     * @param attachmentPointLocation
//     */
//    abstract public void setAttachmentPointPosition( Vector2D attachmentPointLocation );
//}
