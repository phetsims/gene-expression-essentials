// Copyright 2015, University of Colorado Boulder
/**
 * This class is the model representation of a gene on a DNA molecule. It consists of a regulatory region and a
 * transcribed region, and it keeps track of where the transcription factors and polymerase attaches, and how strong the
 * affinities are for attachment. In real life, a gene is just a collection of base pairs on the DNA strand.
 *
 * @author John Blanco
 * @author Sam Reid
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var CommonConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/CommonConstants' );
  var Map = require( 'GENE_EXPRESSION_ESSENTIALS/common/util/Map' );
  var PlacementHint = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/PlacementHint' );
  var RnaPolymerase = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/RnaPolymerase' );
  var AttachmentSite = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/AttachmentSite' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactor' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/StubGeneExpressionModel' );
  var TranscriptionFactorPlacementHint = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactorPlacementHint' );
  var TranscriptionFactorAttachmentSite = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/TranscriptionFactorAttachmentSite' );

  /**
   *
   * @param {DnaMolecule} dnaMolecule - The DNA molecule within which this gene exists.
   * @param {Range} regulatoryRegion - The range, in terms of base pairs on the DNA strand, where this region exists.
   * @param {Color} regulatoryRegionColor
   * @param {Range} transcribedRegion - The range, in terms of base pairs on the DNA strand, where this region exists.
   * @param {Color} transcribedRegionColor
   * @constructor
   */
  function Gene( dnaMolecule, regulatoryRegion, regulatoryRegionColor, transcribedRegion, transcribedRegionColor ) {
    this.dnaMolecule = dnaMolecule;//private
    this.regulatoryRegion = regulatoryRegion; //private
    this.regulatoryRegionColor = regulatoryRegionColor; //private
    this.transcribedRegion = transcribedRegion; //private
    this.transcribedRegionColor = transcribedRegionColor;//private


    // Create the attachment site for polymerase. It is always at the end of the regulatory region.
    this.polymeraseAttachmentSite = new AttachmentSite( new Vector2(
      dnaMolecule.getBasePairXOffsetByIndex( regulatoryRegion.max ), CommonConstants.DNA_MOLECULE_Y_POS ), 1 );

    // Placement hint for polymerase. There is always only one.
    this.rnaPolymerasePlacementHint = new PlacementHint( new RnaPolymerase() );

    // Placement hints for transcription factors.
    this.transcriptionFactorPlacementHints = [];

    // Attachment sites for transcription factors.
    this.transcriptionFactorAttachmentSites = [];

    // Map of transcription factors that interact with this gene to the location, in terms of base pair offset, where
    // the TF attaches.
    this.transcriptionFactorMap = new Map();

    // Property that determines the affinity of the site where polymerase attaches when the transcription factors support
    // transcription.
    this.polymeraseAffinityProperty = new Property( 1.0 );

    // Initialize the placement hint for polymerase.
    this.rnaPolymerasePlacementHint.setPosition( this.polymeraseAttachmentSite.locationProperty.get() );
  }

  geneExpressionEssentials.register( 'Gene', Gene );

  return inherit( Object, Gene, {

    /**
     *
     * @returns {Color}
     */
    getRegulatoryRegionColor: function() {
      return this.regulatoryRegionColor;
    },

    /**
     *
     * @returns {Color}
     */
    getTranscribedRegionColor: function() {
      return this.transcribedRegionColor;
    },

    /**
     * @returns {number}
     */
    getCenterX: function() {
      return this.getStartX() + ( this.getEndX() - this.getStartX() ) / 2;
    },

    /**
     *
     * @returns {number}
     */
    getStartX: function() {
      return this.dnaMolecule.getBasePairXOffsetByIndex( this.regulatoryRegion.min );
    },

    /**
     *
     * @returns {number}
     */
    getEndX: function() {
      return this.dnaMolecule.getBasePairXOffsetByIndex( this.transcribedRegion.max );
    },

    /**
     *
     * @returns {Range}
     */
    getRegulatoryRegion: function() {
      return this.regulatoryRegion;
    },

    /**
     *
     * @returns {Range|*}
     */
    getTranscribedRegion: function() {
      return this.transcribedRegion;
    },

    /**
     * Get the attachment site for a location that is contained within this gene. In many cases, the affinity of the
     * attachment site will be the same as the default for any DNA, but in some cases it may be especially strong.
     *
     * @param {number} basePairIndex - Index of the base pair on the DNA strand, NOT the index within this gene. In the
     * real world, affinities are associated with sets of base pairs rather than an individual one, so this is a bit of a
     * simplification.
     * @return {AttachmentSite}
     */
    getPolymeraseAttachmentSiteByIndex: function( basePairIndex ) {
      if ( basePairIndex === this.regulatoryRegion.max ) {

        // This is the last base pair within the regulatory region, which is where the polymerase would begin transcription.
        return this.polymeraseAttachmentSite;
      }

      // There is currently nothing special about this site, so return a default affinity site.
      return this.dnaMolecule.createDefaultAffinityAttachmentSite(
        this.dnaMolecule.getBasePairXOffsetByIndex( basePairIndex ) );
    },

    /**
     * Get the attachment site where RNA polymerase would start transcribing the DNA. This is assumes that there is only
     * one such site on the gene.
     *
     * @return {AttachmentSite}
     */
    getPolymeraseAttachmentSite: function() {
      return this.polymeraseAttachmentSite;
    },

    updateAffinities: function() {
      // Update the affinity of the polymerase attachment site based upon the state of the transcription factors.
      if ( this.transcriptionFactorsSupportTranscription() ) {
        this.polymeraseAttachmentSite.affinityProperty.set( this.polymeraseAffinityProperty.get() );
      }
      else {
        this.polymeraseAttachmentSite.affinityProperty.set( CommonConstants.DEFAULT_AFFINITY );
      }
    },

    /**
     * Method used by descendant classes to add locations where transcription factors go on the gene.
     * Generally this is only used during construction.
     *
     * @param {number} basePairOffset - Offset WITHIN THIS GENE where the transcription factor's high affinity site will exist.
     * @param {TranscriptionFactorConfig} tfConfig
     */
    addTranscriptionFactor: function( basePairOffset, tfConfig ) {
      this.transcriptionFactorMap.put( basePairOffset, new TranscriptionFactor( null, tfConfig ) );
      var position = new Vector2( this.dnaMolecule.getBasePairXOffsetByIndex(
        basePairOffset + this.regulatoryRegion.min ), CommonConstants.DNA_MOLECULE_Y_POS );
      this.transcriptionFactorPlacementHints.push( new TranscriptionFactorPlacementHint(
        new TranscriptionFactor( new StubGeneExpressionModel(), tfConfig, position ) ) );
      this.transcriptionFactorAttachmentSites.push( new TranscriptionFactorAttachmentSite( position, tfConfig, 1 ) );
    },

    /**
     * Returns true if all positive transcription factors are attached and no negative ones are attached, which indicates
     * that transcription is essentially enabled.
     * @return {boolean}
     */
    transcriptionFactorsSupportTranscription: function() {

      // In this sim, blocking factors overrule positive factors, so test for those first.
      if ( this.transcriptionFactorsBlockTranscription() ) {
        return false;
      }

      // Count the number of positive transcription factors needed to enable transcription.
      var numPositiveTranscriptionFactorsNeeded = 0;
      this.transcriptionFactorMap.values.forEach( function( transcriptionFactor ) {
        if ( transcriptionFactor.getConfig().isPositive ) {
          numPositiveTranscriptionFactorsNeeded += 1;
        }
      } );


      // Count the number of positive transcription factors attached.
      var numPositiveTranscriptionFactorsAttached = 0;
      this.transcriptionFactorAttachmentSites.forEach( function( transcriptionFactorAttachmentSite ) {
        if ( transcriptionFactorAttachmentSite.attachedOrAttachingMoleculeProperty.get() !== null ) {
          var tf = transcriptionFactorAttachmentSite.attachedOrAttachingMoleculeProperty.get();
          // there is a very slight difference in the y direction and to mitigate that we add 0.0001 factor
          // empirically determined
          if ( tf.getPosition().distance( transcriptionFactorAttachmentSite.locationProperty.get() ) < 0.001 &&
               tf.isPositive() ) {
            numPositiveTranscriptionFactorsAttached += 1;
          }
        }
      } );

      return numPositiveTranscriptionFactorsAttached === numPositiveTranscriptionFactorsNeeded;
    },

    /**
     * Evaluate if transcription factors are blocking transcription.
     *
     * @return {boolean} true if there are transcription factors that block transcription.
     */
    transcriptionFactorsBlockTranscription: function() {
      for ( var i = 0; i < this.transcriptionFactorAttachmentSites.length; i++ ) {
        var transcriptionFactorAttachmentSite = this.transcriptionFactorAttachmentSites[ i ];
        if ( transcriptionFactorAttachmentSite.attachedOrAttachingMoleculeProperty.get() !== null ) {
          if ( !(transcriptionFactorAttachmentSite.attachedOrAttachingMoleculeProperty.get() ).isPositive() ) {
            return true;
          }
        }
      }

      return false;
    },

    /**
     * Get the attachment site for a location that is contained within this gene. In many cases, the affinity of the
     * attachment site will be the same as the default for any base pair on the DNA, but if the specified base pair matches
     * the location of the high-affinity site for this transcription factory, it will generally be higher than the default.
     *
     * @param {number} basePairIndex - Index of the base pair on the DNA strand, NOT the index within this gene. In the
     * real world, affinities are associated with sets of base pairs rather than an individual one, so this is a bit of a
     * simplification.
     * @param {TranscriptionFactorConfig} tfConfig
     * @return {AttachmentSite}
     */
    getTranscriptionFactorAttachmentSite: function( basePairIndex, tfConfig ) {
      // Assume a default affinity site until proven otherwise.
      var attachmentSite = this.dnaMolecule.createDefaultAffinityAttachmentSite(
        this.dnaMolecule.getBasePairXOffsetByIndex( basePairIndex ) );

      // Determine whether there are any transcription factor attachment sites on this gene that match the specified
      // configuration.
      for ( var i = 0; i < this.transcriptionFactorAttachmentSites.length; i++ ) {
        var transcriptionFactorAttachmentSite = this.transcriptionFactorAttachmentSites[ i ];
        if ( transcriptionFactorAttachmentSite.configurationMatches( tfConfig ) ) {
          // Found matching site.  Is it available and in the right place?
          if ( transcriptionFactorAttachmentSite.attachedOrAttachingMoleculeProperty.get() === null &&
               Math.abs( transcriptionFactorAttachmentSite.locationProperty.get().x -
                         this.dnaMolecule.getBasePairXOffsetByIndex( basePairIndex ) ) <
               CommonConstants.DISTANCE_BETWEEN_BASE_PAIRS / 2 ) {

            // Yes, so this is the site where the given TF should go.
            attachmentSite = transcriptionFactorAttachmentSite;
            break;
          }
        }
      }
      return attachmentSite;
    },

    /**
     * Get the attachment site that is specific to the given transcription factor configuration, if one exists.
     *
     * NOTE: This assumes a max of one site per TF config. This will need to change if multiple identical configs are
     * supported on a single gene.
     *
     * @param {TranscriptionFactorConfig} transcriptionFactorConfig
     * @return {AttachmentSite} attachment site for the config if present on the gene, null if not.
     */
    getMatchingSite: function( transcriptionFactorConfig ) {
      for ( var i = 0; i < this.transcriptionFactorAttachmentSites.length; i++ ) {
        var transcriptionFactorAttachmentSite = this.transcriptionFactorAttachmentSites[ i ];
        if ( transcriptionFactorAttachmentSite.configurationMatches( transcriptionFactorConfig ) ) {
          return transcriptionFactorAttachmentSite;
        }
      }
      return null;
    },

    /**
     * Get a property that can be used to vary the affinity of the attachment site associated with the specified
     * transcription factor.
     *
     * @param {TranscriptionFactorConfig} tfConfig
     * @return {Property<number>}
     */
    getTranscriptionFactorAffinityProperty: function( tfConfig ) {
      var affinityProperty = null;
      for ( var i = 0; i < this.transcriptionFactorAttachmentSites.length; i++ ) {
        var transcriptionFactorAttachmentSite = this.transcriptionFactorAttachmentSites[ i ];
        if ( transcriptionFactorAttachmentSite.configurationMatches( tfConfig ) ) {
          affinityProperty = transcriptionFactorAttachmentSite.affinityProperty;
          // Built-in assumption here: Only one site for given TF config.
          break;
        }
      }
      return affinityProperty;
    },

    /**
     * Get the property that controls the affinity of the site where polymerase binds when initiating transcription.
     *
     * @return {Property<number>}
     */
    getPolymeraseAffinityProperty: function() {
      return this.polymeraseAffinityProperty;
    },

    /**
     *
     * @param {number} basePairIndex
     * @returns {boolean}
     */
    containsBasePair: function( basePairIndex ) {
      return this.regulatoryRegion.contains( basePairIndex ) || this.transcribedRegion.contains( basePairIndex );
    },

    /**
     * Activate any and all placement hints associated with the given biomolecule.
     *
     * @param {MobileBiomolecule} biomolecule
     */
    activateHints: function( biomolecule ) {
      var self = this;
      if ( this.rnaPolymerasePlacementHint.isMatchingBiomolecule( biomolecule ) ) {
        if ( !this.transcriptionFactorsBlockTranscription() ) {

          // Activate the polymerase hint.
          this.rnaPolymerasePlacementHint.activeProperty.set( true );

          // Also activate any unoccupied positive transcription factor hints in order to convey to the user that these
          // are needed for transcription to start.
          this.transcriptionFactorAttachmentSites.forEach( function( transcriptionFactorAttachmentSite ) {
            if ( transcriptionFactorAttachmentSite.attachedOrAttachingMoleculeProperty.get() === null &&
                 transcriptionFactorAttachmentSite.getTfConfig().isPositive ) {
              self.activateTranscriptionFactorHint( transcriptionFactorAttachmentSite.getTfConfig() );
            }
          } );
        }
      }
      else if ( biomolecule instanceof TranscriptionFactor ) {
        // Activate hint that matches this transcription factor.
        this.transcriptionFactorPlacementHints.forEach( function( transcriptionFactorPlacementHint ) {
          transcriptionFactorPlacementHint.activateIfMatch( biomolecule );
        } );
      }
    },

    /**
     * @private
     * @param { TranscriptionFactorConfig } tfConfig
     */
    activateTranscriptionFactorHint: function( tfConfig ) {
      this.transcriptionFactorPlacementHints.forEach( function( transcriptionFactorPlacementHint ) {
        transcriptionFactorPlacementHint.activateIfConfigMatch( tfConfig );
      } );
    },

    deactivateHints: function() {
      this.rnaPolymerasePlacementHint.activeProperty.set( false );
      this.transcriptionFactorPlacementHints.forEach( function( transcriptionFactorPlacementHint ) {
        transcriptionFactorPlacementHint.activeProperty.set( false );
      } );
    },

    /**
     *
     * @returns {Array<PlacementHint>}
     */
    getPlacementHints: function() {
      var placementHints = [ this.rnaPolymerasePlacementHint ];
      this.transcriptionFactorPlacementHints.forEach( function( transcriptionFactorPlacementHint ) {
        placementHints.push( transcriptionFactorPlacementHint );
      } );
      return placementHints;
    },

    /**
     * Clear the attachment sites, generally only done as part of a reset operation.
     */
    clearAttachmentSites: function() {
      this.polymeraseAttachmentSite.attachedOrAttachingMoleculeProperty.set( null );
      this.transcriptionFactorAttachmentSites.forEach( function( transcriptionFactorAttachmentSite ) {
        transcriptionFactorAttachmentSite.attachedOrAttachingMoleculeProperty.set( null );
      } );
    },

    /**
     * Get an instance (a.k.a. a prototype) of the protein associated with this gene.
     *
     * @return {Protein}
     */
    getProteinPrototype: function() {
      throw new Error( 'getProteinPrototype should be implemented in descendant classes of Gene .' );
    },

    /**
     * Get the list of all transcription factors that have high-affinity binding sites on this gene.
     *
     * @return {Array}
     */
    getTranscriptionFactorConfigs: function() {
      var configList = [];
      this.transcriptionFactorMap.values.forEach( function( transcriptionFactor ) {
        configList.push( transcriptionFactor.getConfig() );
      } );
      return configList;
    }

  } );

} );
