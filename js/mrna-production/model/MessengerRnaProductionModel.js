// Copyright 2015-2020, University of Colorado Boulder

/**
 * Primary model for the Messenger RNA Production (mRNA) screen.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import ObservableArray from '../../../../axon/js/ObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import inherit from '../../../../phet-core/js/inherit.js';
import GEEConstants from '../../common/GEEConstants.js';
import DnaMolecule from '../../common/model/DnaMolecule.js';
import GeneA from '../../common/model/GeneA.js';
import MotionBounds from '../../common/model/motion-strategies/MotionBounds.js';
import RnaPolymerase from '../../common/model/RnaPolymerase.js';
import TranscriptionFactor from '../../common/model/TranscriptionFactor.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

// constants

// period for shuffling biomolecules, helps with random behavior
const SHUFFLE_TIME = 1; // seconds

// Length, in terms of base pairs, of the DNA molecule.
const NUM_BASE_PAIRS_ON_DNA_STRAND = 500;

// Configurations for the transcriptions factors used within this model.
const POSITIVE_TRANSCRIPTION_FACTOR_CONFIG = TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_POS;
const NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG = TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_NEG;

// Maximum number of transcription factor molecules.  The pertains to both positive and negative transcription factors.
const MAX_TRANSCRIPTION_FACTOR_COUNT = 8;

// Number of RNA polymerase molecules present.
const RNA_POLYMERASE_COUNT = 7;

/**
 * @constructor
 */
function MessengerRnaProductionModel() {
  const self = this;
  this.clockRunningProperty = new Property( true ); //@public

  // DNA strand, which is where the genes reside, where the polymerase does its transcription, and where a lot of the
  // action takes place.
  // @private
  this.dnaMolecule = new DnaMolecule(
    this,
    NUM_BASE_PAIRS_ON_DNA_STRAND,
    -NUM_BASE_PAIRS_ON_DNA_STRAND * GEEConstants.DISTANCE_BETWEEN_BASE_PAIRS / 2,
    true
  );

  // @private {Gene} The one gene that is on this DNA strand in this model.
  this.gene = new GeneA( this.dnaMolecule, Utils.roundSymmetric( NUM_BASE_PAIRS_ON_DNA_STRAND * 0.4 ) );
  this.dnaMolecule.addGene( this.gene );

  // List of mobile biomolecules in the model, excluding mRNA.
  this.mobileBiomoleculeList = new ObservableArray(); // @public
  this.positiveTranscriptionFactorList = []; // @private
  this.negativeTranscriptionFactorList = []; // @private

  // List of mRNA molecules in the sim. These are kept separate because they are treated a bit differently than the
  // other mobile biomolecules.
  this.messengerRnaList = new ObservableArray(); // @public

  // Properties that control the quantity of transcription factors.
  this.positiveTranscriptionFactorCountProperty = new Property( 0 ); // @public
  this.positiveTranscriptionFactorCountProperty.link( function( count ) {
    self.setTranscriptionFactorCount(
      TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_POS,
      Utils.roundSymmetric( count ),
      self.positiveTranscriptionFactorList
    );
  } );

  this.negativeTranscriptionFactorCountProperty = new Property( 0 ); // @public
  this.negativeTranscriptionFactorCountProperty.link( function( count ) {
    self.setTranscriptionFactorCount(
      TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_NEG,
      Utils.roundSymmetric( count ),
      self.negativeTranscriptionFactorList
    );
  } );

  // Motion bounds for the mobile biomolecules.
  this.moleculeMotionBounds = null; // @private
  this.setUpMotionBounds();

  // @private {number} - accumulator used for deciding when to shuffle the biomolecules
  this.shuffleTimeAccumulator = 0;

  // The bounds within which polymerase may be moved when recycled. Set up the area where RNA polymerase goes when it
  // is recycled. This is near the beginning of the transcribed region in order to make transcription more likely to
  // occur.
  const polymeraseSize = new RnaPolymerase().bounds;
  const firstGene = this.dnaMolecule.getGenes()[ 0 ];
  const recycleZoneCenterX = this.dnaMolecule.getBasePairXOffsetByIndex( firstGene.getTranscribedRegion().min ) +
                             ( phet.joist.random.nextDouble() - 0.5 ) * 2000;
  const recycleZoneHeight = polymeraseSize.getHeight() * 1.2;
  const recycleZoneWidth = polymeraseSize.getWidth() * 4;
  const minX = recycleZoneCenterX - polymeraseSize.getWidth() * 2;
  let minY = GEEConstants.DNA_MOLECULE_Y_POS + polymeraseSize.getHeight();

  // @private
  this.aboveDnaPolymeraseReturnBounds = new Bounds2(
    minX,
    minY,
    minX + recycleZoneWidth,
    minY + recycleZoneHeight
  );

  minY = GEEConstants.DNA_MOLECULE_Y_POS - polymeraseSize.getHeight() - recycleZoneHeight;

  // @private
  this.belowDnaPolymeraseReturnBounds = new Bounds2(
    minX,
    minY,
    minX + recycleZoneWidth,
    minY + polymeraseSize.getHeight() * 1.2
  );

  // Watch for mobileBiomolecule being added and link up the properties.
  this.mobileBiomoleculeList.addItemAddedListener( function( mobileBiomolecule ) {

    // Set the motion bounds such that the molecules move around above and on top of the DNA.
    mobileBiomolecule.setMotionBounds( self.moleculeMotionBounds );

    function handleUserControlledChanged( isUserControlled ) {
      if ( isUserControlled ) {
        self.dnaMolecule.activateHints( mobileBiomolecule );
      }
      else {
        self.dnaMolecule.deactivateAllHints();
      }
    }

    // Hook up an observer that will activate and deactivate placement hints for this molecule.
    mobileBiomolecule.userControlledProperty.link( handleUserControlledChanged );

    function handleExistenceStrengthChanged( existenceStrength ) {
      if ( existenceStrength === 0 ) {
        self.removeMobileBiomolecule( mobileBiomolecule );
      }
    }

    // Hook up an observer that will remove this biomolecule from the model if its existence strength reaches zero.
    mobileBiomolecule.existenceStrengthProperty.link( handleExistenceStrengthChanged );

    self.mobileBiomoleculeList.addItemRemovedListener( function removalListener( removedMobileBiomolecule ) {
      if ( removedMobileBiomolecule === mobileBiomolecule ) {
        mobileBiomolecule.userControlledProperty.unlink( handleUserControlledChanged );
        mobileBiomolecule.existenceStrengthProperty.unlink( handleExistenceStrengthChanged );
        self.mobileBiomoleculeList.removeItemRemovedListener( removalListener );
      }
    } );
  } );

  // Watch for messenger RNA being added and link up the properties.
  this.messengerRnaList.addItemAddedListener( function( messengerRna ) {

    // Since this will never be translated in this model, make it fade away once it is formed.
    messengerRna.setFadeAwayWhenFormed( true );

    function handleExistenceStrengthChanged( existenceStrength ) {
      if ( existenceStrength <= 0 ) {
        // It's "gone", so remove it from the model.
        self.removeMessengerRna( messengerRna );
      }
    }

    // Remove this from the model once its existence strength reaches zero, which it will do since it is fading out.
    messengerRna.existenceStrengthProperty.link( handleExistenceStrengthChanged );

    self.messengerRnaList.addItemRemovedListener( function removalListener( removedMessengerRna ) {
      if ( removedMessengerRna === messengerRna ) {
        messengerRna.existenceStrengthProperty.unlink( handleExistenceStrengthChanged );
        self.messengerRnaList.removeItemRemovedListener( removalListener );
      }
    } );
  } );

  // Reset this model in order to set initial state.
  this.reset();
}

geneExpressionEssentials.register( 'MessengerRnaProductionModel', MessengerRnaProductionModel );

inherit( Object, MessengerRnaProductionModel, {

  /**
   * Step Function for this model
   * @param {number} dt
   * @public
   */
  step: function( dt ) {
    if ( this.clockRunningProperty.get() ) {
      this.stepInTime( dt );
    }
  },

  /**
   * @param {number} dt
   * @public
   */
  stepInTime: function( dt ) {

    // Step all the contained biomolecules.
    this.mobileBiomoleculeList.forEach( function( mobileBiomolecule ) {
      mobileBiomolecule.step( dt );
    } );
    this.messengerRnaList.forEach( function( messengerRna ) {
      messengerRna.step( dt );
    } );
    this.dnaMolecule.step( dt );

    // periodically shuffle the mobile biomolecules so that no molecules gets preference for attachments
    this.shuffleTimeAccumulator += dt;
    if ( this.shuffleTimeAccumulator > SHUFFLE_TIME ) {
      this.mobileBiomoleculeList.shuffle( phet.joist.random );
      this.shuffleTimeAccumulator = 0;
    }
  },

  /**
   * @private
   */
  setUpMotionBounds: function() {

    // Bounds, have been empirically determined to keep biomolecules in .
    const minY = -1854;
    const maxY = 1236;
    const minX = -2458;
    const maxX = 2663;

    const bounds = new Bounds2( minX, minY, maxX, maxY );
    this.moleculeMotionBounds = new MotionBounds( bounds );
  },

  /**
   * @returns {DnaMolecule}
   * @public
   */
  getDnaMolecule: function() {
    return this.dnaMolecule;
  },

  /**
   * @param {MobileBiomolecule} mobileBiomolecule
   * @public
   */
  addMobileBiomolecule: function( mobileBiomolecule ) {
    this.mobileBiomoleculeList.add( mobileBiomolecule );
  },

  /**
   * Get a list of all mobile biomolecules that overlap with the provided shape.
   *
   * @param {Bounds2} testShapeBounds - Bounds, in model coordinate, to test for overlap.
   * @returns {Array.<MobileBiomolecule>} List of molecules that overlap with the provided shape.
   * @public
   */
  getOverlappingBiomolecules: function( testShapeBounds ) {
    const overlappingBiomolecules = [];
    this.mobileBiomoleculeList.forEach( function( mobileBiomolecule ) {
      if ( mobileBiomolecule.bounds.intersectsBounds( testShapeBounds ) ) {
        overlappingBiomolecules.push( mobileBiomolecule );
      }
    } );
    return overlappingBiomolecules;
  },

  /**
   * @param {MobileBiomolecule} mobileBiomolecule
   * @public
   */
  removeMobileBiomolecule: function( mobileBiomolecule ) {
    this.mobileBiomoleculeList.remove( mobileBiomolecule );
    mobileBiomolecule.dispose();
  },

  /**
   * @param {MessengerRna} messengerRna
   * @public
   */
  addMessengerRna: function( messengerRna ) {
    this.messengerRnaList.add( messengerRna );
  },

  /**
   * @param {MessengerRna} messengerRnaBeingDestroyed
   * @public
   */
  removeMessengerRna: function( messengerRnaBeingDestroyed ) {
    this.messengerRnaList.remove( messengerRnaBeingDestroyed );
    messengerRnaBeingDestroyed.dispose();
  },

  /**
   * @returns {ObservableArray}
   * @public
   */
  getMessengerRnaList: function() {
    return this.messengerRnaList;
  },

  /**
   * Reset function for this model
   * @public
   */
  reset: function() {
    this.positiveTranscriptionFactorCountProperty.reset();
    this.negativeTranscriptionFactorCountProperty.reset();
    this.positiveTranscriptionFactorList = [];
    this.negativeTranscriptionFactorList = [];
    this.mobileBiomoleculeList.clear();
    this.messengerRnaList.clear();
    this.dnaMolecule.reset();
    this.gene.getPolymeraseAffinityProperty().reset();
    this.clockRunningProperty.reset();
    this.gene.getTranscriptionFactorAffinityProperty( POSITIVE_TRANSCRIPTION_FACTOR_CONFIG ).reset();
    this.gene.getTranscriptionFactorAffinityProperty( NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG ).reset();

    // Add the polymerase molecules. These don't come and go, the concentration of these remains constant in this
    // model.
    for ( let i = 0; i < RNA_POLYMERASE_COUNT; i++ ) {
      const rnaPolymerase = new RnaPolymerase( this, new Vector2( 0, 0 ) );
      rnaPolymerase.setPosition3D( this.generateInitialPosition3D( rnaPolymerase ) );
      rnaPolymerase.set3DMotionEnabled( true );
      rnaPolymerase.setRecycleMode( true );
      rnaPolymerase.addRecycleReturnZone( this.aboveDnaPolymeraseReturnBounds );
      rnaPolymerase.addRecycleReturnZone( this.belowDnaPolymeraseReturnBounds );
      this.addMobileBiomolecule( rnaPolymerase );
    }
  },

  /**
   * Generate a random, valid, initial location, including the Z dimension.
   * @param {MobileBiomolecule} biomolecule
   * @returns {Vector3}
   * @private
   */
  generateInitialPosition3D: function( biomolecule ) {
    const xMin = this.moleculeMotionBounds.getBounds().minX + biomolecule.bounds.getWidth() / 2;
    const yMin = this.moleculeMotionBounds.getBounds().minY + biomolecule.bounds.getHeight() / 2;
    const xMax = this.moleculeMotionBounds.getBounds().maxX - biomolecule.bounds.getWidth() / 2;
    const yMax = this.moleculeMotionBounds.getBounds().maxY - biomolecule.bounds.getHeight() / 2;
    const xPos = xMin + phet.joist.random.nextDouble() * ( xMax - xMin );
    const yPos = yMin + phet.joist.random.nextDouble() * ( yMax - yMin );
    const zPos = -phet.joist.random.nextDouble(); // Valid z values are from -1 to 0.
    return new Vector3( xPos, yPos, zPos );
  },

  /**
   * @param {TranscriptionFactorConfig} tcConfig
   * @param {number} targetCount
   * @param {Array} transcriptionFactorList
   * @private
   */
  setTranscriptionFactorCount: function( tcConfig, targetCount, transcriptionFactorList ) {
    if ( transcriptionFactorList.length < targetCount ) {
      while ( transcriptionFactorList.length < targetCount ) {
        const transcriptionFactor = new TranscriptionFactor( this, tcConfig, new Vector2( 0, 0 ) );
        transcriptionFactor.setPosition3D( this.generateInitialPosition3D( transcriptionFactor ) );
        transcriptionFactor.set3DMotionEnabled( true );
        this.addMobileBiomolecule( transcriptionFactor );
        transcriptionFactorList.push( transcriptionFactor );
      }
    }
    else if ( transcriptionFactorList.length > targetCount ) {
      while ( transcriptionFactorList.length > targetCount ) {
        const mobileBiomolecule = transcriptionFactorList.pop();
        mobileBiomolecule.forceDetach();
        this.removeMobileBiomolecule( mobileBiomolecule );
      }
    }
  }
}, {

  // statics
  MAX_TRANSCRIPTION_FACTOR_COUNT: MAX_TRANSCRIPTION_FACTOR_COUNT,
  POSITIVE_TRANSCRIPTION_FACTOR_CONFIG: POSITIVE_TRANSCRIPTION_FACTOR_CONFIG,
  NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG: NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG
} );

export default MessengerRnaProductionModel;