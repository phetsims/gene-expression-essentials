//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Primary model for the Messenger RNA Production tab.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_BASICS/common/model/TranscriptionFactor' );
  var Random = require( 'DOT/Random' );
  var DnaMolecule = require( 'GENE_EXPRESSION_BASICS/common/model/DnaMolecule' );
  var GeneA = require( 'GENE_EXPRESSION_BASICS/common/model/GeneA' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );
  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'DOT/Rectangle' );
  var ConstantDtClock = require( 'GENE_EXPRESSION_BASICS/common/model/ConstantDtClock' );
  var RnaPolymerase = require( 'GENE_EXPRESSION_BASICS/common/model/RnaPolymerase' );
  var MotionBounds = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/MotionBounds' );
  var CommonConstants = require( 'GENE_EXPRESSION_BASICS/common/model/CommonConstants' );

  // constants
  // Length, in terms of base pairs, of the DNA molecule.
  var NUM_BASE_PAIRS_ON_DNA_STRAND = 500;

  // Configurations for the transcriptions factors used within this model.
  var POSITIVE_TRANSCRIPTION_FACTOR_CONFIG = TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_POS;
  var NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG = TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_NEG;

  // Maximum number of transcription factor molecules.  The pertains to both
  // positive and negative transcription factors.
  var MAX_TRANSCRIPTION_FACTOR_COUNT = 8;

  // Number of RNA polymerase molecules present.
  var RNA_POLYMERASE_COUNT = 7;

  // etc.
  var RAND = new Random();

  function MessengerRnaProductionModel() {
    var self = this;

    // DNA strand, which is where the genes reside, where the polymerase does
    // its transcription, and where a lot of the action takes place.
    self.dnaMolecule = new DnaMolecule( self, NUM_BASE_PAIRS_ON_DNA_STRAND,
      -NUM_BASE_PAIRS_ON_DNA_STRAND * CommonConstants.DISTANCE_BETWEEN_BASE_PAIRS / 2, true );

    // The one gene that is on this DNA strand.
    // Add the gene to the DNA molecule.  There is only one gene in this model.
    self.gene = new GeneA( self.dnaMolecule, Math.round( NUM_BASE_PAIRS_ON_DNA_STRAND * 0.45 ) );
    self.dnaMolecule.addGene( self.gene );

    // List of mobile biomolecules in the model, excluding mRNA.
    self.mobileBiomoleculeList = new ObservableArray();

    // List of mRNA molecules in the sim.  These are kept separate because they
    // are treated a bit differently than the other mobile biomolecules.
    self.messengerRnaList = new ObservableArray();

    // Properties that control the quantity of transcription factors.
    self.positiveTranscriptionFactorCount = new Property( 0 );
    self.positiveTranscriptionFactorCount.link( function( count ) {
      self.setTranscriptionFactorCount( TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_POS, count );
    } );

    self.negativeTranscriptionFactorCount = new Property( 0 );
    self.negativeTranscriptionFactorCount.link( function( count ) {
      self.setTranscriptionFactorCount( TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_NEG, count );

    } );


    // Motion bounds for the mobile biomolecules.
    this.moleculeMotionBounds = null;
    this.setupMotionBounds();

    // Clock that drives all time-dependent behavior in this model.
    self.clock = new ConstantDtClock( 30.0 );

    // The bounds within which polymerase may be moved when recycled.
    // Set up the area where RNA polymerase goes when it is recycled.
    // This is near the beginning of the transcribed region in order to
    // make transcription more likely to occur.
    var polymeraseSize = new RnaPolymerase().getShape().bounds;
    var firstGene = self.dnaMolecule.getGenes()[ 0 ];
    var recycleZoneCenterX = self.dnaMolecule.getBasePairXOffsetByIndex( firstGene.getTranscribedRegion().getMin() ) + ( RAND.nextDouble() - 0.5 ) * 2000;
    var recycleZoneHeight = polymeraseSize.getHeight() * 1.2;
    var recycleZoneWidth = polymeraseSize.getWidth() * 4;
    this.aboveDnaPolymeraseReturnBounds = new Rectangle( recycleZoneCenterX - polymeraseSize.getWidth() * 2,
      DnaMolecule.Y_POS + polymeraseSize.getHeight(),
      recycleZoneWidth,
      recycleZoneHeight );
    this.belowDnaPolymeraseReturnBounds = new Rectangle( recycleZoneCenterX - polymeraseSize.getWidth() * 2,
      DnaMolecule.Y_POS - polymeraseSize.getHeight() - recycleZoneHeight,
      recycleZoneWidth,
      polymeraseSize.getHeight() * 1.2 );

    // Reset this model in order to set initial state.
    this.reset();

  }

  return inherit( Object, MessengerRnaProductionModel, {

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
        var shape = Shape.rectangle( minX, minY, maxX - minX, maxY - minY );
        //this.moleculeMotionBounds = bounds;
        this.moleculeMotionBounds = new MotionBounds( shape );

      },

      /**
       *
       * @returns {ConstantDtClock}
       */
      getClock: function() {
        return this.clock;
      },

      /**
       *
       * @returns {DnaMolecule}
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
          if ( mobileBioMoleculeShape.bounds.intersects( testShapeBounds ) ) {

            // Bounds overlap, see if actual shapes overlap.
            //var testShapeArea = new Area( testShape );
            //var biomoleculeArea = new Area( mobileBiomolecule.getShape() );
            //biomoleculeArea.intersect( testShapeArea );
            var intersectedShape = mobileBioMoleculeShape.bounds.intersection( testShapeBounds );

            if ( !intersectedShape.isEmpty() ) {

              // The biomolecule overlaps with the test shape, so add it
              // to the list.
              overlappingBiomolecules.push( mobileBiomolecule );
            }
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
        this.positiveTranscriptionFactorCount.reset();
        this.negativeTranscriptionFactorCount.reset();
        this.mobileBiomoleculeList.clear();
        this.messengerRnaList.clear();
        this.dnaMolecule.reset();
        this.gene.getPolymeraseAffinityProperty().reset();
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
       * @param {number} dt
       */
      stepInTime: function( dt ) { // TODO step or stepInTime

        // Step all the contained biomolecules.

        this.mobileBiomoleculeList.forEach( function( mobileBiomolecule ) {
          mobileBiomolecule.stepInTime( dt );
        } );
        this.messengerRnaList.forEach( function( messengerRna ) {
          messengerRna.stepInTime( dt );
        } );


        this.dnaMolecule.stepInTime( dt );
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
        var xPos = xMin + RAND.nextDouble() * ( xMax - xMin );
        var yPos = yMin + RAND.nextDouble() * ( yMax - yMin );
        var zPos = -RAND.nextDouble(); // Valid z values are from -1 to 0.
        return new Vector3( xPos, yPos, zPos );
      },

      /**
       * @param {TranscriptionFactorConfig} tcConfig
       * @param {number} targetCount
       */
      setTranscriptionFactorCount: function( tcConfig, targetCount ) {
        var self = this;

        // Count the transcription factors that match this configuration.
        var currentLevel = 0;
        self.mobileBiomoleculeList.forEach( function( mobileBiomolecule ) {
          if ( mobileBiomolecule instanceof TranscriptionFactor && mobileBiomolecule.getConfig() === tcConfig ) {
            currentLevel++;
          }
        } );

        if ( targetCount > currentLevel ) {
          // Add some.
          for ( var i = currentLevel; i < targetCount; i++ ) {
            var transcriptionFactor = new TranscriptionFactor( self, tcConfig, new Vector2( 0, 0 ) );
            transcriptionFactor.setPosition3D( self.generateInitialLocation3D( transcriptionFactor ) );
            transcriptionFactor.set3DMotionEnabled( true );
            self.addMobileBiomolecule( transcriptionFactor );
          }
        }
        else if ( targetCount < currentLevel ) {
          // Remove some.
          self.mobileBiomoleculeList.forEach( function( mobileBiomolecule ) {
            if ( mobileBiomolecule instanceof TranscriptionFactor ) {
              if ( mobileBiomolecule.getConfig() === tcConfig ) { // TODO equal
                // Remove this one.
                mobileBiomolecule.forceDetach();
                self.removeMobileBiomolecule( mobileBiomolecule );
                currentLevel--;
                if ( currentLevel === targetCount ) {
                  return false;
                }
              }
            }
          } );

        }


      }


    },

    {

      MAX_TRANSCRIPTION_FACTOR_COUNT: MAX_TRANSCRIPTION_FACTOR_COUNT,
      POSITIVE_TRANSCRIPTION_FACTOR_CONFIG: POSITIVE_TRANSCRIPTION_FACTOR_CONFIG,
      NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG: NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG

    } );


} );

//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.geneexpressionbasics.mrnaproduction.model;
//
//import java.awt.Shape;
//import java.awt.geom.Area;
//import java.awt.geom.Rectangle2D;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Random;
//
//import edu.colorado.phet.common.phetcommon.math.Point3D;
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.Resettable;
//import edu.colorado.phet.common.phetcommon.model.clock.ClockAdapter;
//import edu.colorado.phet.common.phetcommon.model.clock.ClockEvent;
//import edu.colorado.phet.common.phetcommon.model.clock.ConstantDtClock;
//import edu.colorado.phet.common.phetcommon.model.property.ChangeObserver;
//import edu.colorado.phet.common.phetcommon.model.property.integerproperty.IntegerProperty;
//import edu.colorado.phet.common.phetcommon.util.ObservableList;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.geneexpressionbasics.common.model.DnaMolecule;
//import edu.colorado.phet.geneexpressionbasics.common.model.Gene;
//import edu.colorado.phet.geneexpressionbasics.common.model.GeneA;
//import edu.colorado.phet.geneexpressionbasics.common.model.GeneExpressionModel;
//import edu.colorado.phet.geneexpressionbasics.common.model.MessengerRna;
//import edu.colorado.phet.geneexpressionbasics.common.model.MobileBiomolecule;
//import edu.colorado.phet.geneexpressionbasics.common.model.RnaPolymerase;
//import edu.colorado.phet.geneexpressionbasics.common.model.TranscriptionFactor;
//import edu.colorado.phet.geneexpressionbasics.common.model.TranscriptionFactor.TranscriptionFactorConfig;
//import edu.colorado.phet.geneexpressionbasics.common.model.motionstrategies.MotionBounds;
//
///**
// * Primary model for the Messenger RNA Production tab.
// *
// * @author John Blanco
// */
//public class MessengerRnaProductionModel extends GeneExpressionModel implements Resettable {
//
//    //------------------------------------------------------------------------
//    // Class Data
//    //------------------------------------------------------------------------
//
//    // Length, in terms of base pairs, of the DNA molecule.
//    private static final int NUM_BASE_PAIRS_ON_DNA_STRAND = 500;
//
//    // Configurations for the transcriptions factors used within this model.
//    public static final TranscriptionFactorConfig POSITIVE_TRANSCRIPTION_FACTOR_CONFIG = TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_POS;
//    public static final TranscriptionFactorConfig NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG = TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_NEG;
//
//    // Maximum number of transcription factor molecules.  The pertains to both
//    // positive and negative transcription factors.
//    public static final int MAX_TRANSCRIPTION_FACTOR_COUNT = 8;
//
//    // Number of RNA polymerase molecules present.
//    private static final int RNA_POLYMERASE_COUNT = 7;
//
//    // etc.
//    private static final Random RAND = new Random();
//
//    //------------------------------------------------------------------------
//    // Instance Data
//    //------------------------------------------------------------------------
//
//    // DNA strand, which is where the genes reside, where the polymerase does
//    // its transcription, and where a lot of the action takes place.
//    private final DnaMolecule dnaMolecule = new DnaMolecule( this,
//                                                             NUM_BASE_PAIRS_ON_DNA_STRAND,
//                                                             -NUM_BASE_PAIRS_ON_DNA_STRAND * DnaMolecule.DISTANCE_BETWEEN_BASE_PAIRS / 2,
//                                                             true );
//
//    // The one gene that is on this DNA strand.
//    private final Gene gene;
//
//    // List of mobile biomolecules in the model, excluding mRNA.
//    public final ObservableList<MobileBiomolecule> mobileBiomoleculeList = new ObservableList<MobileBiomolecule>();
//
//    // List of mRNA molecules in the sim.  These are kept separate because they
//    // are treated a bit differently than the other mobile biomolecules.
//    public final ObservableList<MessengerRna> messengerRnaList = new ObservableList<MessengerRna>();
//
//    // Properties that control the quantity of transcription factors.
//    public final IntegerProperty positiveTranscriptionFactorCount = new IntegerProperty( 0 ) {{
//        addObserver( new VoidFunction1<Integer>() {
//            public void apply( Integer count ) {
//                setTranscriptionFactorCount( TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_POS, count );
//            }
//        } );
//    }};
//
//    public final IntegerProperty negativeTranscriptionFactorCount = new IntegerProperty( 0 ) {{
//        addObserver( new VoidFunction1<Integer>() {
//            public void apply( Integer count ) {
//                setTranscriptionFactorCount( TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_NEG, count );
//            }
//        } );
//    }};
//
//    // Motion bounds for the mobile biomolecules.
//    public final MotionBounds moleculeMotionBounds;
//
//    // Clock that drives all time-dependent behavior in this model.
//    private final ConstantDtClock clock = new ConstantDtClock( 30.0 );
//
//    // The bounds within which polymerase may be moved when recycled.
//    private final Rectangle2D aboveDnaPolymeraseReturnBounds;
//    private final Rectangle2D belowDnaPolymeraseReturnBounds;
//
//    //------------------------------------------------------------------------
//    // Constructor
//    //------------------------------------------------------------------------
//
//    public MessengerRnaProductionModel() {
//
//        // Hook up the clock.
//        clock.addClockListener( new ClockAdapter() {
//            @Override public void clockTicked( ClockEvent clockEvent ) {
//                stepInTime( clockEvent.getSimulationTimeChange() );
//            }
//        } );
//
//        // Add the gene to the DNA molecule.  There is only one gene in this model.
//        gene = new GeneA( dnaMolecule, (int) Math.round( NUM_BASE_PAIRS_ON_DNA_STRAND * 0.45 ) );
//        dnaMolecule.addGene( gene );
//
//        // Set up the motion bounds for the biomolecules.
//        {
//            // The bottom of the bounds, based off center point of the DNA
//            // molecule.  Offset was empirically determined.
//            double minY = DnaMolecule.Y_POS - 1200;
//
//            // The max Y position is set to make it so that molecules can move
//            // outside of the view port, but not way outside.  Its value was
//            // empirically determined.
//            double maxY = DnaMolecule.Y_POS + 1100;
//
//            // Figure out the X bounds based on the length of the gene.  This
//            // extends a little less in the -x direction than in the +x, since the
//            // beginning of the gene is in the center of the view port.
//            double minX = gene.getStartX() - 1300;
//            double maxX = gene.getEndX() + 400; // Needs to be long enough to allow the polymerase to get to the end.
//
//            // Create the nominal rectangular bounds.
//            Area bounds = new Area( new Rectangle2D.Double( minX, minY, maxX - minX, maxY - minY ) );
//
//            moleculeMotionBounds = new MotionBounds( bounds );
//        }
//
//        // Set up the area where RNA polymerase goes when it is recycled.
//        // This is near the beginning of the transcribed region in order to
//        // make transcription more likely to occur.
//        Rectangle2D polymeraseSize = new RnaPolymerase().getShape().getBounds2D();
//        double recycleZoneCenterX = dnaMolecule.getBasePairXOffsetByIndex( dnaMolecule.getGenes().get( 0 ).getTranscribedRegion().getMin() ) + ( RAND.nextDouble() - 0.5 ) * 2000;
//        double recycleZoneHeight = polymeraseSize.getHeight() * 1.2;
//        double recycleZoneWidth = polymeraseSize.getWidth() * 4;
//        aboveDnaPolymeraseReturnBounds = new Rectangle2D.Double( recycleZoneCenterX - polymeraseSize.getWidth() * 2,
//                                                                 DnaMolecule.Y_POS + polymeraseSize.getHeight(),
//                                                                 recycleZoneWidth,
//                                                                 recycleZoneHeight );
//        belowDnaPolymeraseReturnBounds = new Rectangle2D.Double( recycleZoneCenterX - polymeraseSize.getWidth() * 2,
//                                                                 DnaMolecule.Y_POS - polymeraseSize.getHeight() - recycleZoneHeight,
//                                                                 recycleZoneWidth,
//                                                                 polymeraseSize.getHeight() * 1.2 );
//
//        // Reset this model in order to set initial state.
//        reset();
//    }
//
//    //------------------------------------------------------------------------
//    // Methods
//    //------------------------------------------------------------------------
//
//    public ConstantDtClock getClock() {
//        return clock;
//    }
//
//    public DnaMolecule getDnaMolecule() {
//        return dnaMolecule;
//    }
//
//    public void addMobileBiomolecule( final MobileBiomolecule mobileBiomolecule ) {
//        mobileBiomoleculeList.add( mobileBiomolecule );
//
//        // Set the motion bounds such that the molecules move around above and
//        // on top of the DNA.
//        mobileBiomolecule.setMotionBounds( moleculeMotionBounds );
//
//        // Hook up an observer that will activate and deactivate placement
//        // hints for this molecule.
//        mobileBiomolecule.userControlled.addObserver( new ChangeObserver<Boolean>() {
//            public void update( Boolean isUserControlled, Boolean wasUserControlled ) {
//                if ( isUserControlled ) {
//                    dnaMolecule.activateHints( mobileBiomolecule );
//                }
//                else {
//                    dnaMolecule.deactivateAllHints();
//                }
//            }
//        } );
//
//        // Hook up an observer that will remove this biomolecule from the
//        // model if its existence strength reaches zero.
//        mobileBiomolecule.existenceStrength.addObserver( new VoidFunction1<Double>() {
//            public void apply( Double existenceStrength ) {
//                if ( existenceStrength == 0 ) {
//                    removeMobileBiomolecule( mobileBiomolecule );
//                    mobileBiomolecule.existenceStrength.removeObserver( this );
//                }
//            }
//        } );
//    }
//
//    /**
//     * Get a list of all mobile biomolecules that overlap with the provided
//     * shape.
//     *
//     * @param testShape - Shape, in model coordinate, to test for overlap.
//     * @return List of molecules that overlap with the provided shape.
//     */
//    public List<MobileBiomolecule> getOverlappingBiomolecules( Shape testShape ) {
//
//        List<MobileBiomolecule> overlappingBiomolecules = new ArrayList<MobileBiomolecule>();
//
//        // Since it is computationally expensive to test overlap with every
//        // shape, we do a fast bounds test first, and then the more expensive
//        // test when necessary.
//        Rectangle2D testShapeBounds = testShape.getBounds2D();
//        for ( MobileBiomolecule mobileBiomolecule : mobileBiomoleculeList ) {
//            if ( mobileBiomolecule.getShape().getBounds2D().intersects( testShapeBounds ) ) {
//                // Bounds overlap, see if actual shapes overlap.
//                Area testShapeArea = new Area( testShape );
//                Area biomoleculeArea = new Area( mobileBiomolecule.getShape() );
//                biomoleculeArea.intersect( testShapeArea );
//                if ( !biomoleculeArea.isEmpty() ) {
//                    // The biomolecule overlaps with the test shape, so add it
//                    // to the list.
//                    overlappingBiomolecules.add( mobileBiomolecule );
//                }
//            }
//        }
//
//        return overlappingBiomolecules;
//    }
//
//    public void removeMobileBiomolecule( MobileBiomolecule mobileBiomolecule ) {
//        mobileBiomoleculeList.remove( mobileBiomolecule );
//    }
//
//    public void addMessengerRna( final MessengerRna messengerRna ) {
//
//        messengerRnaList.add( messengerRna );
//
//        // Since this will never be translated in this model, make it fade
//        // away once it is formed.
//        messengerRna.setFadeAwayWhenFormed( true );
//
//        // Remove this from the model once its existence strength reaches
//        // zero, which it will do since it is fading out.
//        messengerRna.existenceStrength.addObserver( new VoidFunction1<Double>() {
//            public void apply( Double existenceStrength ) {
//                if ( existenceStrength <= 0 ) {
//                    // It's "gone", so remove it from the model.
//                    messengerRnaList.remove( messengerRna );
//                    messengerRna.existenceStrength.removeObserver( this );
//                }
//            }
//        } );
//    }
//
//    @Override public void removeMessengerRna( MessengerRna messengerRnaBeingDestroyed ) {
//        messengerRnaList.remove( messengerRnaBeingDestroyed );
//    }
//
//    @Override public List<MessengerRna> getMessengerRnaList() {
//        return messengerRnaList;
//    }
//
//    public void reset() {
//        positiveTranscriptionFactorCount.reset();
//        negativeTranscriptionFactorCount.reset();
//        mobileBiomoleculeList.clear();
//        messengerRnaList.clear();
//        dnaMolecule.reset();
//        gene.getPolymeraseAffinityProperty().reset();
//        gene.getTranscriptionFactorAffinityProperty( POSITIVE_TRANSCRIPTION_FACTOR_CONFIG ).reset();
//        gene.getTranscriptionFactorAffinityProperty( NEGATIVE_TRANSCRIPTION_FACTOR_CONFIG ).reset();
//
//        // Add the polymerase molecules.  These don't come and go, the
//        // concentration of these remains constant in this model.
//        for ( int i = 0; i < RNA_POLYMERASE_COUNT; i++ ) {
//            RnaPolymerase rnaPolymerase = new RnaPolymerase( this, new Vector2D( 0, 0 ) );
//            rnaPolymerase.setPosition3D( generateInitialLocation3D( rnaPolymerase ) );
//            rnaPolymerase.set3DMotionEnabled( true );
//            rnaPolymerase.setRecycleMode( true );
//            rnaPolymerase.addRecycleReturnZone( aboveDnaPolymeraseReturnBounds );
//            rnaPolymerase.addRecycleReturnZone( belowDnaPolymeraseReturnBounds );
//            addMobileBiomolecule( rnaPolymerase );
//        }
//    }
//
//    private void stepInTime( double dt ) {
//
//        // Step all the contained biomolecules.
//        for ( MobileBiomolecule mobileBiomolecule : new ArrayList<MobileBiomolecule>( mobileBiomoleculeList ) ) {
//            mobileBiomolecule.stepInTime( dt );
//        }
//        for ( MessengerRna messengerRna : new ArrayList<MessengerRna>( messengerRnaList ) ) {
//            messengerRna.stepInTime( dt );
//        }
//        dnaMolecule.stepInTime( dt );
//    }
//
//    // Generate a random, valid, initial location, including the Z dimension.
//    private Point3D generateInitialLocation3D( MobileBiomolecule biomolecule ) {
//        double xMin = moleculeMotionBounds.getBounds().getBounds2D().getMinX() + biomolecule.getShape().getBounds2D().getWidth() / 2;
//        double yMin = moleculeMotionBounds.getBounds().getBounds2D().getMinY() + biomolecule.getShape().getBounds2D().getHeight() / 2;
//        double xMax = moleculeMotionBounds.getBounds().getBounds2D().getMaxX() - biomolecule.getShape().getBounds2D().getWidth() / 2;
//        double yMax = moleculeMotionBounds.getBounds().getBounds2D().getMaxY() - biomolecule.getShape().getBounds2D().getHeight() / 2;
//        double xPos = xMin + RAND.nextDouble() * ( xMax - xMin );
//        double yPos = yMin + RAND.nextDouble() * ( yMax - yMin );
//        double zPos = -RAND.nextDouble(); // Valid z values are from -1 to 0.
//        return new Point3D.Double( xPos, yPos, zPos );
//    }
//
//    private void setTranscriptionFactorCount( TranscriptionFactorConfig tcConfig, int targetCount ) {
//        // Count the transcription factors that match this configuration.
//        int currentLevel = 0;
//        for ( MobileBiomolecule mobileBiomolecule : mobileBiomoleculeList ) {
//            if ( mobileBiomolecule instanceof TranscriptionFactor && ( (TranscriptionFactor) mobileBiomolecule ).getConfig().equals( tcConfig ) ) {
//                currentLevel++;
//            }
//        }
//
//        if ( targetCount > currentLevel ) {
//            // Add some.
//            for ( int i = currentLevel; i < targetCount; i++ ) {
//                TranscriptionFactor transcriptionFactor = new TranscriptionFactor( this, tcConfig, new Vector2D( 0, 0 ) );
//                transcriptionFactor.setPosition3D( generateInitialLocation3D( transcriptionFactor ) );
//                transcriptionFactor.set3DMotionEnabled( true );
//                addMobileBiomolecule( transcriptionFactor );
//            }
//        }
//        else if ( targetCount < currentLevel ) {
//            // Remove some.
//            for ( MobileBiomolecule mobileBiomolecule : new ArrayList<MobileBiomolecule>( mobileBiomoleculeList ) ) {
//                if ( mobileBiomolecule instanceof TranscriptionFactor ) {
//                    if ( ( (TranscriptionFactor) mobileBiomolecule ).getConfig().equals( tcConfig ) ) {
//                        // Remove this one.
//                        mobileBiomolecule.forceDetach();
//                        removeMobileBiomolecule( mobileBiomolecule );
//                        currentLevel--;
//                        if ( currentLevel == targetCount ) {
//                            break;
//                        }
//                    }
//                }
//            }
//        }
//    }
//}
