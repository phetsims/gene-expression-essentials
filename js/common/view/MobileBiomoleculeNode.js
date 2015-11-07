// Copyright 2015, University of Colorado Boulder

/**
 * Base class for displaying and interacting with mobile biomolecules.  In
 * essence, this observes the shape of the biomolecule, which changes as it
 * moves.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Color = require( 'SCENERY/util/Color' );
  var GradientUtil = require( 'GENE_EXPRESSION_BASICS/common/util/GradientUtil' );
  var RnaPolymerase = require( 'GENE_EXPRESSION_BASICS/common/model/RnaPolymerase' );
  var RibosomeNode = require( 'GENE_EXPRESSION_BASICS/common/view/RibosomeNode' );
  var BiomoleculeDragHandler = require( 'GENE_EXPRESSION_BASICS/common/view/BiomoleculeDragHandler' );
  var Ribosome = require( 'GENE_EXPRESSION_BASICS/common/model/Ribosome' );
  var MessengerRna = require( 'GENE_EXPRESSION_BASICS/common/model/MessengerRna' );


  /**
   *
   * @param {ModelViewTransform2} mvt
   * @param {MobileBioMolecule} mobileBiomolecule
   * @param {number} outlineStroke
   * @constructor
   */
  function MobileBiomoleculeNode( mvt, mobileBiomolecule, outlineStroke ) {
    var thisNode = this;
    Node.call( thisNode );
    outlineStroke = outlineStroke || 1;

    var path = this.getPathByMobileBioMoleculeType( mobileBiomolecule, {
      stroke: Color.BLACK,
      lineWidth: outlineStroke
    } );

    thisNode.addChild( path );

    // Update the shape whenever it changes.
    mobileBiomolecule.addShapeChangeObserver( function( shape ) {
      // Create a shape that excludes any offset.
      var centeredShape = mobileBiomolecule.centeredShape( shape, mvt );
      path.setShape( centeredShape );
      // Account for the offset.
      var offset = mvt.modelToViewPosition( mobileBiomolecule.getPosition() );

      path.x = offset.x;
      path.y = offset.y;

      // For shapes with just one point, the Java Version of GeneralPath's "Bounds" returns a width of
      // zero and height of 1 but kite's shape bounds returns infinity in such cases. Since the MessengerRna starts with
      // a single point, the Gradient fill code fails as the bounds of the shape at that point is infinity.
      // So the following check is added before calling createGradientPaint - Ashraf

      // Set the gradient paint.
      if ( _.isFinite( centeredShape.bounds.centerX ) ) {
        path.fill = GradientUtil.createGradientPaint( centeredShape, mobileBiomolecule.color );
      }

    } );

    //Update the color whenever it changes.
    mobileBiomolecule.colorProperty.link( function( color ) {
      var moleculeShape = mobileBiomolecule.centeredShape( mobileBiomolecule.getShape(), mvt );

      //see the comment above on gradientPaint
      if ( _.isFinite( moleculeShape.bounds.centerX ) ) {
        path.fill = GradientUtil.createGradientPaint( moleculeShape, color );
      }

    } );

    // Update its existence strength (i.e. fade level) whenever it changes.
    mobileBiomolecule.existenceStrengthProperty.link( function( existenceStrength ) {
      assert && assert( existenceStrength >= 0 && existenceStrength <= 1 ); // Bounds checking.
      path.opacity = Math.min( Number( existenceStrength ), 1 + mobileBiomolecule.zPosition );

    } );

    // Update the "closeness" whenever it changes.
    mobileBiomolecule.zPositionProperty.link( function( zPosition ) {
      assert && assert( zPosition >= -1 && zPosition <= 0 ); // Parameter checking.

      // The further back the biomolecule is, the more
      // transparent it is in order to make it look more distant.
      path.opacity = Math.min( 1 + zPosition, mobileBiomolecule.existenceStrength );

      // Also, as it goes further back, this node is scaled down
      // a bit, also to make it look further away.
      path.scale( 1 );
      path.scale( 1 + 0.15 * zPosition );
    } );

    // If a polymerase molecule attaches to the DNA strand, move it to
    // the back of its current layer so that nothing can go between it
    // and the DNA molecule.  Otherwise odd-looking things can happen.
    mobileBiomolecule.attachedToDnaProperty.link( function( attachedToDna ) {
      if ( mobileBiomolecule instanceof RnaPolymerase && attachedToDna ) {
        path.moveToBack();
      }


    } );

    // Drag handling.
    thisNode.addInputListener( new BiomoleculeDragHandler( mobileBiomolecule, thisNode, mvt ) );


    // Interactivity control.
    mobileBiomolecule.movableByUserProperty.link( function( movableByUser ) {
      path.setPickable( movableByUser );
    } );

    // Move this biomolecule to the top of its layer when grabbed.
    mobileBiomolecule.userControlledProperty.link( function( userControlled ) {
      path.moveToFront();
    } );


  }


  return inherit( Node, MobileBiomoleculeNode, {

    /**
     *
     * @param {MobileBioMolecule} mobileBiomolecule
     * @param {Object} options
     */
    getPathByMobileBioMoleculeType: function( mobileBiomolecule, options ) {

      if ( mobileBiomolecule instanceof  Ribosome ) {
        //kiet shapes dont support CAG operations, so for Ribosome a specialized Node is created which
        // internally maintains two shapes and uses transformations to get the desired ribosome shape
        return new RibosomeNode( mobileBiomolecule, options );
      }

      // override the computeShapeBounds based on Molecule  to optimize performance - Ashraf TODO verify
      var path = new Path( new Shape(), options );
      if ( mobileBiomolecule instanceof  MessengerRna ) {
        var emptyBounds = new Bounds2( 0, 0, 0, 0 );
        var emptyComputeShapeBounds = function() { return emptyBounds; };
        path.computeShapeBounds = emptyComputeShapeBounds;
      }
      else {
        path.boundsMethod = 'unstroked';
      }

      return path;
    },

    /**
     * Get a shape that is positioned such that its center is at point (0, 0).
     *
     * @param {Shape} shape
     * @return {Shape}
     */
    getCenteredShape: function( shape ) {
      var shapeBounds = shape.bounds;
      var xOffset = shapeBounds.getCenterX();
      var yOffset = shapeBounds.getCenterY();
      var transform = Matrix3.translation( -xOffset, -yOffset );
      return shape.transformed( transform );
    }


  } );
} );


// Copyright 2002-2014, University of Colorado Boulder
//package edu.colorado.phet.geneexpressionbasics.common.view;
//
//import java.awt.BasicStroke;
//import java.awt.Color;
//import java.awt.GradientPaint;
//import java.awt.Paint;
//import java.awt.Shape;
//import java.awt.Stroke;
//import java.awt.geom.AffineTransform;
//
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.colorado.phet.common.phetcommon.view.util.ColorUtils;
//import edu.colorado.phet.common.piccolophet.event.CursorHandler;
//import edu.colorado.phet.common.piccolophet.nodes.PhetPPath;
//import edu.colorado.phet.geneexpressionbasics.common.model.MobileBiomolecule;
//import edu.colorado.phet.geneexpressionbasics.common.model.RnaPolymerase;
//import edu.colorado.phet.geneexpressionbasics.multiplecells.view.ColorChangingCellNode;
//import edu.umd.cs.piccolo.nodes.PPath;
//
///**

// */
//public class MobileBiomoleculeNode extends PPath {
//
//    public MobileBiomoleculeNode( final ModelViewTransform mvt, final MobileBiomolecule mobileBiomolecule ) {
//        this( mvt, mobileBiomolecule, new BasicStroke( 1 ) );
//    }
//
//    public MobileBiomoleculeNode( final ModelViewTransform mvt, final MobileBiomolecule mobileBiomolecule, Stroke outlineStroke ) {
//
//        addChild( new PhetPPath( outlineStroke, Color.BLACK ) {{
//
//            // Update the shape whenever it changes.
//            mobileBiomolecule.addShapeChangeObserver( new VoidFunction1<Shape>() {
//                public void apply( Shape shape ) {
//                    // Create a shape that excludes any offset.
//                    Shape centeredShape = getCenteredShape( mvt.modelToView( shape ) );
//                    setPathTo( centeredShape );
//                    // Account for the offset.
//                    setOffset( mvt.modelToView( mobileBiomolecule.getPosition() ).toPoint2D() );
//                    // Set the gradient paint.
//                    setPaint( createGradientPaint( centeredShape, mobileBiomolecule.colorProperty.get() ) );
//                }
//            } );
//
//            // Update the color whenever it changes.
//            mobileBiomolecule.colorProperty.addObserver( new VoidFunction1<Color>() {
//                public void apply( Color color ) {
//                    setPaint( createGradientPaint( getCenteredShape( mvt.modelToView( mobileBiomolecule.getShape() ) ), mobileBiomolecule.colorProperty.get() ) );
//                }
//            } );
//
//            // Update its existence strength (i.e. fade level) whenever it changes.
//            mobileBiomolecule.existenceStrength.addObserver( new VoidFunction1<Double>() {
//                public void apply( Double existenceStrength ) {
//                    assert existenceStrength >= 0 && existenceStrength <= 1; // Bounds checking.
//                    setTransparency( (float) Math.min( existenceStrength.floatValue(), 1 + mobileBiomolecule.zPosition.get() ) );
//                }
//            } );
//
//            // Update the "closeness" whenever it changes.
//            mobileBiomolecule.zPosition.addObserver( new VoidFunction1<Double>() {
//                public void apply( Double zPosition ) {
//                    assert zPosition >= -1 && zPosition <= 0; // Parameter checking.
//                    // The further back the biomolecule is, the more
//                    // transparent it is in order to make it look more distant.
//                    setTransparency( (float) Math.min( 1 + zPosition, mobileBiomolecule.existenceStrength.get() ) );
//                    // Also, as it goes further back, this node is scaled down
//                    // a bit, also to make it look further away.
//                    setScale( 1 );
//                    setScale( 1 + 0.15 * zPosition );
//                }
//            } );
//
//            // If a polymerase molecule attaches to the DNA strand, move it to
//            // the back of its current layer so that nothing can go between it
//            // and the DNA molecule.  Otherwise odd-looking things can happen.
//            mobileBiomolecule.attachedToDna.addObserver( new VoidFunction1<Boolean>() {
//                public void apply( Boolean attachedToDna ) {
//                    if ( mobileBiomolecule instanceof RnaPolymerase && attachedToDna ) {
//                        moveToBack();
//                    }
//                }
//            } );
//
//            // Cursor handling.
//            addInputEventListener( new CursorHandler() );
//
//            // Drag handling.
//            addInputEventListener( new BiomoleculeDragHandler( mobileBiomolecule, this, mvt ) );
//
//            // Interactivity control.
//            mobileBiomolecule.movableByUser.addObserver( new VoidFunction1<Boolean>() {
//                public void apply( Boolean movableByUser ) {
//                    setPickable( movableByUser );
//                    setChildrenPickable( movableByUser );
//                }
//            } );
//        }} );
//
//        // Move this biomolecule to the top of its layer when grabbed.
//        mobileBiomolecule.userControlled.addObserver( new VoidFunction1<Boolean>() {
//            public void apply( Boolean userControlled ) {
//                moveToFront();
//            }
//        } );
//    }
//
//    /**
//     * Get a shape that is positioned such that its center is at point (0, 0).
//     *
//     * @param shape
//     * @return
//     */
//    private static Shape getCenteredShape( Shape shape ) {
//        double xOffset = shape.getBounds2D().getCenterX();
//        double yOffset = shape.getBounds2D().getCenterY();
//        AffineTransform transform = AffineTransform.getTranslateInstance( -xOffset, -yOffset );
//        return transform.createTransformedShape( shape );
//    }
//
//    /**
//     * Create a gradient paint in order to give a molecule a little depth.
//     * This is public so that it can be used by other nodes that need to
//     * depict biomolecules.
//     */
//    public static Paint createGradientPaint( Shape shape, Color baseColor ) {
//        Paint paint;
//        if ( baseColor != ColorChangingCellNode.FLORESCENT_FILL_COLOR ) {
//            paint = new GradientPaint( (float) shape.getBounds2D().getMinX(),
//                                       (float) shape.getBounds2D().getCenterY(),
//                                       ColorUtils.brighterColor( baseColor, 0.8 ),
//                                       (float) shape.getBounds2D().getMaxX(),
//                                       (float) shape.getBounds2D().getCenterY(),
//                                       ColorUtils.darkerColor( baseColor, 0.3 ) );
//
//        }
//        else {
//            // Special case: If using the "fluorescent" color, i.e. the one
//            // used to depict green fluorescent protein in the sim, don't
//            // create a gradient, because it looks brighter and more distinct.
//            paint = baseColor;
//        }
//
//        return paint;
//    }
//}
