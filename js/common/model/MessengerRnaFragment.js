// Copyright 2002-2015, University of Colorado Boulder
/**
 * Class that represents a fragment of messenger ribonucleic acid, or mRNA, in
 * the model.  The fragments exist for a short time as mRNA is being destroyed,
 * but can't be translated.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MessengerRnaFragmentAttachmentStateMachine = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/MessengerRnaFragmentAttachmentStateMachine' );
  var SquareSegment = require( 'GENE_EXPRESSION_BASICS/common/model/SquareSegment' );
  var Shape = require( 'KITE/Shape' );
  var WindingBiomolecule = require( 'GENE_EXPRESSION_BASICS/common/model/WindingBiomolecule' );


  /**
   *  Constructor.  This creates the mRNA fragment as a single point, with the
   * intention of growing it.
   *
   * @param {GeneExpressionModel} model
   * @param {Vector2} position
   * @constructor
   */
  function MessengerRnaFragment( model, position ) {
    WindingBiomolecule.call( this, model, new Shape().moveToPoint( position ), position );

    // Add the first, and in this case only, segment to the shape segment
    // list.
    this.shapeSegments.add( new SquareSegment( position ) ); //TODO


  }

  return inherit( WindingBiomolecule, MessengerRnaFragment, {

    /**
     * Release this mRNA fragment from the destroyer molecule.
     */
    releaseFromDestroyer: function() {
      this.attachmentStateMachine.detach();
    },

    /**
     *
     * @returns {MessengerRnaFragmentAttachmentStateMachine}
     */
    createAttachmentStateMachine: function() {
      return new MessengerRnaFragmentAttachmentStateMachine( this );
    }

  } );


} );
// Copyright 2002-2014, University of Colorado Boulder
//package edu.colorado.phet.geneexpressionbasics.common.model;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.view.util.DoubleGeneralPath;
//import edu.colorado.phet.geneexpressionbasics.common.model.attachmentstatemachines.AttachmentStateMachine;
//import edu.colorado.phet.geneexpressionbasics.common.model.attachmentstatemachines.MessengerRnaFragmentAttachmentStateMachine;
//
///**
// * Class that represents a fragment of messenger ribonucleic acid, or mRNA, in
// * the model.  The fragments exist for a short time as mRNA is being destroyed,
// * but can't be translated.
// *
// * @author John Blanco
// */
//public class MessengerRnaFragment extends WindingBiomolecule {
//
//    /**
//     * Constructor.  This creates the mRNA fragment as a single point, with the
//     * intention of growing it.
//     *
//     * @param position
//     */
//    public MessengerRnaFragment( final GeneExpressionModel model, Vector2D position ) {
//        super( model, new DoubleGeneralPath( position ).getGeneralPath(), position );
//
//        // Add the first, and in this case only, segment to the shape segment
//        // list.
//        shapeSegments.add( new ShapeSegment.SquareSegment( position ) );
//    }
//
//    //-------------------------------------------------------------------------
//    // Methods
//    //-------------------------------------------------------------------------
//
//    /**
//     * Release this mRNA fragment from the destroyer molecule.
//     */
//    public void releaseFromDestroyer() {
//        attachmentStateMachine.detach();
//    }
//
//    @Override protected AttachmentStateMachine createAttachmentStateMachine() {
//        return new MessengerRnaFragmentAttachmentStateMachine( this );
//    }
//}
