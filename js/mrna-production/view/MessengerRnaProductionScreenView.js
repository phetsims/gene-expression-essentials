// Copyright 2015-2019, University of Colorado Boulder

/**
 * Screen View for Messenger Rna Production Screen
 *
 * @author Mohamed Safi
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const DnaMoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/DnaMoleculeNode' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MessengerRnaNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MessengerRnaNode' );
  const MessengerRnaProductionModel = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/model/MessengerRnaProductionModel' );
  const MobileBiomoleculeNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/MobileBiomoleculeNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const PolymeraseAffinityControlPanel = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/view/PolymeraseAffinityControlPanel' );
  const Property = require( 'AXON/Property' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TranscriptionFactorControlPanel = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/view/TranscriptionFactorControlPanel' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const INSET = 10;  // Inset for several of the controls.

  // strings
  const negativeTranscriptionFactorString = require( 'string!GENE_EXPRESSION_ESSENTIALS/negativeTranscriptionFactor' );

  /**
   * @param {MessengerRnaProductionModel} model
   * @constructor
   */
  function MessengerRnaProductionScreenView( model ) {

    // due to odd behavior of flickering on this screen, we run it with preventFit
    ScreenView.call( this, { preventFit: true } );
    const self = this;
    this.model = model;
    this.negativeTranscriptionFactorEnabled = new Property( false );
    const viewPortPosition = new Vector2( this.layoutBounds.width * 0.48, this.layoutBounds.height * 0.4 );

    // Set up the model-canvas transform.
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      viewPortPosition,
      0.2  // "Zoom factor" - smaller zooms out, larger zooms in.
    );

    // Set up the root node for all model objects. Nodes placed under this one will scroll when the user moves along the
    // DNA strand.
    this.modelRootNode = new Node();
    this.addChild( this.modelRootNode );

    // Add some layers for enforcing some z-order relationships needed in order to keep things looking good.
    const dnaLayer = new Node();
    this.modelRootNode.addChild( dnaLayer );
    dnaLayer.setPickable( false );
    const messengerRnaLayer = new Node();
    messengerRnaLayer.setPickable( false );
    this.modelRootNode.addChild( messengerRnaLayer );
    const transcribingPolymeraseLayer = new Node();
    transcribingPolymeraseLayer.setPickable( false );
    this.modelRootNode.addChild( transcribingPolymeraseLayer );
    const topBiomoleculeLayer = new Node();
    topBiomoleculeLayer.setPickable( false );
    this.modelRootNode.addChild( topBiomoleculeLayer );
    const placementHintLayer = new Node();
    this.modelRootNode.addChild( placementHintLayer );
    const controlsNode = new Node();
    this.addChild( controlsNode );

    // Add the representation of the DNA strand.
    this.dnaMoleculeNode = new DnaMoleculeNode( model.getDnaMolecule(), this.modelViewTransform, 5, false );
    dnaLayer.addChild( this.dnaMoleculeNode );

    // Get a reference to the gene being controlled.
    const gene = model.getDnaMolecule().getGenes()[ 0 ];

    // Add the nodes that allow the user to control the concentrations and affinities.
    const positiveTranscriptionFactorControlPanel = new TranscriptionFactorControlPanel(
      model,
      MessengerRnaProductionModel.POSITIVE_TRANSCRIPTION_FACTOR_CONFIG,
      gene.getTranscriptionFactorAffinityProperty( MessengerRnaProductionModel.POSITIVE_TRANSCRIPTION_FACTOR_CONFIG )
    );
    controlsNode.addChild( positiveTranscriptionFactorControlPanel );

    const polymeraseAffinityControlPanel = new PolymeraseAffinityControlPanel(
      MessengerRnaProductionModel.POSITIVE_TRANSCRIPTION_FACTOR_CONFIG,
      positiveTranscriptionFactorControlPanel.bounds.height,
      gene.getPolymeraseAffinityProperty()
    );
    controlsNode.addChild( polymeraseAffinityControlPanel );

    const negativeTranscriptionFactorControlPanel = new TranscriptionFactorControlPanel(
      model,
      MessengerRnaProductionModel.NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG,
      gene.getTranscriptionFactorAffinityProperty( MessengerRnaProductionModel.NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG )
    );
    controlsNode.addChild( negativeTranscriptionFactorControlPanel );

    // Add the checkbox for showing/hiding the control panel for the negative transcription factor.
    const negativeFactorEnabledCheckbox = new Checkbox(
      new Text( negativeTranscriptionFactorString, { font: new PhetFont( 18 ), maxWidth: 275 } ),
      this.negativeTranscriptionFactorEnabled,
      { boxWidth: 20 }
    );
    controlsNode.addChild( negativeFactorEnabledCheckbox );

    // Only show the control for the negative transcription factor if it is enabled.
    this.negativeTranscriptionFactorEnabled.link( function( enabled ) {
      negativeTranscriptionFactorControlPanel.setVisible( enabled );
      if ( !enabled ) {
        // When the negative transcription factor control is hidden, there should be no negative factors.
        self.model.negativeTranscriptionFactorCountProperty.reset();
      }
    } );

    // Add the play/pause button.
    const playPauseButton = new PlayPauseButton( model.clockRunningProperty, {
      radius: 23,
      touchAreaDilation: 5
    } );
    this.addChild( playPauseButton );

    // Add the step button.
    const stepButton = new StepForwardButton( {
      isPlayingProperty: model.clockRunningProperty,
      listener: function() { model.stepInTime( 0.016 ); },
      radius: 15,
      touchAreaDilation: 5
    } );
    this.addChild( stepButton );

    // Add the Reset All button.
    const resetAllButton = new ResetAllButton( {
      listener: function() {
        self.model.reset();
        self.negativeTranscriptionFactorEnabled.reset();
      },
      right: this.layoutBounds.maxX - INSET,
      bottom: this.layoutBounds.maxY - INSET
    } );
    controlsNode.addChild( resetAllButton );

    // Lay out the controls.

    positiveTranscriptionFactorControlPanel.left = INSET;
    positiveTranscriptionFactorControlPanel.bottom = this.layoutBounds.maxY - INSET;

    polymeraseAffinityControlPanel.left = positiveTranscriptionFactorControlPanel.right + INSET;
    polymeraseAffinityControlPanel.bottom = positiveTranscriptionFactorControlPanel.bottom;

    negativeTranscriptionFactorControlPanel.left = polymeraseAffinityControlPanel.right + INSET;
    negativeTranscriptionFactorControlPanel.bottom = polymeraseAffinityControlPanel.bottom;
    negativeFactorEnabledCheckbox.left = negativeTranscriptionFactorControlPanel.right + INSET;
    negativeFactorEnabledCheckbox.centerY = resetAllButton.centerY;

    playPauseButton.bottom = negativeFactorEnabledCheckbox.top - 2 * INSET;
    playPauseButton.centerX = negativeFactorEnabledCheckbox.centerX;

    stepButton.centerY = playPauseButton.centerY;
    stepButton.left = playPauseButton.right + INSET;

    // define a function for adding views of biomolecules
    function addBiomoleculeView( addedBiomolecule ) {
      const biomoleculeNode = new MobileBiomoleculeNode( self.modelViewTransform, addedBiomolecule );

      // On this screen, users can't directly interact with individual biomolecules.
      biomoleculeNode.setPickable( false );
      topBiomoleculeLayer.addChild( biomoleculeNode );

      // Add a listener that moves the child on to a lower layer when it connects to the DNA so that we see the desired
      // overlap behavior.
      const positionBiomolecule = function( attachedToDna ) {
        if ( attachedToDna ) {
          if ( topBiomoleculeLayer.hasChild( biomoleculeNode ) ) {
            topBiomoleculeLayer.removeChild( biomoleculeNode );
          }
          transcribingPolymeraseLayer.addChild( biomoleculeNode );
        }
        else {
          if ( transcribingPolymeraseLayer.hasChild( biomoleculeNode ) ) {
            transcribingPolymeraseLayer.removeChild( biomoleculeNode );
          }
          topBiomoleculeLayer.addChild( biomoleculeNode );
        }
      };
      addedBiomolecule.attachedToDnaProperty.lazyLink( positionBiomolecule );

      model.mobileBiomoleculeList.addItemRemovedListener( function removalListener( removedBiomolecule ) {
        if ( removedBiomolecule === addedBiomolecule ) {
          if ( topBiomoleculeLayer.hasChild( biomoleculeNode ) ) {
            topBiomoleculeLayer.removeChild( biomoleculeNode );
          }
          else if ( dnaLayer.hasChild( biomoleculeNode ) ) {
            dnaLayer.removeChild( biomoleculeNode );
          }
          addedBiomolecule.attachedToDnaProperty.unlink( positionBiomolecule );
          biomoleculeNode.dispose();
          model.mobileBiomoleculeList.removeItemRemovedListener( removalListener );
        }
      } );
    }

    model.mobileBiomoleculeList.forEach( function( bioMolecule ) {
      addBiomoleculeView( bioMolecule );
    } );

    // Watch for and handle comings and goings of biomolecules in the model. Most, but not all, of the biomolecules are
    // handled by this. A few others are handled as special cases.
    model.mobileBiomoleculeList.addItemAddedListener( function( addedBiomolecule ) {
      addBiomoleculeView( addedBiomolecule );
    } );

    // Watch for and handle comings and goings of messenger RNA.
    model.messengerRnaList.addItemAddedListener( function( addedMessengerRna ) {

      const messengerRnaNode = new MessengerRnaNode( self.modelViewTransform, addedMessengerRna );
      messengerRnaLayer.addChild( messengerRnaNode );

      model.messengerRnaList.addItemRemovedListener( function removalListener( removedMessengerRna ) {
        if ( removedMessengerRna === addedMessengerRna ) {
          messengerRnaLayer.removeChild( messengerRnaNode );
          messengerRnaNode.dispose();
          model.messengerRnaList.removeItemRemovedListener( removalListener );
        }
      } );
    } );
  }

  geneExpressionEssentials.register( 'MessengerRnaProductionScreenView', MessengerRnaProductionScreenView );

  return inherit( ScreenView, MessengerRnaProductionScreenView, {

    /**
     * Step function for this view
     * @public
     */
    step: function() {
      this.dnaMoleculeNode.step();
    }
  } );
} );
