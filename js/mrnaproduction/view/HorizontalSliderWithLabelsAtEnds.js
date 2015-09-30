//  Copyright 2002-2015, University of Colorado Boulder
/**
 * Convenience class for a horizontal slider that has labels at each end
 * rather than having tick marks with labels below them.
 *
 * @author Mohamed Safi
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var HSlider = require( 'SUN/HSlider' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  //constants
  //var OVERALL_WIDTH = 150;
  var LABEL_FONT = new PhetFont( { size: 12, weight: 'bold' } );
  var INTER_ELEMENT_SPACING = new PhetFont( { size: 5, weight: 'bold' } );

  /**
   *
   * @param {Property} doubleProperty
   * @param {Number} min
   * @param {Number} max
   * @param {String} leftLabel
   * @param {String} rightLabel
   *
   * @constructor
   */
  function HorizontalSliderWithLabelsAtEnds( doubleProperty, min, max, leftLabel, rightLabel ) {
    var thisNode = this;
    Node.call( thisNode );

    var leftLabelNode = new Text( leftLabel, LABEL_FONT );
    var rightLabelNode = new Text( rightLabel, LABEL_FONT );
    //var sliderWidth = OVERALL_WIDTH - leftLabelNode.bounds.width -
    //                  rightLabelNode.bounds.width - ( 2 * INTER_ELEMENT_SPACING ); TODO
    var sliderOptions = {
      thumbSize: new Dimension2( 18, 22 ),
      trackSize: new Dimension2( 100, 1 )
    };

    //var sliderOptions = { TODO
    //        thumbSize: new Dimension2( 18, 22 ),
    //        trackSize: new Dimension2( sliderWidth, 1 )
    //    };

    var sliderNode = new HSlider( doubleProperty, { min: min, max: max }, sliderOptions );
    thisNode.addChild( new HBox( {
      children: [ leftLabelNode, sliderNode, rightLabelNode ],
      spacing: INTER_ELEMENT_SPACING
    } ) );

  }


  return inherit( Node, HorizontalSliderWithLabelsAtEnds, {} );
} );


//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.mrnaproduction.view;
//
//import java.awt.Font;
//
//import edu.colorado.phet.common.phetcommon.model.property.BooleanProperty;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.simsharing.messages.UserComponent;
//import edu.colorado.phet.common.phetcommon.view.util.PhetFont;
//import edu.colorado.phet.common.piccolophet.nodes.PhetPText;
//import edu.colorado.phet.common.piccolophet.nodes.layout.HBox;
//import edu.colorado.phet.common.piccolophet.nodes.slider.HSliderNode;
//import edu.umd.cs.piccolo.PNode;
//import edu.umd.cs.piccolo.nodes.PText;
//
///**
// * Convenience class for a horizontal slider that has labels at each end
// * rather than having tick marks with labels below them.
// *
// * @author John Blanco
// */
//class HorizontalSliderWithLabelsAtEnds extends PNode {
//    private static final double OVERALL_WIDTH = 150;
//    private static final Font LABEL_FONT = new PhetFont( 12 );
//    private static final double INTER_ELEMENT_SPACING = 5;
//
//    public HorizontalSliderWithLabelsAtEnds( UserComponent userComponent, Property<Double> doubleProperty, double min, double max, String leftLabel, String rightLabel ) {
//        PText leftLabelNode = new PhetPText( leftLabel, LABEL_FONT );
//        PText rightLabelNode = new PhetPText( rightLabel, LABEL_FONT );
//        double sliderWidth = OVERALL_WIDTH - leftLabelNode.getFullBoundsReference().width -
//                             rightLabelNode.getFullBoundsReference().width - ( 2 * INTER_ELEMENT_SPACING );
//        PNode sliderNode = new HSliderNode( userComponent,
//                                            min,
//                                            max,
//                                            5,
//                                            sliderWidth,
//                                            doubleProperty,
//                                            new BooleanProperty( true ) );
//        addChild( new HBox( INTER_ELEMENT_SPACING, leftLabelNode, sliderNode, rightLabelNode ) );
//    }
//}
