// Copyright 2015, University of Colorado Boulder

/**
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlacementHintNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/PlacementHintNode' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  var ProteinCollectionNode = require( 'GENE_EXPRESSION_ESSENTIALS/manualgeneexpression/view/ProteinCollectionNode' );
  var BiomoleculeToolBoxNode = require( 'GENE_EXPRESSION_ESSENTIALS/manualgeneexpression/view/BiomoleculeToolBoxNode' );
  var HSlider = require( 'SUN/HSlider' );
  var Property = require( 'AXON/Property' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var DnaMoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/DnaMoleculeNode' );
  var MessengerRnaNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MessengerRnaNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );

  // constants
  // Inset for several of the controls.
  var INSET = 15;

  // images
  var mockupImage = require( 'image!GENE_EXPRESSION_ESSENTIALS/GEB-01.png' );

  /**
   * @param {ManualGeneExpressionModel} model
   * @constructor
   */
  function ManualGeneExpressionScreenView( model ) {

    ScreenView.call( this );
    var thisView = this;

    var viewPortPosition = new Vector2( thisView.layoutBounds.width * 0.48, thisView.layoutBounds.height * 0.64 );
    var biomoleculeToolBoxNodeList = []; // Array of BiomoleculeToolBoxNode
    // Set up the model-canvas transform.
    // IMPORTANT NOTES: The multiplier factors for the 2nd point can be
    // adjusted to shift the center right or left, and the scale factor
    // can be adjusted to zoom in or out (smaller numbers zoom out, larger
    // ones zoom in).
    this.mvt = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO, viewPortPosition, 0.1 ); // "Zoom factor" - smaller zooms out, larger zooms in.

    // Add a background layer where the cell(s) that make up the background
    // will reside.
    this.backgroundCellLayer = new Node();
    thisView.addChild( this.backgroundCellLayer );

    // Set up the node where all controls that need to be below the
    // biomolecules should be placed.  This node and its children will
    // stay in one place and not scroll.
    var backControlsLayer = new Node();
    thisView.addChild( backControlsLayer );

    // Set up the root node for all model objects.  Nodes placed under
    // this one will scroll when the user moves along the DNA strand.
    this.modelRootNode = new Node();
    thisView.addChild( this.modelRootNode );


    // Add some layers for enforcing some z-order relationships needed in
    // order to keep things looking good.
    var dnaLayer = new Node();
    this.modelRootNode.addChild( dnaLayer );
    var biomoleculeToolBoxLayer = new Node();
    this.modelRootNode.addChild( biomoleculeToolBoxLayer );
    var messengerRnaLayer = new Node();
    this.modelRootNode.addChild( messengerRnaLayer );
    var topBiomoleculeLayer = new Node();
    this.modelRootNode.addChild( topBiomoleculeLayer );
    var placementHintLayer = new Node();
    this.modelRootNode.addChild( placementHintLayer );

    // Set up the node where all controls that need to be above the
    // biomolecules should be placed.  This node and its children will
    // stay in one place and not scroll.
    var frontControlsLayer = new Node();
    thisView.addChild( frontControlsLayer );

    // BackGround Cell related Code -- TODO


    // Add the representation of the DNA strand.
    var dnaMoleculeNode = new DnaMoleculeNode( model.getDnaMolecule(), thisView.mvt, 3, true );
    dnaLayer.addChild( dnaMoleculeNode );

    // Add the placement hints that go on the DNA molecule.  These exist on
    // their own layer so that they can be seen above any molecules that
    // are attached to the DNA strand.
    _.each( model.getDnaMolecule().getGenes(), function( gene ) {
      _.each( gene.getPlacementHints(), function( placementHint ) {
        placementHintLayer.addChild( new PlacementHintNode( thisView.mvt, placementHint ) );
      } );
    } );

    // this.debugPoint( thisView, new Vector2( 0, 0 ) );

    // Add the protein collection box.
    var proteinCollectionNode = new ProteinCollectionNode( model, this.mvt );
    proteinCollectionNode.x = thisView.layoutBounds.width - proteinCollectionNode.bounds.width - INSET;
    proteinCollectionNode.y = INSET;
    backControlsLayer.addChild( proteinCollectionNode );

    // Add any initial molecules.
    _.each( model.mobileBiomoleculeList, function( biomolecule ) {
      topBiomoleculeLayer.addChild( new MobileBiomoleculeNode( thisView.mvt, biomolecule ) );
    } );

    // Watch for and handle comings and goings of biomolecules in the model. Most, but not all, of the biomolecules
    // are handled by this.  Some  others are handled as special cases.
    model.mobileBiomoleculeList.addItemAddedListener( function( addedBiomolecule ) {
      var biomoleculeNode = new MobileBiomoleculeNode( thisView.mvt, addedBiomolecule );
      topBiomoleculeLayer.addChild( biomoleculeNode );

      function removeItemListener( removedBiomolecule ) {
        if ( removedBiomolecule === addedBiomolecule ) {
          topBiomoleculeLayer.removeChild( biomoleculeNode );
          model.mobileBiomoleculeList.removeItemRemovedListener( removeItemListener );// Clean up memory leak
        }
      }

      model.mobileBiomoleculeList.addItemRemovedListener( removeItemListener );

    } );

    // Watch for and handle comings and goings of messenger RNA.
    model.messengerRnaList.addItemAddedListener( function( addedMessengerRna ) {

      var messengerRnaNode = new MessengerRnaNode( thisView.mvt, addedMessengerRna );
      messengerRnaLayer.addChild( messengerRnaNode );

      function removeItemListener( removedMessengerRna ) {
        if ( removedMessengerRna === addedMessengerRna ) {
          messengerRnaLayer.removeChild( messengerRnaNode );
          model.messengerRnaList.removeItemRemovedListener( removeItemListener );// Clean up memory leak
        }
      }

      model.messengerRnaList.addItemRemovedListener( removeItemListener );

    } );


    // Add the tool boxes from which the various biomolecules can be moved  into the active area of the sim.
    _.each( model.getDnaMolecule().getGenes(), function( gene ) {
      var biomoleculeToolBoxNode = new BiomoleculeToolBoxNode( model, thisView, thisView.mvt, gene );
      biomoleculeToolBoxNode.x = thisView.mvt.modelToViewX( gene.getCenterX() ) - thisView.layoutBounds.getWidth() / 2 + INSET;
      biomoleculeToolBoxNode.y = INSET;
      biomoleculeToolBoxNodeList.push( biomoleculeToolBoxNode );
      biomoleculeToolBoxLayer.addChild( biomoleculeToolBoxNode );
      model.addOffLimitsMotionSpace( thisView.mvt.viewToModelBounds( biomoleculeToolBoxNode.bounds ) );
    } );


    //Show the mock-up and a slider to change its transparency
    var mockupOpacityProperty = new Property( 0.4 );
    var image = new Image( mockupImage, { pickable: false } );
    mockupOpacityProperty.linkAttribute( image, 'opacity' );
    this.addChild( image );
    this.addChild( new HSlider( mockupOpacityProperty, { min: 0, max: 1 }, { top: 10, left: 500 } ) );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
  }

  return inherit( ScreenView, ManualGeneExpressionScreenView, {
    debugPoint: function( canvas, pt ) {
      var cirlceNode = new Circle( 15, {
        fill: 'red'
      } );

      canvas.addChild( cirlceNode );

      cirlceNode.x = pt.x;
      cirlceNode.y = pt.y;
    }

  } );
} );