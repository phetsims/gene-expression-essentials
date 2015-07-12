//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   *
   * @param {MobileBiomolecule} biomolecule
   * @param {Node} node
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BiomoleculeDragHandler( biomolecule, node, mvt ) {
    var thisHandler = this;
    SimpleDragHandler.call( thisHandler, {
      allowTouchSnag: true,

      start: function( event, trail ) {
        // The user is moving this, so they have control.
        biomolecule.userControlled = true;
      },

      translate: function( translationParams ) {
        var modelDelta = mvt.viewToModelDelta( translationParams.delta );
        biomolecule.translate( modelDelta );
      },

      end: function( event ) {
        // The user is no longer moving this, so they have relinquished control.
        biomolecule.userControlled = false;
      }
    } );

  }

  return inherit( SimpleDragHandler, BiomoleculeDragHandler );


} );

//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.common.view;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.colorado.phet.geneexpressionbasics.common.model.MobileBiomolecule;
//import edu.umd.cs.piccolo.PNode;
//import edu.umd.cs.piccolo.event.PDragEventHandler;
//import edu.umd.cs.piccolo.event.PInputEvent;
//import edu.umd.cs.piccolo.util.PDimension;
//
///**
// * @author John Blanco
// */
//class BiomoleculeDragHandler extends PDragEventHandler {
//    private final MobileBiomolecule biomolecule;
//    private final PNode pNode;
//    private final ModelViewTransform mvt;
//
//    public BiomoleculeDragHandler( MobileBiomolecule biomolecule, PNode node, ModelViewTransform mvt ) {
//        this.biomolecule = biomolecule;
//        pNode = node;
//        this.mvt = mvt;
//    }
//
//    @Override protected void startDrag( PInputEvent event ) {
//        super.startDrag( event );
//        // The user is moving this, so they have control.
//        biomolecule.userControlled.set( true );
//    }
//
//    @Override
//    public void mouseDragged( PInputEvent event ) {
//        PDimension viewDelta = event.getDeltaRelativeTo( pNode.getParent() );
//        Vector2D modelDelta = mvt.viewToModelDelta( new Vector2D( viewDelta ) );
//        biomolecule.translate( modelDelta );
//    }
//
//    @Override protected void endDrag( PInputEvent event ) {
//        super.endDrag( event );
//        // The user is no longer moving this, so they have relinquished control.
//        biomolecule.userControlled.set( false );
//    }
//}
