//  Copyright 2002-2015, University of Colorado Boulder
/**
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Protein = require( 'GENE_EXPRESSION_BASICS/common/model/Protein' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/model/StubGeneExpressionModel' );
  var Util = require( 'DOT/Util' );
  var Shape = require( 'KITE/Shape' );
  var ColorChangingCellNode = require( 'GENE_EXPRESSION_BASICS/multiplecells/view/ColorChangingCellNode' );

  // constants
  var BASE_COLOR = ColorChangingCellNode.FLORESCENT_FILL_COLOR; // Make the color look like the fluorescent green used in "multiple cells" tab.
  var FULL_GROWN_WIDTH = 320;

  function ProteinC( model ) {
    model = model || new StubGeneExpressionModel();
    Protein.call( this, model, this.createInitialShape(), BASE_COLOR );
  }

  return inherit( Protein, ProteinC, {

    /**
     * //protected
     * @param {number} growthFactor
     * @returns {Shape}
     */
    getUntranslatedShape: function( growthFactor ) {
      return this.createShape( growthFactor );
    },

    /**
     * @Override
     * @returns {ProteinC}
     */
    createInstance: function() {
      return new ProteinC( this.model );
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
      var currentHeight = currentWidth * 1.4;
      var path = new Shape();
      var topAndBottomCurveMultiplier = 0.55;
      var sideCurvesMultiplier = 0.40;
      // Start in the upper left and proceed clockwise in adding segments.
      path.moveTo( -currentWidth * 0.45, currentHeight * 0.45 );
      path.cubicCurveTo( -currentWidth * 0.33, currentHeight * topAndBottomCurveMultiplier, currentWidth * 0.3, currentHeight * topAndBottomCurveMultiplier, currentWidth * 0.45, currentHeight * 0.45 );
      path.cubicCurveTo( currentWidth * sideCurvesMultiplier, currentHeight * 0.33, currentWidth * sideCurvesMultiplier, -currentHeight * 0.33, currentWidth * 0.45, -currentHeight * 0.45 );
      path.cubicCurveTo( currentWidth * 0.33, -currentHeight * topAndBottomCurveMultiplier, -currentWidth * 0.3, -currentHeight * topAndBottomCurveMultiplier, -currentWidth * 0.45, -currentHeight * 0.45 );
      path.cubicCurveTo( -currentWidth * sideCurvesMultiplier, -currentHeight * 0.33, -currentWidth * sideCurvesMultiplier, currentHeight * 0.33, -currentWidth * 0.45, currentHeight * 0.45 );
      return path;
    }


  } );


} );


//// Copyright 2002-2011, University of Colorado
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
//import edu.colorado.phet.geneexpressionbasics.multiplecells.view.ColorChangingCellNode;
//
///**
// * @author John Blanco
// */
//public class ProteinC extends Protein {
//
//    // Make the color look like the fluorescent green used in "multiple cells" tab.
//    private static final Color BASE_COLOR = ColorChangingCellNode.FLORESCENT_FILL_COLOR;
//
//    private static final double FULL_GROWN_WIDTH = 320;
//
//    public ProteinC() {
//        this( new StubGeneExpressionModel() );
//    }
//
//    protected ProteinC( GeneExpressionModel model ) {
//        super( model, createInitialShape(), BASE_COLOR );
//    }
//
//    @Override protected Shape getUntranslatedShape( double growthFactor ) {
//        return createShape( growthFactor );
//    }
//
//    @Override public Protein createInstance() {
//        return new ProteinC( this.model );
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
//        double currentHeight = currentWidth * 1.4;
//        DoubleGeneralPath path = new DoubleGeneralPath();
//        double topAndBottomCurveMultiplier = 0.55;
//        double sideCurvesMultiplier = 0.40;
//        // Start in the upper left and proceed clockwise in adding segments.
//        path.moveTo( -currentWidth * 0.45, currentHeight * 0.45 );
//        path.curveTo( -currentWidth * 0.33, currentHeight * topAndBottomCurveMultiplier, currentWidth * 0.3, currentHeight * topAndBottomCurveMultiplier, currentWidth * 0.45, currentHeight * 0.45 );
//        path.curveTo( currentWidth * sideCurvesMultiplier, currentHeight * 0.33, currentWidth * sideCurvesMultiplier, -currentHeight * 0.33, currentWidth * 0.45, -currentHeight * 0.45 );
//        path.curveTo( currentWidth * 0.33, -currentHeight * topAndBottomCurveMultiplier, -currentWidth * 0.3, -currentHeight * topAndBottomCurveMultiplier, -currentWidth * 0.45, -currentHeight * 0.45 );
//        path.curveTo( -currentWidth * sideCurvesMultiplier, -currentHeight * 0.33, -currentWidth * sideCurvesMultiplier, currentHeight * 0.33, -currentWidth * 0.45, currentHeight * 0.45 );
//        return path.getGeneralPath();
//    }
//}
