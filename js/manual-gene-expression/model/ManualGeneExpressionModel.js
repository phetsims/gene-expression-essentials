// Copyright 2015-2021, University of Colorado Boulder

/**
 * Primary model for the 'Expression' screen.  This model interacts with the user (via the view) to allow them to
 * synthesize proteins from the information coded in the DNA strand by manually manipulating the various biomolecules
 * that are involved in the process.
 *
 * The point (0,0) in model space is at the leftmost edge of the DNA strand, and at the vertical center of the strand.
 *
 * @author Sharfudeen Ashraf
 * @author Mohamed Safi
 * @author John Blanco
 * @author Aadish Gupta
 */

import createObservableArray from '../../../../axon/js/createObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import GEEConstants from '../../common/GEEConstants.js';
import DnaMolecule from '../../common/model/DnaMolecule.js';
import GeneA from '../../common/model/GeneA.js';
import GeneExpressionModel from '../../common/model/GeneExpressionModel.js';
import MotionBounds from '../../common/model/motion-strategies/MotionBounds.js';
import Protein from '../../common/model/Protein.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GeneB from './GeneB.js';
import GeneC from './GeneC.js';
import ProteinA from './ProteinA.js';
import ProteinB from './ProteinB.js';
import ProteinC from './ProteinC.js';

// constants
// Stage size for the mobile biomolecules, which is basically the area in which the molecules can move. These are
// empirically determined such that the molecules don't move off of the screen when looking at a given gene.
const BIOMOLECULE_STAGE_WIDTH = 10000; // In picometers.
const BIOMOLECULE_STAGE_HEIGHT = 6000; // In picometers.

// size of the DNA strand
const NUM_BASE_PAIRS_ON_DNA_STRAND = 2000;

class ManualGeneExpressionModel extends GeneExpressionModel {

  /**
   */
  constructor() {
    super();

    // @private {DnaMolecule} - the DNA strand, which is where the genes reside and where the polymerase does its
    // transcription, and where a lot of the action within this model takes place.
    this.dnaMolecule = new DnaMolecule(
      this,
      NUM_BASE_PAIRS_ON_DNA_STRAND,
      -NUM_BASE_PAIRS_ON_DNA_STRAND * GEEConstants.DISTANCE_BETWEEN_BASE_PAIRS / 4,
      false
    );
    this.dnaMolecule.addGene( new GeneA( this.dnaMolecule, NUM_BASE_PAIRS_ON_DNA_STRAND / 4 - GeneA.NUM_BASE_PAIRS / 2 ) );
    this.dnaMolecule.addGene( new GeneB( this.dnaMolecule, NUM_BASE_PAIRS_ON_DNA_STRAND / 2 - GeneB.NUM_BASE_PAIRS / 2 ) );
    this.dnaMolecule.addGene( new GeneC( this.dnaMolecule, NUM_BASE_PAIRS_ON_DNA_STRAND * 3 / 4 - GeneC.NUM_BASE_PAIRS / 2 ) );

    // list of mobile biomolecules in the model, excluding mRNA
    this.mobileBiomoleculeList = createObservableArray(); // @public

    // list of mRNA molecules in the sim - These are kept separate because they are treated a bit differently than the
    // other mobile biomolecules.
    this.messengerRnaList = createObservableArray(); // @public

    // The gene that the user is focusing on, other gene activity is suspended.  Start with the 0th gene in the DNA
    // (leftmost). Initialize variables that are dependent upon the DNA.
    this.activeGeneProperty = new Property( this.dnaMolecule.getGenes()[ 0 ] ); // @public(read-only)

    // List of areas where biomolecules should not be allowed.  These are generally populated by the view in order to
    // keep biomolecules from wandering over the toolboxes and collection areas.
    this.offLimitsMotionSpaces = []; //@private

    // Properties that track how many of the various proteins have been collected.
    this.proteinACollectedProperty = new Property( 0 ); // @public(read-only)
    this.proteinBCollectedProperty = new Property( 0 ); // @public(read-only)
    this.proteinCCollectedProperty = new Property( 0 ); // @public(read-only)

    // Map of the protein collection count properties to the protein types, used to obtain the count property based on
    // the type of protein.
    this.mapProteinClassToCollectedCount = {
      ProteinA: this.proteinACollectedProperty,
      ProteinB: this.proteinBCollectedProperty,
      ProteinC: this.proteinCCollectedProperty
    };

    // Rectangle that describes the "protein capture area".  When a protein is dropped by the user over this area, it
    // is considered to be captured.
    // Initially it is empty and is set by call to the function setProteinCaptureArea()
    this.proteinCaptureArea = Bounds2.NOTHING.copy(); // @private
  }

  /**
   * main step function for this model
   * @param {number} dt
   * @public
   */
  step( dt ) {

    this.mobileBiomoleculeList.forEach( mobileBiomolecule => {
      mobileBiomolecule.step( dt );
    } );

    this.messengerRnaList.forEach( messengerRna => {
      messengerRna.step( dt );
    } );

    this.dnaMolecule.step( dt );
  }

  /**
   * @returns {DnaMolecule}
   * @public
   */
  getDnaMolecule() {
    return this.dnaMolecule;
  }

  /**
   * Switch to the previous gene
   * @public
   */
  previousGene() {
    this.switchToGeneRelative( -1 );
  }

  /**
   * Switch to the next gene
   * @public
   */
  nextGene() {
    this.switchToGeneRelative( +1 );
  }

  /**
   * @param {Bounds2} newCaptureAreaBounds
   * @public
   */
  setProteinCaptureArea( newCaptureAreaBounds ) {
    this.proteinCaptureArea.set( newCaptureAreaBounds );
  }

  /**
   * @param {string} proteinType
   * @returns {Property}
   * @public
   */
  getCollectedCounterForProteinType( proteinType ) {
    return this.mapProteinClassToCollectedCount[ proteinType ];
  }

  /**
   * @param {number} i
   * @private
   */
  switchToGeneRelative( i ) {
    const genes = this.dnaMolecule.getGenes();
    const index = Utils.clamp( 0, genes.indexOf( this.activeGeneProperty.get() ) + i, genes.length - 1 );
    this.activeGeneProperty.set( genes[ index ] );
  }

  /**
   * @param {number} i
   * @private
   */
  activateGene( i ) {
    this.activeGeneProperty.set( this.dnaMolecule.getGenes()[ i ] );
  }

  /**
   * @override
   * @param {MobileBiomolecule} mobileBiomolecule
   * @public
   */
  addMobileBiomolecule( mobileBiomolecule ) {
    const self = this;
    this.mobileBiomoleculeList.add( mobileBiomolecule );
    mobileBiomolecule.setMotionBounds( this.getBoundsForActiveGene() );

    // Hook up an observer that will activate and deactivate placement hints for this molecule.
    mobileBiomolecule.userControlledProperty.link( ( isUserControlled, wasUserControlled ) => {

      if ( isUserControlled ) {
        this.dnaMolecule.activateHints( mobileBiomolecule );
        this.messengerRnaList.forEach( messengerRna => {
          messengerRna.activateHints( mobileBiomolecule );
        } );
      }
      else {

        if ( wasUserControlled ) {

          // The user dropped this biomolecule, so deactivate any hints that were showing where it could be placed.
          this.dnaMolecule.deactivateAllHints();
          this.messengerRnaList.forEach( messengerRna => {
            messengerRna.deactivateAllHints();
          } );

          // See if this is a protein being placed in the capture area.
          if ( this.proteinCaptureArea.containsPoint( mobileBiomolecule.getPosition() ) &&
               mobileBiomolecule instanceof Protein ) {

            // The user has dropped this protein in the capture area. So capture it.
            this.captureProtein( mobileBiomolecule );
          }
        }
      }
    } );

    // Hook up an observer that will remove this biomolecule from the model if its existence strength reaches zero.
    mobileBiomolecule.existenceStrengthProperty.link( function existenceStrengthChangeHandler( existenceStrength ) {
      if ( existenceStrength === 0 ) {
        self.removeMobileBiomolecule( mobileBiomolecule );
        mobileBiomolecule.existenceStrengthProperty.unlink( existenceStrengthChangeHandler );
      }
    } );
  }

  /**
   * Get a list of all mobile biomolecules that overlap with the provided shape.
   *
   * @param {Bounds2} testShapeBounds - Bounds, in model coordinate, to test for overlap.
   * @returns {Array.<MobileBiomolecule>} List of molecules that overlap with the provided bounds.
   * @public
   */
  getOverlappingBiomolecules( testShapeBounds ) {

    const overlappingBiomolecules = [];

    this.mobileBiomoleculeList.forEach( mobileBiomolecule => {
      if ( mobileBiomolecule.bounds.intersectsBounds( testShapeBounds ) ) {

        overlappingBiomolecules.push( mobileBiomolecule );
      }
    } );

    return overlappingBiomolecules;
  }

  /**
   * Capture the specified protein, which means that it is actually removed from the model and the associated
   * capture count property is incremented.
   * @param {Protein} protein
   * @private
   */
  captureProtein( protein ) {
    if ( protein instanceof ProteinA ) {
      this.proteinACollectedProperty.set( this.proteinACollectedProperty.get() + 1 );
    }
    if ( protein instanceof ProteinB ) {
      this.proteinBCollectedProperty.set( this.proteinBCollectedProperty.get() + 1 );
    }
    if ( protein instanceof ProteinC ) {
      this.proteinCCollectedProperty.set( this.proteinCCollectedProperty.get() + 1 );
    }
    this.mobileBiomoleculeList.remove( protein );
  }

  /**
   * @param {Protein} proteinClassType
   * @returns {number}
   * @public
   */
  getProteinCount( proteinClassType ) {
    let count = 0;
    this.mobileBiomoleculeList.forEach( mobileBiomolecule => {
      if ( mobileBiomolecule instanceof proteinClassType ) {
        count++;
      }
    } );
    return count;
  }

  /**
   * @param {MobileBiomolecule} mobileBiomolecule
   * @public
   */
  removeMobileBiomolecule( mobileBiomolecule ) {
    this.mobileBiomoleculeList.remove( mobileBiomolecule );
  }

  /**
   * @param {MessengerRna} messengerRna
   * @public
   */
  addMessengerRna( messengerRna ) {
    this.messengerRnaList.add( messengerRna );
    messengerRna.setMotionBounds( this.getBoundsForActiveGene() );
  }

  /**
   * @param {MessengerRna} messengerRnaBeingDestroyed
   * @public
   */
  removeMessengerRna( messengerRnaBeingDestroyed ) {
    this.messengerRnaList.remove( messengerRnaBeingDestroyed );
  }

  /**
   * @override
   * @returns {ObservableArrayDef}
   * @public
   */
  getMessengerRnaList() {
    return this.messengerRnaList;
  }

  /**
   * Resets the model to initial state
   * @public
   */
  reset() {
    this.mobileBiomoleculeList.clear();
    this.messengerRnaList.clear();
    this.dnaMolecule.reset();
    this.proteinACollectedProperty.reset();
    this.proteinBCollectedProperty.reset();
    this.proteinCCollectedProperty.reset();
    this.activateGene( 0 );
  }

  /**
   * Add a space where the biomolecules should not be allowed to wander. This is generally used by the view to prevent
   * biomolecules from moving over toolboxes and such.
   *
   * @param {Bounds2} newOffLimitsSpace
   * @public
   */
  addOffLimitsMotionSpace( newOffLimitsSpace ) {
    for ( let i = 0; i < this.offLimitsMotionSpaces.length; i++ ) {

      const offLimitsMotionSpace = this.offLimitsMotionSpaces[ i ];
      if ( offLimitsMotionSpace.equals( newOffLimitsSpace ) ) {
        // An equivalent space already exists, so don't bother adding this one.
        return;
      }
    }
    // Add the new one to the list.
    this.offLimitsMotionSpaces.push( newOffLimitsSpace );
  }

  /**
   * Get the motion bounds for any biomolecule that is going to be associated with the currently active gene.  This is
   * used to keep the biomolecules from wandering outside of the area that the user can see.
   * @private
   */
  getBoundsForActiveGene() {

    // The bottom bounds are intended to be roughly at the bottom of the viewport.  The value was empirically determined.
    const bottomYPos = GEEConstants.DNA_MOLECULE_Y_POS - 2100;

    // Get the nominal bounds for this gene.
    const bounds = new Bounds2( this.activeGeneProperty.get().getCenterX() - BIOMOLECULE_STAGE_WIDTH / 2,
      bottomYPos,
      this.activeGeneProperty.get().getCenterX() - BIOMOLECULE_STAGE_WIDTH / 2 + BIOMOLECULE_STAGE_WIDTH,
      bottomYPos + BIOMOLECULE_STAGE_HEIGHT );

    const motionBounds = new MotionBounds( bounds );
    // Subtract off any off limits areas.
    this.offLimitsMotionSpaces.forEach( offLimitMotionSpace => {
      if ( bounds.intersectsBounds( offLimitMotionSpace ) ) {
        motionBounds.addOffLimitMotionSpace( offLimitMotionSpace );
      }
    } );
    return motionBounds;
  }
}

geneExpressionEssentials.register( 'ManualGeneExpressionModel', ManualGeneExpressionModel );

export default ManualGeneExpressionModel;