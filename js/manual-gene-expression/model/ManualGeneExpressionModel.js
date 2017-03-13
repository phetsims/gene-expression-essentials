// Copyright 2015, University of Colorado Boulder

/**
 * Primary model for the manual gene expression tab. The point (0,0) in model space is at the leftmost edge of the DNA
 * strand, and at the vertical center of the strand.
 *
 * @author Sharfudeen Ashraf
 * @author Mohamed Safi
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var CommonConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/CommonConstants' );
  var DnaMolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/DnaMolecule' );
  var GeneA = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GeneA' );
  var GeneB = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/GeneB' );
  var GeneC = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/GeneC' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var GeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GeneExpressionModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Map = require( 'GENE_EXPRESSION_ESSENTIALS/common/util/Map' );
  var MotionBounds = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionBounds' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var Protein = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/Protein' );
  var ProteinA = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ProteinA' );
  var ProteinB = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ProteinB' );
  var ProteinC = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ProteinC' );
  var Util = require( 'DOT/Util' );

  // constants
  // Stage size for the mobile biomolecules, which is basically the area in which the molecules can move. These are
  // empirically determined such that the molecules don't move off of the screen when looking at a given gene.
  var BIOMOLECULE_STAGE_WIDTH = 10000; // In picometers.
  var BIOMOLECULE_STAGE_HEIGHT = 6000; // In picometers.

  // Size of the DNA strand.
  var NUM_BASE_PAIRS_ON_DNA_STRAND = 2000;

  /**
   * Main constructor for ManualGeneExpressionModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function ManualGeneExpressionModel() {

    // DNA strand, which is where the genes reside, where the polymerase does its transcription, and where a lot of the
    // action takes place. Initialize the DNA molecule.
    this.dnaMolecule = new DnaMolecule(
      this,
      NUM_BASE_PAIRS_ON_DNA_STRAND,
      -NUM_BASE_PAIRS_ON_DNA_STRAND * CommonConstants.DISTANCE_BETWEEN_BASE_PAIRS / 4,
      false
    );
    this.dnaMolecule.addGene( new GeneA( this.dnaMolecule, NUM_BASE_PAIRS_ON_DNA_STRAND / 4 - GeneA.NUM_BASE_PAIRS / 2 ) );
    this.dnaMolecule.addGene( new GeneB( this.dnaMolecule, NUM_BASE_PAIRS_ON_DNA_STRAND / 2 - GeneB.NUM_BASE_PAIRS / 2 ) );
    this.dnaMolecule.addGene( new GeneC( this.dnaMolecule, NUM_BASE_PAIRS_ON_DNA_STRAND * 3 / 4 - GeneC.NUM_BASE_PAIRS / 2 ) );

    // list of mobile biomolecules in the model, excluding mRNA
    this.mobileBiomoleculeList = new ObservableArray();

    // list of mRNA molecules in the sim - These are kept separate because they are treated a bit differently than the
    // other mobile biomolecules.
    this.messengerRnaList = new ObservableArray();

    // The gene that the user is focusing on, other gene activity is suspended.  Start with the 0th gene in the DNA
    // (leftmost). Initialize variables that are dependent upon the DNA.
    this.activeGeneProperty = new Property( this.dnaMolecule.getGenes()[ 0 ] );

    // Properties that keep track of whether the first or last gene is
    // currently active, which means that the user is viewing it.
    //this.isFirstGeneActive = this.activeGeneProperty.get() === this.dnaMolecule.getGenes()[ 0 ];
    //this.isLastGeneActive = this.activeGeneProperty.get() === this.dnaMolecule.getLastGene();

    // List of areas where biomolecules should not be allowed.  These are generally populated by the view in order to
    // keep biomolecules from wandering over the tool boxes and such.
    this.offLimitsMotionSpaces = [];

    // Properties that track how many of the various proteins have been collected.
    GeneExpressionModel.call( this );

    this.proteinACollectedProperty = new Property( 0 );
    this.proteinBCollectedProperty = new Property( 0 );
    this.proteinCCollectedProperty = new Property( 0 );

    // Map of the protein collection count properties to the protein types, used to obtain the count property based on
    // the type of protein.
    this.mapProteinClassToCollectedCount = new Map();
    this.mapProteinClassToCollectedCount.put( 'ProteinA', this.proteinACollectedProperty );
    this.mapProteinClassToCollectedCount.put( 'ProteinB', this.proteinBCollectedProperty );
    this.mapProteinClassToCollectedCount.put( 'ProteinC', this.proteinCCollectedProperty );

    // Rectangle that describes the "protein capture area".  When a protein is dropped by the user over this area, it
    // is considered to be captured.
    this.proteinCaptureArea = new Bounds2( 0, 0, 1, 1 );
  }

  geneExpressionEssentials.register( 'ManualGeneExpressionModel', ManualGeneExpressionModel );

  return inherit( GeneExpressionModel, ManualGeneExpressionModel, {

    /**
     * main step function for this model
     * @param {number} dt
     * @public
     */
    step: function( dt ) {
      if ( dt > 0.2 ) {
        return;
      }
      this.stepInTime( dt );
    },

    stepInTime: function( dt ) {
      this.mobileBiomoleculeList.forEach( function( mobileBiomolecule ) {
        mobileBiomolecule.stepInTime( dt );
      } );

      this.messengerRnaList.forEach( function( messengerRna ) {
        messengerRna.stepInTime( dt );
      } );

      this.dnaMolecule.stepInTime( dt );
    },

    /**
     * @returns {DnaMolecule}
     */
    getDnaMolecule: function() {
      return this.dnaMolecule;
    },

    previousGene: function() {
      this.switchToGeneRelative( -1 );
    },

    nextGene: function() {
      this.switchToGeneRelative( +1 );
    },

    /**
     *
     * @param {Rectangle} newCaptureAreaBounds
     */
    setProteinCaptureArea: function( newCaptureAreaBounds ) {
      this.proteinCaptureArea.set( newCaptureAreaBounds );
    },

    /**
     * @param {string} proteinType
     * @returns {Property}
     */
    getCollectedCounterForProteinType: function( proteinType ) {
      return this.mapProteinClassToCollectedCount.get( proteinType );
    },

    /**
     * @private
     * @param {int} i
     */
    switchToGeneRelative: function( i ) {
      var genes = this.dnaMolecule.getGenes();
      var index = Util.clamp( 0, genes.indexOf( this.activeGeneProperty.get() ) + i, genes.length - 1 );
      this.activeGeneProperty.set( genes[ index ] );
    },

    activateGene: function( i ) {
      this.activeGeneProperty.set( this.dnaMolecule.getGenes()[ i ] );
    },

    /**
     * @param {MobileBiomolecule} mobileBiomolecule
     */
    addMobileBiomolecule: function( mobileBiomolecule ) {
      var self = this;
      self.mobileBiomoleculeList.add( mobileBiomolecule );
      mobileBiomolecule.setMotionBounds( self.getBoundsForActiveGene() );

      // Hook up an observer that will activate and deactivate placement
      // hints for this molecule.
      mobileBiomolecule.userControlledProperty.link( function( isUserControlled, wasUserControlled ) {

        if ( isUserControlled ) {
          self.dnaMolecule.activateHints( mobileBiomolecule );
          self.messengerRnaList.forEach( function( messengerRna ) {
            messengerRna.activateHints( mobileBiomolecule );
          } );
        }
        else {
          self.dnaMolecule.deactivateAllHints();
          self.messengerRnaList.forEach( function( messengerRna ) {
            messengerRna.deactivateAllHints();
          } );

          if ( wasUserControlled ) {
            // The user dropped this biomolecule.
            if ( self.proteinCaptureArea.containsPoint( mobileBiomolecule.getPosition() ) &&
                 mobileBiomolecule instanceof Protein ) {
              // The user has dropped this protein in the
              // capture area.  So, like, capture it.
              self.captureProtein( mobileBiomolecule );
            }
          }
        }
      } );

      // Hook up an observer that will remove this biomolecule from the
      // model if its existence strength reaches zero.
      mobileBiomolecule.existenceStrengthProperty.link( function( existenceStrength ) {
        if ( existenceStrength === 0 ) {
          self.removeMobileBiomolecule( mobileBiomolecule );
          mobileBiomolecule.existenceStrengthProperty.unlink( this );
        }
      } );

    },

    /**
     * Get a list of all mobile biomolecules that overlap with the provided shape.
     *
     * @param {Bounds2} testShapeBounds - Bounds, in model coordinate, to test for overlap.
     * @return {Array} List of molecules that overlap with the provided bounds.
     */
    getOverlappingBiomolecules: function( testShapeBounds ) {

      var overlappingBiomolecules = [];

      this.mobileBiomoleculeList.forEach( function( mobileBiomolecule ) {
        if ( mobileBiomolecule.getShape().bounds.intersectsBounds( testShapeBounds ) ) {

          overlappingBiomolecules.push( mobileBiomolecule );
        }
      } );

      return overlappingBiomolecules;
    },


    /**
     *  Capture the specified protein, which means that it is actually removed from the model and the associated
     *  capture count property is incremented.
     * @param {Protein} protein
     */
    captureProtein: function( protein ) {
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
    },

    /**
     *
     * @param {Function} proteinClassType
     * @returns {number}
     */
    getProteinCount: function( proteinClassType ) {
      var count = 0;
      this.mobileBiomoleculeList.forEach( function( mobileBiomolecule ) {
        if ( mobileBiomolecule instanceof proteinClassType ) {
          count++;
        }
      } );
      return count;
    },

    /**
     * @param {MobileBiomolecule} mobileBiomolecule
     */
    removeMobileBiomolecule: function( mobileBiomolecule ) {
      this.mobileBiomoleculeList.remove( mobileBiomolecule );
    },

    addMessengerRna: function( messengerRna ) {
      this.messengerRnaList.add( messengerRna );
      messengerRna.setMotionBounds( this.getBoundsForActiveGene() );
    },

    removeMessengerRna: function( messengerRnaBeingDestroyed ) {
      this.messengerRnaList.remove( messengerRnaBeingDestroyed );
    },

    getMessengerRnaList: function() {
      return this.messengerRnaList;
    },

    reset: function() {
      this.mobileBiomoleculeList.clear();
      this.messengerRnaList.clear();
      this.dnaMolecule.reset();
      this.proteinACollectedProperty.reset();
      this.proteinBCollectedProperty.reset();
      this.proteinCCollectedProperty.reset();
      this.activateGene( 0 );
    },

    /**
     * Add a space where the biomolecules should not be allowed to wander. This is generally used by the view to prevent
     * biomolecules from moving over tool boxes and such.
     *
     * @param newOffLimitsSpace
     */
    addOffLimitsMotionSpace: function( newOffLimitsSpace ) {
      for ( var i = 0; i < this.offLimitsMotionSpaces.length; i++ ) {

        var offLimitsMotionSpace = this.offLimitsMotionSpaces[ i ];
        if ( offLimitsMotionSpace.equals( newOffLimitsSpace ) ) {
          // An equivalent space already exists, so don't bother adding this one.
          return;
        }
      }
      // Add the new one to the list.
      this.offLimitsMotionSpaces.push( newOffLimitsSpace );
    },

    /**
     * Get the motion bounds for any biomolecule that is going to be associated with the currently active gene.  This is
     * used to keep the biomolecules from wandering outside of the area that the user can see.
     */
    getBoundsForActiveGene: function() {

      // The bottom bounds are intended to be roughly at the bottom of the viewport.  The value was empirically determined.
      var bottomYPos = CommonConstants.DNA_MOLECULE_Y_POS - 2100;

      // Get the nominal bounds for this gene.
      var bounds = new Bounds2( this.activeGeneProperty.get().getCenterX() - BIOMOLECULE_STAGE_WIDTH / 2,
        bottomYPos,
        this.activeGeneProperty.get().getCenterX() - BIOMOLECULE_STAGE_WIDTH / 2 + BIOMOLECULE_STAGE_WIDTH,
        bottomYPos + BIOMOLECULE_STAGE_HEIGHT );

      // Subtract off any off limits areas.
      this.offLimitsMotionSpaces.forEach( function( offLimitMotionSpace ) {
        if ( bounds.intersectsBounds( offLimitMotionSpace ) ) {
          // bounds.subtract( new Area( offLimitMotionSpace ) ); TODO
        }
      } );
      return new MotionBounds( bounds );
    }

  } );
} );