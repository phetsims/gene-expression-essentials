// Copyright 2015-2022, University of Colorado Boulder

/**
 * Screen View for Manual Gene Expression screen
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import DnaMoleculeNode from '../../common/view/DnaMoleculeNode.js';
import MessengerRnaNode from '../../common/view/MessengerRnaNode.js';
import MobileBiomoleculeNode from '../../common/view/MobileBiomoleculeNode.js';
import PlacementHintNode from '../../common/view/PlacementHintNode.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../../GeneExpressionEssentialsStrings.js';
import BiomoleculeToolboxNode from './BiomoleculeToolboxNode.js';
import ProteinCollectionNode from './ProteinCollectionNode.js';

// constants
const GENE_TO_GENE_ANIMATION_TIME = 1; // in seconds
const INSET = 15; // inset for several of the controls, in view coordinates

const nextGeneString = GeneExpressionEssentialsStrings.nextGene;
const previousGeneString = GeneExpressionEssentialsStrings.previousGene;

class ManualGeneExpressionScreenView extends ScreenView {

  /**
   * @param {ManualGeneExpressionModel} model
   */
  constructor( model ) {

    super( { preventFit: true } );
    this.viewPortOffset = new Vector2( 0, 0 );
    const biomoleculeToolboxNodeList = []; // array containing the toolbox nodes used to create biomolecules

    // Set up the model-view transform. The multiplier factors for the 2nd point can be adjusted to shift the center
    // right or left, and the scale factor can be adjusted to zoom in or out (smaller numbers zoom out, larger ones zoom
    // in).
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( this.layoutBounds.width * 0.48, this.layoutBounds.height * 0.64 ),
      0.1 // "zoom factor" - smaller zooms out, larger zooms in
    );

    // Set up the node where all controls that need to be below the biomolecules should be placed.  This node and its
    // children will stay in one place and not scroll.
    const backControlsLayer = new Node();
    this.addChild( backControlsLayer );

    // Set up the root node for all model objects. Nodes placed under this one will scroll when the user moves along the
    // DNA strand.
    this.modelRootNode = new Node();
    this.addChild( this.modelRootNode );

    // Add some layers for enforcing some z-order relationships needed in order to keep things looking good.
    const dnaLayer = new Node();
    this.modelRootNode.addChild( dnaLayer );
    const biomoleculeToolboxLayer = new Node();
    this.modelRootNode.addChild( biomoleculeToolboxLayer );
    const messengerRnaLayer = new Node();
    this.modelRootNode.addChild( messengerRnaLayer );
    const topBiomoleculeLayer = new Node();
    this.modelRootNode.addChild( topBiomoleculeLayer );
    const placementHintLayer = new Node();
    this.modelRootNode.addChild( placementHintLayer );

    // Set up the node where all controls that need to be above the biomolecules should be placed. This node and its
    // children will stay in one place and not scroll.
    const frontControlsLayer = new Node();
    this.addChild( frontControlsLayer );

    // Add the representation of the DNA strand.
    this.dnaMoleculeNode = new DnaMoleculeNode( model.getDnaMolecule(), this.modelViewTransform, 3, true );
    dnaLayer.addChild( this.dnaMoleculeNode );

    // Add the placement hints that go on the DNA molecule. These exist on their own layer so that they can be seen
    // above any molecules that are attached to the DNA strand.
    model.getDnaMolecule().getGenes().forEach( gene => {
      gene.getPlacementHints().forEach( placementHint => {
        placementHintLayer.addChild( new PlacementHintNode( this.modelViewTransform, placementHint ) );
      } );
    } );

    // Add the protein collection box.
    const proteinCollectionNode = new ProteinCollectionNode( model, this.modelViewTransform );
    proteinCollectionNode.x = this.layoutBounds.width - proteinCollectionNode.bounds.width - INSET;
    proteinCollectionNode.y = INSET;
    backControlsLayer.addChild( proteinCollectionNode );

    // Add any initial molecules.
    model.mobileBiomoleculeList.forEach( biomolecule => {
      topBiomoleculeLayer.addChild( new MobileBiomoleculeNode( this.modelViewTransform, biomolecule ) );
    } );

    // @public (read-only) Map.<MobileBiomolecule,MobileBiomoleculeNode> - A map of the mobile biomolecules to the nodes
    // that represent each in the view.
    this.mobileBiomoleculeToNodeMap = new Map();

    // Watch for and handle comings and goings of biomolecules in the model. Most, but not all, of the biomolecules
    // are handled by this. Some others are handled as special cases, see below.
    model.mobileBiomoleculeList.addItemAddedListener( addedBiomolecule => {

      // Add a node to the view when a new mobile biomolecule is added to the model.
      const biomoleculeNode = new MobileBiomoleculeNode( this.modelViewTransform, addedBiomolecule );
      topBiomoleculeLayer.addChild( biomoleculeNode );
      this.mobileBiomoleculeToNodeMap.set( addedBiomolecule, biomoleculeNode );

      // Handle removal of the mobile biomolecule.
      const removeItemListener = removedBiomolecule => {
        if ( removedBiomolecule === addedBiomolecule ) {
          topBiomoleculeLayer.removeChild( biomoleculeNode );
          this.mobileBiomoleculeToNodeMap.delete( addedBiomolecule );
          model.mobileBiomoleculeList.removeItemRemovedListener( removeItemListener );
        }
      };
      model.mobileBiomoleculeList.addItemRemovedListener( removeItemListener );
    } );

    // Watch for and handle comings and goings of messenger RNA.
    model.messengerRnaList.addItemAddedListener( addedMessengerRna => {

      const messengerRnaNode = new MessengerRnaNode( this.modelViewTransform, addedMessengerRna );
      messengerRnaLayer.addChild( messengerRnaNode );

      function removeItemListener( removedMessengerRna ) {
        if ( removedMessengerRna === addedMessengerRna ) {
          messengerRnaLayer.removeChild( messengerRnaNode );
          model.messengerRnaList.removeItemRemovedListener( removeItemListener );// Clean up memory leak
        }
      }

      model.messengerRnaList.addItemRemovedListener( removeItemListener );

    } );

    // Add the toolboxes from which the various biomolecules can be moved  into the active area of the sim.
    model.getDnaMolecule().getGenes().forEach( gene => {
      const biomoleculeToolboxNode = new BiomoleculeToolboxNode( model, this, this.modelViewTransform, gene );
      biomoleculeToolboxNode.x = this.modelViewTransform.modelToViewX( gene.getCenterX() ) - this.layoutBounds.getWidth() / 2 + INSET;
      biomoleculeToolboxNode.y = INSET;
      biomoleculeToolboxNodeList.push( biomoleculeToolboxNode );
      biomoleculeToolboxLayer.addChild( biomoleculeToolboxNode );
      model.addOffLimitsMotionSpace( this.modelViewTransform.viewToModelBounds( biomoleculeToolboxNode.bounds ) );
    } );

    // define a convenience function that allows quick setting of the pickability of the toolbox nodes
    function setBiomoleculeToolboxPickability( pickable ) {
      biomoleculeToolboxNodeList.forEach( biomoleculeToolboxNode => {
        biomoleculeToolboxNode.pickable = pickable;
      } );
    }

    // add button for moving to next gene
    const nextGeneButtonContent = new HBox( {
      children: [
        new Text( nextGeneString, {
          font: new PhetFont( { size: 18 } ),
          maxWidth: 120
        } ),
        new ArrowNode( 0, 0, 20, 0, {
          headHeight: 8,
          headWidth: 10,
          tailWidth: 5
        } )
      ],
      spacing: 5
    } );
    const nextGeneButton = new RectangularPushButton( {
      content: nextGeneButtonContent,
      listener: () => {
        model.nextGene();
      },
      baseColor: 'yellow',
      stroke: 'black',
      lineWidth: 1
    } );

    nextGeneButton.x = this.layoutBounds.width - nextGeneButton.width - 20;
    nextGeneButton.y = this.modelViewTransform.modelToViewY( model.getDnaMolecule().getLeftEdgePosition().y ) + 90;

    // add buttons for moving to previous gene
    const previousGeneButtonContent = new HBox( {
      children: [
        new ArrowNode( 0, 0, -20, 0, {
          headHeight: 8,
          headWidth: 10,
          tailWidth: 5
        } ),
        new Text( previousGeneString, {
          font: new PhetFont( { size: 18 } ),
          maxWidth: 120
        } )
      ],
      spacing: 5
    } );
    const previousGeneButton = new RectangularPushButton( {
      content: previousGeneButtonContent,
      listener: () => {
        model.previousGene();
      },
      baseColor: 'yellow',
      stroke: 'black',
      lineWidth: 1
    } );

    previousGeneButton.x = 20;
    previousGeneButton.y = this.modelViewTransform.modelToViewY( model.getDnaMolecule().getLeftEdgePosition().y ) + 90;

    // set the position of model root node based on first gene
    this.modelRootNode.x = -this.modelViewTransform.modelToViewX( model.dnaMolecule.getGenes()[ 0 ].getCenterX() )
                           + this.layoutBounds.width / 2;

    // Monitor the active gene and move the view port to be centered on it whenever it changes.
    model.activeGeneProperty.link( gene => {

      // update the enabled state of the buttons that navigate between genes
      nextGeneButton.enabled = !( gene === model.dnaMolecule.getLastGene() );
      previousGeneButton.enabled = !( gene === model.dnaMolecule.getGenes()[ 0 ] );

      // disable interaction with the toolbox node to prevent race conditions
      setBiomoleculeToolboxPickability( false );

      // set the offset of the viewport
      this.viewPortOffset.setXY( -this.modelViewTransform.modelToViewX( gene.getCenterX() ) + this.layoutBounds.width / 2, 0 );

      // create and run the animation that will move the view to the selected gene
      const modelRootNodeAnimator = new Animation( {
        duration: GENE_TO_GENE_ANIMATION_TIME,
        easing: Easing.CUBIC_IN_OUT,
        setValue: newXPos => {
          this.modelRootNode.x = newXPos;
        },
        from: this.modelRootNode.x,
        to: this.viewPortOffset.x
      } );
      modelRootNodeAnimator.finishEmitter.addListener( () => {
        this.modelRootNode.visible = true;
        this.modelRootNode.pickable = null;
        const boundsInControlNode = proteinCollectionNode.getBounds().copy();
        const boundsAfterTransform = boundsInControlNode.transform( this.modelRootNode.getTransform().getInverse() );
        const boundsInModel = this.modelViewTransform.viewToModelBounds( boundsAfterTransform );
        model.setProteinCaptureArea( boundsInModel );
        model.addOffLimitsMotionSpace( boundsInModel );
        setBiomoleculeToolboxPickability( true );
      } );
      modelRootNodeAnimator.start();
    } );

    frontControlsLayer.addChild( nextGeneButton );
    frontControlsLayer.addChild( previousGeneButton );

    // Create and add the Reset All Button in the bottom right, which resets the model
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel user interactions
        model.reset();
        biomoleculeToolboxNodeList.forEach( biomoleculeToolboxNode => {
          biomoleculeToolboxNode.reset();
        } );
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    frontControlsLayer.addChild( resetAllButton );
  }

  /**
   * @public
   */
  step() {
    this.dnaMoleculeNode.step();
  }
}

geneExpressionEssentials.register( 'ManualGeneExpressionScreenView', ManualGeneExpressionScreenView );
export default ManualGeneExpressionScreenView;