// Copyright 2015, University of Colorado Boulder
/**
 * Primary model for the Messenger RNA Production tab.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );
  var DnaMolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/DnaMolecule' );
  var GeneA = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/GeneA' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );
  var RnaPolymerase = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/RnaPolymerase' );
  var MotionBounds = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionBounds' );
  var CommonConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/CommonConstants' );

  // constants
  // Length, in terms of base pairs, of the DNA molecule.
  var NUM_BASE_PAIRS_ON_DNA_STRAND = 500;

  // Configurations for the transcriptions factors used within this model.
  var POSITIVE_TRANSCRIPTION_FACTOR_CONFIG = TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_POS;
  var NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG = TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_NEG;

  // Maximum number of transcription factor molecules.  The pertains to both positive and negative transcription factors.
  var MAX_TRANSCRIPTION_FACTOR_COUNT = 8;

  // Number of RNA polymerase molecules present.
  var RNA_POLYMERASE_COUNT = 7;

  function MessengerRnaProductionModel() {
    var self = this;
    this.clockRunningProperty = new Property( true );

    // DNA strand, which is where the genes reside, where the polymerase does
    // its transcription, and where a lot of the action takes place.
    this.dnaMolecule = new DnaMolecule( this, NUM_BASE_PAIRS_ON_DNA_STRAND,
      -NUM_BASE_PAIRS_ON_DNA_STRAND * CommonConstants.DISTANCE_BETWEEN_BASE_PAIRS / 2, true );

    // The one gene that is on this DNA strand.
    // Add the gene to the DNA molecule.  There is only one gene in this model.
    this.gene = new GeneA( self.dnaMolecule, Math.round( NUM_BASE_PAIRS_ON_DNA_STRAND * 0.4 ) );
    this.dnaMolecule.addGene( self.gene );

    // List of mobile biomolecules in the model, excluding mRNA.
    this.mobileBiomoleculeList = new ObservableArray();
    this.positiveTranscriptionFactorList = [];
    this.negativeTranscriptionFactorList = [];

    // List of mRNA molecules in the sim.  These are kept separate because they
    // are treated a bit differently than the other mobile biomolecules.
    this.messengerRnaList = new ObservableArray();

    // Properties that control the quantity of transcription factors.
    this.positiveTranscriptionFactorCountProperty = new Property( 0 );
    this.positiveTranscriptionFactorCountProperty.link( function( count ) {
      self.setTranscriptionFactorCount(
        TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_POS,
        count,
        self.positiveTranscriptionFactorList
      );
    } );

    this.negativeTranscriptionFactorCountProperty = new Property( 0 );
    this.negativeTranscriptionFactorCountProperty.link( function( count ) {
      self.setTranscriptionFactorCount(
        TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_NEG,
        count,
        self.negativeTranscriptionFactorList
      );
    } );


    // Motion bounds for the mobile biomolecules.
    this.moleculeMotionBounds = null;
    this.setupMotionBounds();

    // The bounds within which polymerase may be moved when recycled.
    // Set up the area where RNA polymerase goes when it is recycled.
    // This is near the beginning of the transcribed region in order to
    // make transcription more likely to occur.
    var polymeraseSize = new RnaPolymerase().getShape().bounds;
    var firstGene = self.dnaMolecule.getGenes()[ 0 ];
    var recycleZoneCenterX = self.dnaMolecule.getBasePairXOffsetByIndex( firstGene.getTranscribedRegion().min ) +
                             ( phet.joist.random.nextDouble() - 0.5 ) * 2000;
    var recycleZoneHeight = polymeraseSize.getHeight() * 1.2;
    var recycleZoneWidth = polymeraseSize.getWidth() * 4;
    var minX = recycleZoneCenterX - polymeraseSize.getWidth() * 2;
    var minY = CommonConstants.DNA_MOLECULE_Y_POS + polymeraseSize.getHeight();
    this.aboveDnaPolymeraseReturnBounds = new Bounds2( minX,
      minY,
      minX + recycleZoneWidth,
      minY + recycleZoneHeight );
    minY = CommonConstants.DNA_MOLECULE_Y_POS - polymeraseSize.getHeight() - recycleZoneHeight;
    this.belowDnaPolymeraseReturnBounds = new Bounds2( minX,
      minY,
      minX + recycleZoneWidth,
      minY + polymeraseSize.getHeight() * 1.2 );

    // Reset this model in order to set initial state.
    this.reset();

  }

  geneExpressionEssentials.register( 'MessengerRnaProductionModel', MessengerRnaProductionModel );

  return inherit( Object, MessengerRnaProductionModel, {
      // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
      step: function( dt ) {
        if ( dt > 0.2 ) {
          return;
        }

        if ( this.clockRunningProperty.get() ) {
          this.stepInTime( dt );
        }
      },

      stepInTime: function( dt ) {

        // Step all the contained biomolecules.

        this.mobileBiomoleculeList.forEach( function( mobileBiomolecule ) {
          mobileBiomolecule.stepInTime( dt );
        } );
        this.messengerRnaList.forEach( function( messengerRna ) {
          messengerRna.stepInTime( dt );
        } );


        this.dnaMolecule.stepInTime( dt );
      },

      setupMotionBounds: function() {

        // The bottom of the bounds, based off center point of the DNA
        // molecule.  Offset was empirically determined.
        var minY = CommonConstants.DNA_MOLECULE_Y_POS - 1200;

        // The max Y position is set to make it so that molecules can move
        // outside of the view port, but not way outside.  Its value was
        // empirically determined.
        var maxY = CommonConstants.DNA_MOLECULE_Y_POS + 1100;

        // Figure out the X bounds based on the length of the gene.  This
        // extends a little less in the -x direction than in the +x, since the
        // beginning of the gene is in the center of the view port.
        var minX = this.gene.getStartX() - 1300;
        var maxX = this.gene.getEndX() + 400; // Needs to be long enough to allow the polymerase to get to the end.

        // Create the nominal rectangular bounds.
        var bounds = new Bounds2( minX, minY, maxX, maxY );
        //this.moleculeMotionBounds = bounds;
        this.moleculeMotionBounds = new MotionBounds( bounds );

      },

      /**
       *
       * @returns {DnaMolecule}
       * @public
       */
      getDnaMolecule: function() {
        return this.dnaMolecule;
      },

      /**
       * @param {MobileBiomolecule} mobileBiomolecule
       */
      addMobileBiomolecule: function( mobileBiomolecule ) {
        var self = this;
        self.mobileBiomoleculeList.add( mobileBiomolecule );

        // Set the motion bounds such that the molecules move around above and
        // on top of the DNA.
        mobileBiomolecule.setMotionBounds( self.moleculeMotionBounds );

        // Hook up an observer that will activate and deactivate placement
        // hints for this molecule.
        mobileBiomolecule.userControlledProperty.link( function( isUserControlled, wasUserControlled ) {
          if ( isUserControlled ) {
            self.dnaMolecule.activateHints( mobileBiomolecule );
          }
          else {
            self.dnaMolecule.deactivateAllHints();
          }
        } );


        // Hook up an observer that will remove this biomolecule from the
        // model if its existence strength reaches zero.
        mobileBiomolecule.existenceStrengthProperty.link( function existenceObserver( existenceStrength ) {
          if ( existenceStrength === 0 ) {
            self.removeMobileBiomolecule( mobileBiomolecule );
            mobileBiomolecule.existenceStrengthProperty.unlink( existenceObserver );
          }
        } );

      },

      /**
       * Get a list of all mobile biomolecules that overlap with the provided
       * shape.
       *
       * @param {Shape} testShape - Shape, in model coordinate, to test for overlap.
       * @return {Array} List of molecules that overlap with the provided shape.
       */
      getOverlappingBiomolecules: function( testShape ) {

        var overlappingBiomolecules = [];

        // Since it is computationally expensive to test overlap with every
        // shape, we do a fast bounds test first, and then the more expensive
        // test when necessary.
        var testShapeBounds = testShape.bounds;
        this.mobileBiomoleculeList.forEach( function( mobileBiomolecule ) {
          var mobileBioMoleculeShape = mobileBiomolecule.getShape();
          if ( mobileBioMoleculeShape.bounds.intersectsBounds( testShapeBounds ) ) {

            overlappingBiomolecules.push( mobileBiomolecule );
          }
        } );

        return overlappingBiomolecules;
      },

      /**
       * @param {MobileBiomolecule} mobileBiomolecule
       */
      removeMobileBiomolecule: function( mobileBiomolecule ) {
        this.mobileBiomoleculeList.remove( mobileBiomolecule );
      },

      /**
       * @param {MessengerRna} messengerRna
       */
      addMessengerRna: function( messengerRna ) {

        var self = this;
        self.messengerRnaList.push( messengerRna );

        // Since this will never be translated in this model, make it fade
        // away once it is formed.
        messengerRna.setFadeAwayWhenFormed( true );

        // Remove this from the model once its existence strength reaches
        // zero, which it will do since it is fading out.
        messengerRna.existenceStrengthProperty.link( function( existenceStrength ) {
          if ( existenceStrength <= 0 ) {
            // It's "gone", so remove it from the model.
            self.messengerRnaList.remove( messengerRna );
            messengerRna.existenceStrengthProperty.unlink( self );
          }
        } );

      },

      /**
       * @param {MessengerRna} messengerRnaBeingDestroyed
       */
      removeMessengerRna: function( messengerRnaBeingDestroyed ) {
        this.messengerRnaList.remove( messengerRnaBeingDestroyed );
      },

      /**
       * @returns {Array}
       */
      getMessengerRnaList: function() {
        return this.messengerRnaList;
      },

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

        // Add the polymerase molecules.  These don't come and go, the
        // concentration of these remains constant in this model.
        for ( var i = 0; i < RNA_POLYMERASE_COUNT; i++ ) {
          var rnaPolymerase = new RnaPolymerase( this, new Vector2( 0, 0 ) );
          rnaPolymerase.setPosition3D( this.generateInitialLocation3D( rnaPolymerase ) );
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
       * @returns {e.Vector3}
       */
      generateInitialLocation3D: function( biomolecule ) {
        var xMin = this.moleculeMotionBounds.getBounds().minX + biomolecule.getShape().bounds.getWidth() / 2;
        var yMin = this.moleculeMotionBounds.getBounds().minY + biomolecule.getShape().bounds.getHeight() / 2;
        var xMax = this.moleculeMotionBounds.getBounds().maxX - biomolecule.getShape().bounds.getWidth() / 2;
        var yMax = this.moleculeMotionBounds.getBounds().maxY - biomolecule.getShape().bounds.getHeight() / 2;
        var xPos = xMin + phet.joist.random.nextDouble() * ( xMax - xMin );
        var yPos = yMin + phet.joist.random.nextDouble() * ( yMax - yMin );
        var zPos = -phet.joist.random.nextDouble(); // Valid z values are from -1 to 0.
        return new Vector3( xPos, yPos, zPos );
      },

      /**
       * @param {TranscriptionFactorConfig} tcConfig
       * @param {number} targetCount
       * @param {Array} transcriptionFactorList
       */
      setTranscriptionFactorCount: function( tcConfig, targetCount, transcriptionFactorList ) {

        if ( transcriptionFactorList.length < targetCount ) {
          while ( transcriptionFactorList.length < targetCount ) {
            var transcriptionFactor = new TranscriptionFactor( this, tcConfig, new Vector2( 0, 0 ) );
            transcriptionFactor.setPosition3D( this.generateInitialLocation3D( transcriptionFactor ) );
            transcriptionFactor.set3DMotionEnabled( true );
            this.addMobileBiomolecule( transcriptionFactor );
            transcriptionFactorList.push( transcriptionFactor );
          }
        }
        else if ( transcriptionFactorList.length > targetCount ) {
          while ( transcriptionFactorList.length > targetCount ) {
            var mobileBiomolecule = transcriptionFactorList.pop();
            mobileBiomolecule.forceDetach();
            this.removeMobileBiomolecule( mobileBiomolecule );
          }
        }
      }
    },
    {
      MAX_TRANSCRIPTION_FACTOR_COUNT: MAX_TRANSCRIPTION_FACTOR_COUNT,
      POSITIVE_TRANSCRIPTION_FACTOR_CONFIG: POSITIVE_TRANSCRIPTION_FACTOR_CONFIG,
      NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG: NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG
    } );
} );
