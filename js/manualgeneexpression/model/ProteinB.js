// Copyright 2015, University of Colorado Boulder
/**
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Protein = require( 'GENE_EXPRESSION_BASICS/common/model/Protein' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/model/StubGeneExpressionModel' );
  var Util = require( 'DOT/Util' );
  var Color = require( 'SCENERY/util/Color' );

  // constants
  var BASE_COLOR = new Color( 255, 99, 71 );
  var FULL_GROWN_WIDTH = 450;

  function ProteinB( model ) {
    model = model || new StubGeneExpressionModel();
    Protein.call( this, model, this.createInitialShape(), BASE_COLOR );
  }

  return inherit( Protein, ProteinB, {


    /**
     * //protected
     * @param {number} growthFactor
     * @returns {Shape}
     */
    getUntranslatedShape: function( growthFactor ) {
      return this.createShape( growthFactor );
    },

    /**
     * @param {Vector2} attachmentPointLocation
     */
    setAttachmentPointPosition: function( attachmentPointLocation ) {
      // Note: This is specific to this protein's shape, and will need to be
      // adjusted if the protein's shape algorithm changes.
      this.setPosition( attachmentPointLocation.x + FULL_GROWN_WIDTH * 0.12 * this.getFullSizeProportion(),
        attachmentPointLocation.y + FULL_GROWN_WIDTH * 0.45 * this.getFullSizeProportion() );
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
      var path = new Shape();
      var vector = new Vector2( -currentWidth / 2, 0 );
      path.moveTo( vector.x, vector.y );
      for ( var i = 0; i < 6; i++ ) {
        vector.rotate( Math.PI / 3 );
        path.lineTo( vector.x, vector.y );
      }
      path.close();
      return path;
    }


  } );


} );

// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.geneexpressionbasics.manualgeneexpression.model;
//
//import java.awt.Color;
//import java.awt.Shape;
//
//import edu.colorado.phet.common.phetcommon.math.MathUtil;
//import edu.colorado.phet.common.phetcommon.math.vector.MutableVector2D;
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.view.util.DoubleGeneralPath;
//import edu.colorado.phet.geneexpressionbasics.common.model.GeneExpressionModel;
//import edu.colorado.phet.geneexpressionbasics.common.model.Protein;
//
///**
// * @author John Blanco
// */
//public class ProteinB extends Protein {
//
//    private static final Color BASE_COLOR = new Color( 255, 99, 71 );
//
//    private static final double FULL_GROWN_WIDTH = 450;
//
//    public ProteinB() {
//        this( new StubGeneExpressionModel() );
//    }
//
//    protected ProteinB( GeneExpressionModel model ) {
//        super( model, createInitialShape(), BASE_COLOR );
//    }
//
//    @Override protected Shape getUntranslatedShape( double growthFactor ) {
//        return createShape( growthFactor );
//    }
//
//    @Override public Protein createInstance() {
//        return new ProteinB( this.model );
//    }
//
//    @Override public void setAttachmentPointPosition( Vector2D attachmentPointLocation ) {
//        // Note: This is specific to this protein's shape, and will need to be
//        // adjusted if the protein's shape algorithm changes.
//        setPosition( attachmentPointLocation.getX() + FULL_GROWN_WIDTH * 0.12 * getFullSizeProportion(),
//                     attachmentPointLocation.getY() + FULL_GROWN_WIDTH * 0.45 * getFullSizeProportion() );
//    }
//
//    private static Shape createInitialShape() {
//        return createShape( 0 );
//    }
//
//    private static Shape createShape( double growthFactor ) {
//        final double currentWidth = MathUtil.clamp( 0.01, growthFactor, 1 ) * FULL_GROWN_WIDTH;
//        DoubleGeneralPath path = new DoubleGeneralPath( 0, 0 ) {{
//            MutableVector2D vector = new MutableVector2D( -currentWidth / 2, 0 );
//            moveTo( vector.getX(), vector.getY() );
//            for ( int i = 0; i < 6; i++ ) {
//                vector.rotate( Math.PI / 3 );
//                lineTo( vector.getX(), vector.getY() );
//            }
//            closePath();
//        }};
//
//        return path.getGeneralPath();
//    }
//}
