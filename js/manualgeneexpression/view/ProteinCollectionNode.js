//  Copyright 2002-2014, University of Colorado Boulder

/**
 * A PNode that represents a labeled box where the user can collect protein molecules.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Color = require( 'SCENERY/util/Color' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var ProteinCollectionArea = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/view/ProteinCollectionArea' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Panel = require( 'SUN/Panel' );


  // constants
  // Upper limit on the width of the PNodes contained in this control panel.
  // This prevents translations from making this box too large.
  var MAX_CONTENT_WIDTH = 300;

  // Total number of protein types that can be collected.
  var NUM_PROTEIN_TYPES = 3;

  // Attributes of various aspects of the box.
  var TITLE_FONT = new PhetFont( 20, true );
  var READOUT_FONT = new PhetFont( 18 );
  var BACKGROUND_COLOR = new Color( 255, 250, 205 );
  var INTEGER_BOX_BACKGROUND_COLOR = new Color( 240, 240, 240 );

  // strings
  var YOUR_PROTEIN_COLLECTION = require( 'string!GENE_EXPRESSION_BASICS/yourProteinCollection' );
  var COLLECTION_COMPLETE = require( 'string!GENE_EXPRESSION_BASICS/collectionComplete' );
  var PROTEIN_COUNT_CAPTION_PART_1 = require( 'string!GENE_EXPRESSION_BASICS/proteinCountCaptionPart1' );
  var PROTEIN_COUNT_CAPTION_PART_2 = require( 'string!GENE_EXPRESSION_BASICS/proteinCountCaptionPart2' );

  /**
   * Center the full bounds of this node so that they are centered on the
   * given point specified on the local coordinates of this nodes parent.
   * @param parentX
   * @param parentY
   */
  function centerFullBoundsOnPoint( node, parentX, parentY ) {
    var dx = parentX - node.bounds.getCenterX();
    var dy = parentY - node.bounds.getCenterY();
    node.setTranslation( dx, dy );
  }

  /**
   * Convenience class for putting an integer in a box, kind of like a
   * grayed out edit box.
   *
   * @param {number} value
   * @constructor
   */
  function IntegerBox( value ) {
    var thisNode = this;
    Node.call( thisNode );

    var valueText = new Text( value, { font: READOUT_FONT } );
    var boxBounds = Shape.rectangle( 0, 0, valueText.bounds.width * 2, valueText.bounds.height );
    var box = new Path( boxBounds, {
      fill: INTEGER_BOX_BACKGROUND_COLOR,
      lineWidth: 1,
      stroke: Color.BLACK
    } );

    thisNode.addChild( box );
    centerFullBoundsOnPoint( valueText, box.bounds.getCenterX(), box.bounds.getCenterY() );
    thisNode.addChild( valueText );

  }

  inherit( Node, IntegerBox );

  /**
   * // private
   * Node that indicates the number of proteins that the user has collected
   * so far.  This monitors the model and updates automatically.
   * @param {ManualGeneExpressionModel}model
   * @constructor
   */
  function CollectionCountIndicator( model ) {
    var thisNode = this;
    Node.call( thisNode );

    thisNode.collectionCompleteNode = new Text( COLLECTION_COMPLETE, { font: new PhetFont( 20 ) } );
    if ( thisNode.collectionCompleteNode.bounds.width > MAX_CONTENT_WIDTH ) {
      // Scale to fit.
      thisNode.collectionCompleteNode.scale( MAX_CONTENT_WIDTH / thisNode.collectionCompleteNode.bounds.width );
    }

    function countChangeUpdater() {
      thisNode.updateCount( model );
    }

    model.proteinACollectedProperty.link( countChangeUpdater );
    model.proteinBCollectedProperty.link( countChangeUpdater );
    model.proteinCCollectedProperty.link( countChangeUpdater );

  }

  inherit( Node, CollectionCountIndicator, {
    /**
     *
     * @param {ManualGeneExpressionModel} model
     */
    updateCount: function( model ) {
      var thisNode = this;
      var numProteinTypesCollected = 0;
      if ( model.proteinACollected > 0 ) {
        numProteinTypesCollected++;
      }
      if ( model.proteinBCollected > 0 ) {
        numProteinTypesCollected++;
      }
      if ( model.proteinCCollected > 0 ) {
        numProteinTypesCollected++;
      }
      thisNode.removeAllChildren();

      var hBox = new HBox( {
        children: [ new Text( PROTEIN_COUNT_CAPTION_PART_1, { font: READOUT_FONT } ),
          new IntegerBox( numProteinTypesCollected ) ],
        spacing: 4
      } );

      var vBoxChildren = [ hBox, new Text( PROTEIN_COUNT_CAPTION_PART_2, { font: READOUT_FONT } ) ];
      var collectedQuantityIndicator = new VBox( {
        children: vBoxChildren, spacing: 5
      } );

      if ( collectedQuantityIndicator.bounds.width > MAX_CONTENT_WIDTH ) {
        // Scale to fit.
        collectedQuantityIndicator.scale( MAX_CONTENT_WIDTH / collectedQuantityIndicator.bounds.width );
      }

      // Offset the collection complete indicator so that it will be centered when it is shown.
      var dx = collectedQuantityIndicator.bounds.getCenterX() - thisNode.collectionCompleteNode.bounds.getCenterX();
      var dy = collectedQuantityIndicator.bounds.getCenterY() - thisNode.collectionCompleteNode.bounds.getCenterY();
      thisNode.collectionCompleteNode.setTranslation( dx, dy );

      // Add both nodes, so that the overall size of the node is consistent, but
      // only show one of them based upon whether the collection is complete.
      thisNode.addChild( collectedQuantityIndicator );
      thisNode.addChild( thisNode.collectionCompleteNode );

      // Set the visibility.
      collectedQuantityIndicator.setVisible( numProteinTypesCollected !== NUM_PROTEIN_TYPES );
      thisNode.collectionCompleteNode.setVisible( numProteinTypesCollected === NUM_PROTEIN_TYPES );
    }
  } );

  /**
   *
   * @param {ManualGeneExpressionModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ProteinCollectionNode( model, mvt ) {
    var thisNode = this;
    Node.call( thisNode );

    // Create the title and scale it if needed.
    var title = new MultiLineText( YOUR_PROTEIN_COLLECTION, {
        fill: Color.BLACK, font: TITLE_FONT
      }
    );
    if ( title.bounds.width > MAX_CONTENT_WIDTH ) {
      // Scale title to fit.
      title.scale( MAX_CONTENT_WIDTH / title.bounds.width );
    }

    // Create the collection area.
    var collectionArea = new ProteinCollectionArea( model, mvt );
    assert && assert( collectionArea.bounds.width <= MAX_CONTENT_WIDTH ); // Need to make some adjustments if this gets hit.

    var contents = new VBox( {
      children: [ title,
        collectionArea,
        new CollectionCountIndicator( model ) ], spacing: 5
    } );

    thisNode.addChild( new Panel( contents, { fill: BACKGROUND_COLOR } ) );
  }

  return inherit( Node, ProteinCollectionNode );

} );


//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.manualgeneexpression.view;
//
//import java.awt.BasicStroke;
//import java.awt.Color;
//import java.awt.Font;
//import java.awt.Paint;
//import java.awt.Shape;
//import java.awt.geom.AffineTransform;
//import java.awt.geom.Dimension2D;
//import java.awt.geom.Rectangle2D;
//import java.util.Arrays;
//
//import edu.colorado.phet.common.phetcommon.model.property.ChangeObserver;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.util.SimpleObserver;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.colorado.phet.common.phetcommon.view.util.PhetFont;
//import edu.colorado.phet.common.piccolophet.nodes.ControlPanelNode;
//import edu.colorado.phet.common.piccolophet.nodes.HTMLNode;
//import edu.colorado.phet.common.piccolophet.nodes.PhetPPath;
//import edu.colorado.phet.common.piccolophet.nodes.layout.HBox;
//import edu.colorado.phet.common.piccolophet.nodes.layout.VBox;
//import edu.colorado.phet.geneexpressionbasics.GeneExpressionBasicsResources;
//import edu.colorado.phet.geneexpressionbasics.common.model.MobileBiomolecule;
//import edu.colorado.phet.geneexpressionbasics.common.model.Protein;
//import edu.colorado.phet.geneexpressionbasics.common.view.MobileBiomoleculeNode;
//import edu.colorado.phet.geneexpressionbasics.manualgeneexpression.model.ManualGeneExpressionModel;
//import edu.colorado.phet.geneexpressionbasics.manualgeneexpression.model.ProteinA;
//import edu.colorado.phet.geneexpressionbasics.manualgeneexpression.model.ProteinB;
//import edu.colorado.phet.geneexpressionbasics.manualgeneexpression.model.ProteinC;
//import edu.umd.cs.piccolo.PNode;
//import edu.umd.cs.piccolo.nodes.PPath;
//import edu.umd.cs.piccolo.nodes.PText;
//import edu.umd.cs.piccolo.util.PDimension;
//
//import static edu.colorado.phet.geneexpressionbasics.GeneExpressionBasicsResources.Strings.PROTEIN_COUNT_CAPTION_PART_1;
//import static edu.colorado.phet.geneexpressionbasics.GeneExpressionBasicsResources.Strings.PROTEIN_COUNT_CAPTION_PART_2;
//
///**
// * A PNode that represents a labeled box where the user can collect protein
// * molecules.
// *
// * @author John Blanco
// */
//class ProteinCollectionNode extends PNode {
//

//

//

//
//    public ProteinCollectionNode( ManualGeneExpressionModel model, ModelViewTransform mvt ) {

//

//

//    private static class CollectionCountIndicator extends PNode {
//
//        final PNode collectionCompleteNode = new PText( GeneExpressionBasicsResources.Strings.COLLECTION_COMPLETE ) {{
//            setFont( new PhetFont( 20 ) );
//            if ( getFullBoundsReference().width > MAX_CONTENT_WIDTH ) {
//                // Scale to fit.
//                setScale( MAX_CONTENT_WIDTH / getFullBoundsReference().width );
//            }
//        }};
//
//        // Constructor.
//        public CollectionCountIndicator( final ManualGeneExpressionModel model ) {
//
//        }
//
//        private void updateCount( ManualGeneExpressionModel model ) {
//        }
//    }
//
//    /**
//     * Convenience class for putting an integer in a box, kind of like a
//     * grayed out edit box.
//     */
//    private static class IntegerBox extends PNode {
//        private static final Color BACKGROUND_COLOR = new Color( 240, 240, 240 );
//
//        private IntegerBox( int value ) {
//            PText valueText = new ReadoutPText( Integer.toString( value ) );
//            Rectangle2D boxBounds = new Rectangle2D.Double( 0, 0, valueText.getFullBoundsReference().width * 2, valueText.getFullBoundsReference().height );
//            PhetPPath box = new PhetPPath( boxBounds, BACKGROUND_COLOR, new BasicStroke( 1 ), Color.BLACK );
//            addChild( box );
//            valueText.centerFullBoundsOnPoint( box.getFullBoundsReference().getCenterX(), box.getFullBoundsReference().getCenterY() );
//            addChild( valueText );
//        }
//    }
//
//    /**
//     * Convenience class for the text used in the readout.
//     */
//    private static class ReadoutPText extends PText {
//        private ReadoutPText( String text ) {
//            super( text );
//            setFont( READOUT_FONT );
//        }
//    }
//
//    // Class that represents the collection area, where potentially several
//    // different types of protein can be collected.
//    private static class ProteinCollectionArea extends PNode {
//        private ProteinCollectionArea( ManualGeneExpressionModel model, ModelViewTransform mvt ) {
//
//            // Get a transform that performs only the scaling portion of the mvt.
//            double scale = mvt.getTransform().getScaleX();
//            assert scale == -mvt.getTransform().getScaleY(); // This only handles symmetric transform case.
//            AffineTransform transform = AffineTransform.getScaleInstance( scale, -scale );
//
//            // Figure out the max dimensions of the various protein types so
//            // that the capture nodes can be properly laid out.
//            Dimension2D captureNodeBackgroundSize = new PDimension( 0, 0 );
//            for ( Class<? extends Protein> proteinClass : Arrays.asList( ProteinA.class, ProteinB.class, ProteinC.class ) ) {
//                try {
//                    Protein protein = proteinClass.newInstance();
//                    Rectangle2D proteinShapeBounds = transform.createTransformedShape( protein.getFullyGrownShape() ).getBounds2D();
//                    captureNodeBackgroundSize.setSize( Math.max( proteinShapeBounds.getWidth() * ProteinCaptureNode.SCALE_FOR_FLASH_NODE, captureNodeBackgroundSize.getWidth() ),
//                                                       Math.max( proteinShapeBounds.getHeight() * ProteinCaptureNode.SCALE_FOR_FLASH_NODE, captureNodeBackgroundSize.getHeight() ) );
//                }
//                catch ( Exception e ) {
//                    // Not much that can be done here except to essentially
//                    // re-throw the exception.
//                    throw new RuntimeException( "Exception thrown when instantiating protein, e = " + e );
//                }
//            }
//
//            // Add the collection area, which is a set of collection nodes.
//            addChild( new HBox(
//                    0,
//                    new ProteinCaptureNode( model, ProteinA.class, transform, captureNodeBackgroundSize ),
//                    new ProteinCaptureNode( model, ProteinB.class, transform, captureNodeBackgroundSize ),
//                    new ProteinCaptureNode( model, ProteinC.class, transform, captureNodeBackgroundSize )
//            ) );
//        }
//    }
//
//    // Class that represents a node for collecting a single protein and a
//    // counter of the number of the protein type collected.
//    private static class ProteinCaptureNode extends PNode {
//
//        private static final Color FLASH_COLOR = new Color( 173, 255, 47 );
//        static final double SCALE_FOR_FLASH_NODE = 1.5;
//
//        // Tweak warning: This is used to make sure that the counters on
//        // the various protein nodes end up horizontally aligned.  This will
//        // need to be adjust if the protein shapes change a lot.
//        private static final double VERTICAL_DISTANCE_TO_COUNT_NODE = 35;
//
//        // Constructor.
//        private ProteinCaptureNode( final ManualGeneExpressionModel model, final Class<? extends Protein> proteinClass, AffineTransform transform, Dimension2D size ) {
//
//            Shape proteinShape = new Rectangle2D.Double( -10, -10, 20, 20 ); // Arbitrary initial shape.
//            Color fullBaseColor = Color.PINK; // Arbitrary initial color.
//
//            // Get the shape of the protein.
//            try {
//                Protein protein = proteinClass.newInstance();
//                proteinShape = transform.createTransformedShape( protein.getFullyGrownShape() );
//                fullBaseColor = protein.colorProperty.get();
//            }
//            catch ( InstantiationException e ) {
//                e.printStackTrace();
//            }
//            catch ( IllegalAccessException e ) {
//                e.printStackTrace();
//            }
//
//            // Add the background node.  This is invisible, and exists only to
//            // made the node a specific size.
//            addChild( new PhetPPath( new Rectangle2D.Double( -size.getWidth() / 2, -size.getHeight() / 2, size.getWidth(), size.getHeight() ),
//                                     new Color( 0, 0, 0, 0 ) ) );
//
//            // Add the node that will flash when a protein is created, stay lit
//            // until the protein is captured, and turn off once it is captured.
//            Shape flashingCaptureNodeShape = AffineTransform.getScaleInstance( SCALE_FOR_FLASH_NODE, SCALE_FOR_FLASH_NODE ).createTransformedShape( proteinShape );
//            final FlashingShapeNode flashingCaptureNode = new FlashingShapeNode( flashingCaptureNodeShape, FLASH_COLOR, 350, 350, 4, false, true );
//            addChild( flashingCaptureNode );
//
//            // Add the node that will represent the spot where the protein can
//            // be captured, which is a black shape (signifying emptiness)
//            // until a protein is captured, then it changes to look filled in.
//            final PPath captureAreaNode = new PPath( proteinShape );
//            addChild( captureAreaNode );
//            final Paint gradientPaint = MobileBiomoleculeNode.createGradientPaint( proteinShape, fullBaseColor );
//
//            // Add the node that represents a count of the collected type.
//            final PText countNode = new PText() {{
//                setFont( new PhetFont( 18 ) );
//            }};
//            addChild( countNode );
//            model.getCollectedCounterForProteinType( proteinClass ).addObserver( new VoidFunction1<Integer>() {
//                public void apply( Integer proteinCaptureCount ) {
//                    countNode.setText( Integer.toString( proteinCaptureCount ) );
//                    countNode.setOffset( captureAreaNode.getFullBoundsReference().getCenterX() - countNode.getFullBoundsReference().width / 2,
//                                         captureAreaNode.getFullBoundsReference().getCenterY() + VERTICAL_DISTANCE_TO_COUNT_NODE );
//                }
//            } );
//
//            // Watch for a protein node of the appropriate type to become
//            // fully grown and, when it does, flash a node in order to signal
//            // the user that the protein should be placed here.
//            model.mobileBiomoleculeList.addElementAddedObserver( new VoidFunction1<MobileBiomolecule>() {
//                public void apply( MobileBiomolecule biomolecule ) {
//                    if ( biomolecule.getClass() == proteinClass ) {
//                        Protein protein = (Protein) biomolecule;
//                        protein.fullGrown.addObserver( new ChangeObserver<Boolean>() {
//                            public void update( Boolean isFullyFormed, Boolean wasFullyFormed ) {
//                                if ( isFullyFormed && !wasFullyFormed ) {
//                                    flashingCaptureNode.startFlashing();
//                                }
//                            }
//                        } );
//                    }
//                }
//            } );
//
//            // Get the capture count property for this protein.
//            Property<Integer> captureCount = model.getCollectedCounterForProteinType( proteinClass );
//
//            // Observe the capture indicator and set the state of the nodes
//            // appropriately.
//            captureCount.addObserver( new VoidFunction1<Integer>() {
//                public void apply( Integer captureCount ) {
//                    if ( captureCount > 0 ) {
//                        captureAreaNode.setPaint( gradientPaint );
//                    }
//                    else {
//                        // No proteins capture, so set to black to appear empty.
//                        captureAreaNode.setPaint( Color.BLACK );
//                    }
//                }
//            } );
//
//            // Observe the biomolecules and make sure that if none of the
//            // protein that this collects is in the model, the highlight is off.
//            model.mobileBiomoleculeList.addElementRemovedObserver( new VoidFunction1<MobileBiomolecule>() {
//                public void apply( MobileBiomolecule biomolecule ) {
//                    if ( biomolecule.getClass() == proteinClass && model.getProteinCount( proteinClass ) == 0 ) {
//                        // Make sure highlight is off.
//                        flashingCaptureNode.forceFlashOff();
//                    }
//                }
//            } );
//        }
//    }
//}
