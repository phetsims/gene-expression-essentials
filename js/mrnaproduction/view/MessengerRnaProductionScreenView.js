// Copyright 2015, University of Colorado Boulder

/**
 * @author Mohamed Safi
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlacementHintNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/PlacementHintNode' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  var MessengerRnaNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MessengerRnaNode' );
  var Property = require( 'AXON/Property' );
  var DnaMoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/DnaMoleculeNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var TranscriptionFactorControlPanel = require( 'GENE_EXPRESSION_ESSENTIALS/mrnaproduction/view/TranscriptionFactorControlPanel' );
  var PolymeraseAffinityControlPanel = require( 'GENE_EXPRESSION_ESSENTIALS/mrnaproduction/view/PolymeraseAffinityControlPanel' );
  var MessengerRnaProductionModel = require( 'GENE_EXPRESSION_ESSENTIALS/mrnaproduction/model/MessengerRnaProductionModel' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  // var FloatingClockControlNode;//TODO
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );

  // constants
  var INSET = 15;  // Inset for several of the controls.

  // strings
  var negativeTranscriptionFactorString = require( 'string!GENE_EXPRESSION_ESSENTIALS/negativeTranscriptionFactor' );

  //TODO  isAncesterOf method used in PNode java
  //function isAncesterOf( node1, node2 ) {
  //  var p = node2.parent;
  //  while ( p !== null ) {
  //    if ( p === node1 ) {
  //      return true;
  //    }
  //    p = p.parent;
  //  }
  //  return false;
  //}


  /**
   * @param {MessengerRnaProductionModel} model
   * @constructor
   */
  function MessengerRnaProductionScreenView( model ) {

    ScreenView.call( this );
    var self = this;
    this.model = model;
    this.clockRunning = new Property( false );
    this.negativeTranscriptionFactorEnabled = new Property( false );
    var viewPortPosition = new Vector2( self.layoutBounds.width * 0.48, self.layoutBounds.height * 0.4 );

    // Set up the model-canvas transform.
    // IMPORTANT NOTES: The multiplier factors for the 2nd point can be
    // adjusted to shift the center right or left, and the scale factor
    // can be adjusted to zoom in or out (smaller numbers zoom out, larger
    // ones zoom in).
    this.mvt = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO, viewPortPosition, 0.2 ); // "Zoom factor" - smaller zooms out, larger zooms in.


    // Set up the root node for all model objects.  Nodes placed under
    // this one will scroll when the user moves along the DNA strand.
    this.modelRootNode = new Node();
    this.addChild( this.modelRootNode );


    // Add some layers for enforcing some z-order relationships needed in
    // order to keep things looking good.
    var dnaLayer = new Node();
    self.modelRootNode.addChild( dnaLayer );
    var biomoleculeToolBoxLayer = new Node();
    self.modelRootNode.addChild( biomoleculeToolBoxLayer );
    var messengerRnaLayer = new Node();
    self.modelRootNode.addChild( messengerRnaLayer );
    var topBiomoleculeLayer = new Node();
    self.modelRootNode.addChild( topBiomoleculeLayer );
    var placementHintLayer = new Node();
    self.modelRootNode.addChild( placementHintLayer );
    var controlsNode = new Node();
    self.addChild( controlsNode );

    // Add the representation of the DNA strand.
    var dnaMoleculeNode = new DnaMoleculeNode( model.getDnaMolecule(), this.mvt, 5, false );
    dnaLayer.addChild( dnaMoleculeNode );

    // Add the placement hints that go on the DNA molecule.  These exist on
    // their own layer so that they can be seen above any molecules that
    // are attached to the DNA strand.
    model.getDnaMolecule().getGenes().forEach( function( gene ) {
      gene.getPlacementHints().forEach( function( placementHint ) {
        placementHintLayer.addChild( new PlacementHintNode( self.mvt, placementHint ) );
      } );
    } );


    // Add motion bounds indicator, if turned on.
    //if ( SHOW_MOTION_BOUNDS ) {
    //    topBiomoleculeLayer.addChild( new PhetPPath( mvt.modelToView( model.moleculeMotionBounds.getBounds() ), new BasicStroke( 2 ), Color.RED ) );
    //}


    // Get a reference to the gene being controlled.
    var gene = model.getDnaMolecule().getGenes()[ 0 ];

    // Add the nodes that allow the user to control the concentrations and affinities.
    var positiveTranscriptionFactorControlPanel =
      new TranscriptionFactorControlPanel( model,
        MessengerRnaProductionModel.POSITIVE_TRANSCRIPTION_FACTOR_CONFIG,
        gene.getTranscriptionFactorAffinityProperty( MessengerRnaProductionModel.POSITIVE_TRANSCRIPTION_FACTOR_CONFIG ) );
    controlsNode.addChild( positiveTranscriptionFactorControlPanel );

    var polymeraseAffinityControlPanel = new PolymeraseAffinityControlPanel(
     MessengerRnaProductionModel.POSITIVE_TRANSCRIPTION_FACTOR_CONFIG,
      positiveTranscriptionFactorControlPanel.bounds.height,
      gene.getPolymeraseAffinityProperty() );
    controlsNode.addChild( polymeraseAffinityControlPanel );


    var negativeTranscriptionFactorControlPanel =
      new TranscriptionFactorControlPanel( model,
        MessengerRnaProductionModel.NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG,
        gene.getTranscriptionFactorAffinityProperty( MessengerRnaProductionModel.NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG ) );
    controlsNode.addChild( negativeTranscriptionFactorControlPanel );


    // Add the check box for showing/hiding the control panel for the
    // negative transcription factor.
    var negativeFactorEnabledCheckBox = new CheckBox( new Text( negativeTranscriptionFactorString, { font: new PhetFont( 18 ) } ),
      self.negativeTranscriptionFactorEnabled, {
        boxWidth: 20
      } );
    controlsNode.addChild( negativeFactorEnabledCheckBox );


    // Only show the control for the negative transcription factor if it
    // is enabled.
    self.negativeTranscriptionFactorEnabled.link( function( enabled ) {
      negativeTranscriptionFactorControlPanel.setVisible( enabled );
      if ( !enabled ) {
        // When the negative transcription factor control is
        // hidden, there should be no negative factors.
        self.model.negativeTranscriptionFactorCount.reset();
      }
    } );


    // Add the floating clock control.
    // var modelClock = thisView.model.getClock(); //commented to pass lint
    self.clockRunning.link( function( isRunning ) {
      // modelClock.setRunning(isRunning); //TODO
    } );

    //TODO
    //var floatingClockControlNode = new FloatingClockControlNode( thisView.clockRunning, null,
    //                                                                                        model.getClock(), null,
    //                                                                                        new Property<Color>( Color.white ) );
    //controlsNode.addChild( floatingClockControlNode );

    // Make sure that the floating clock control sees the change when the
    // clock gets started.
    //thisView.model.getClock().addClockListener( new edu.colorado.phet.common.phetcommon.model.clock.ClockAdapter() {
    //    @Override public void clockStarted( edu.colorado.phet.common.phetcommon.model.clock.ClockEvent clockEvent ) {
    //        clockRunning.set( true );
    //    }
    //} );

    // Add the Reset All button.
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        self.model.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    //this.addChild( resetAllButton );//TODO
    controlsNode.addChild( resetAllButton );


    // Lay out the controls.

    positiveTranscriptionFactorControlPanel.x = INSET;
    positiveTranscriptionFactorControlPanel.y = self.layoutBounds.height - positiveTranscriptionFactorControlPanel.bounds.height - INSET;

    polymeraseAffinityControlPanel.x = positiveTranscriptionFactorControlPanel.bounds.getMaxX() + 10;
    polymeraseAffinityControlPanel.y = positiveTranscriptionFactorControlPanel.bounds.getMinY();

    negativeTranscriptionFactorControlPanel.x = polymeraseAffinityControlPanel.bounds.getMaxX() + 10;
    negativeTranscriptionFactorControlPanel.y = polymeraseAffinityControlPanel.bounds.getMinY();
    var middleXOfUnusedSpace = ( negativeTranscriptionFactorControlPanel.bounds.getMaxX() +
                                 self.layoutBounds.width ) / 2;

    resetAllButton.x = middleXOfUnusedSpace - resetAllButton.bounds.width / 2;
    resetAllButton.y = positiveTranscriptionFactorControlPanel.bounds.getMaxY() - resetAllButton.bounds.height;
    negativeFactorEnabledCheckBox.x = middleXOfUnusedSpace - negativeFactorEnabledCheckBox.bounds.width / 2;
    negativeFactorEnabledCheckBox.y = resetAllButton.bounds.getMinY() - negativeFactorEnabledCheckBox.bounds.height - 10;
    //floatingClockControlNode.setOffset( middleXOfUnusedSpace - floatingClockControlNode.getFullBoundsReference().width / 2,
    //                                    negativeFactorEnabledCheckBox.getFullBoundsReference().getMinY() - floatingClockControlNode.getFullBoundsReference().height - 10 );


    // Watch for and handle comings and goings of biomolecules in the model.
//        // Most, but not all, of the biomolecules are handled by this.  A few
//        // others are handled as special cases.
    model.mobileBiomoleculeList.addItemAddedListener( function( addedBiomolecule ) {

      var biomoleculeNode = new MobileBiomoleculeNode( self.mvt, addedBiomolecule );

      // On this tab, users can't directly interact with individual biomolecules.
      biomoleculeNode.setPickable( false );
      //biomoleculeNode.setChildrenPickable( false );


      // Add a listener that moves the child on to a lower layer when
      // it connects to the DNA so that we see the desired overlap
      // behavior.
      addedBiomolecule.attachedToDnaProperty.link( function( attachedToDna ) {

        if ( attachedToDna ) {
          topBiomoleculeLayer.removeChild( biomoleculeNode );
          dnaLayer.addChild( biomoleculeNode );
        }
        else {
          dnaLayer.removeChild( biomoleculeNode );
          topBiomoleculeLayer.addChild( biomoleculeNode );
        }
      } );

      model.mobileBiomoleculeList.addItemRemovedListener( function( removedBiomolecule ) {
        if ( removedBiomolecule === addedBiomolecule ) {
          //if ( isAncesterOf( topBiomoleculeLayer, biomoleculeNode ) ) { //TODO
          //  topBiomoleculeLayer.removeChild( biomoleculeNode );
          //}
          //else if ( isAncestorOf( dnaLayer, biomoleculeNode ) ) { //TODO
          //  dnaLayer.removeChild( biomoleculeNode );
          //}
        }
      } );

    } );


    // Watch for and handle comings and goings of messenger RNA.
    model.messengerRnaList.addItemAddedListener( function( addedMessengerRna ) {

      var messengerRnaNode = new MessengerRnaNode( self.mvt, addedMessengerRna );
      messengerRnaLayer.addChild( messengerRnaNode );

      model.messengerRnaList.addItemRemovedListener( function( removedMessengerRna ) {
        if ( removedMessengerRna === addedMessengerRna ) {
          messengerRnaLayer.removeChild( messengerRnaNode );
        }

      } );

    } );


  }

  geneExpressionEssentials.register( 'MessengerRnaProductionScreenView', MessengerRnaProductionScreenView );

  return inherit( ScreenView, MessengerRnaProductionScreenView, {} );

} );
