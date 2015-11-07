// Copyright 2015, University of Colorado Boulder
/**
 *
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Shape = require( 'KITE/Shape' );
  var Protein = require( 'GENE_EXPRESSION_BASICS/common/model/Protein' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/model/StubGeneExpressionModel' );
  var Util = require( 'DOT/Util' );

  // constants
  var BASE_COLOR = new Color( 255, 99, 71 );
  var FULL_GROWN_WIDTH = 450;


  function ProteinA( model ) {
    model = model || new StubGeneExpressionModel();
    Protein.call( this, model, this.createInitialShape(), BASE_COLOR );
  }

  return inherit( Protein, ProteinA, {

    /**
     *
     * @param {number} growthFactor
     * @returns {Shape}
     */
    getUntranslatedShape: function( growthFactor ) {
      return this.createShape( growthFactor );
    },

    /**
     * @returns {ProteinA}
     */
    createInstance: function() {
      return new ProteinA( this.model );
    },

    /**
     * @param {Vector2} attachmentPointLocation
     */
    setAttachmentPointPosition: function( attachmentPointLocation ) {
      // Note: This is specific to this protein's shape, and will need to be
      // adjusted if the protein's shape algorithm changes.
      this.setAttachmentPointPositionXY( attachmentPointLocation.x, attachmentPointLocation.y );
    },

    /**
     *
     * @param {number} attachmentPointLocationX
     * @param {number} attachmentPointLocationY
     */
    setAttachmentPointPositionXY: function( attachmentPointLocationX, attachmentPointLocationY ) {
      // Note: This is specific to this protein's shape, and will need to be
      // adjusted if the protein's shape algorithm changes.
      this.setPosition( attachmentPointLocationX, attachmentPointLocationY +
                                                  ( FULL_GROWN_WIDTH / 2 * this.getFullSizeProportion() ) );
    },

    /**
     * @returns {Shape}
     */
    createInitialShape: function() {
      return this.createShape( 0 );
    },

    /**
     * @param {number} growthFactor
     * @returns {Shape}
     */
    createShape: function( growthFactor ) {
      var currentWidth = Util.clamp( growthFactor, 0.01, 1 ) * FULL_GROWN_WIDTH;
      var shape = new Shape();
      shape.moveTo( -currentWidth / 2, 0 );
      shape.lineTo( 0, -currentWidth / 2 );
      shape.lineTo( currentWidth / 2, 0 );
      shape.lineTo( 0, currentWidth / 2 );
      shape.lineTo( -currentWidth / 2, 0 );
      shape.close();

      return shape;
    }


  } );


} );

// Copyright 2002-2014, University of Colorado Boulder
//package edu.colorado.phet.geneexpressionbasics.manualgeneexpression.model;
//
//import java.awt.Color;
//import java.awt.Shape;
//
//import edu.colorado.phet.common.phetcommon.math.MathUtil;
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.view.util.DoubleGeneralPath;
//import edu.colorado.phet.geneexpressionbasics.common.model.GeneExpressionModel;
//import edu.colorado.phet.geneexpressionbasics.common.model.Protein;
//
///**
// * @author John Blanco
// */
//public class ProteinA extends Protein {
//
//    private static final Color BASE_COLOR = new Color( 255, 99, 71 );
//    private static final double FULL_GROWN_WIDTH = 450;
//
//    public ProteinA() {
//        this( new StubGeneExpressionModel() );
//    }
//
//    protected ProteinA( GeneExpressionModel model ) {
//        super( model, createInitialShape(), BASE_COLOR );
//    }
//
//    @Override protected Shape getUntranslatedShape( double growthFactor ) {
//        return createShape( growthFactor );
//    }
//
//    @Override public Protein createInstance() {
//        return new ProteinA( this.model );
//    }
//
//    @Override public void setAttachmentPointPosition( Vector2D attachmentPointLocation ) {
//        // Note: This is specific to this protein's shape, and will need to be
//        // adjusted if the protein's shape algorithm changes.
//        setPosition( attachmentPointLocation.getX(), attachmentPointLocation.getY() + ( FULL_GROWN_WIDTH / 2 * getFullSizeProportion() ) );
//    }
//
//    private static Shape createInitialShape() {
//        return createShape( 0 );
//    }
//
//    private static Shape createShape( double growthFactor ) {
//        final double currentWidth = MathUtil.clamp( 0.01, growthFactor, 1 ) * FULL_GROWN_WIDTH;
//        DoubleGeneralPath path = new DoubleGeneralPath( 0, 0 ) {{
//            moveTo( -currentWidth / 2, 0 );
//            lineTo( 0, -currentWidth / 2 );
//            lineTo( currentWidth / 2, 0 );
//            lineTo( 0, currentWidth / 2 );
//            lineTo( -currentWidth / 2, 0 );
//            closePath();
//        }};
//
//        return path.getGeneralPath();
//    }
//}
