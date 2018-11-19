// Copyright 2015-2018, University of Colorado Boulder

/**
 * This class defines the box on the user interface from which the user can extract various biomolecules and put them
 * into action within the cell.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/GEEConstants' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MessengerRnaDestroyerCreatorNode = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/MessengerRnaDestroyerCreatorNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RibosomeCreatorNode = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/RibosomeCreatorNode' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var RnaPolymeraseCreatorNode = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/RnaPolymeraseCreatorNode' );
  var Spacer = require( 'SCENERY/nodes/Spacer' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TranscriptionFactorCreatorNode = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/TranscriptionFactorCreatorNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var TITLE_FONT = new PhetFont( { size: 20, weight: 'bold' } );

  // strings
  var biomoleculeToolboxString = require( 'string!GENE_EXPRESSION_ESSENTIALS/biomoleculeToolbox' );
  var mrnaDestroyerString = require( 'string!GENE_EXPRESSION_ESSENTIALS/mrnaDestroyer' );
  var negativeTranscriptionFactorHtmlString = require( 'string!GENE_EXPRESSION_ESSENTIALS/negativeTranscriptionFactorHtml' );
  var positiveTranscriptionFactorHtmlString = require( 'string!GENE_EXPRESSION_ESSENTIALS/positiveTranscriptionFactorHtml' );
  var ribosomeString = require( 'string!GENE_EXPRESSION_ESSENTIALS/ribosome' );
  var rnaPolymeraseString = require( 'string!GENE_EXPRESSION_ESSENTIALS/rnaPolymerase' );

  /**
   * Convenience function for creating row labels.
   */
  function RowLabel( text ) {
    return new RichText( text, {
      font: new PhetFont( { size: 15 } ),
      maxWidth: 150,
      align: 'center'
    } );
  }

  /**
   * @param {ManualGeneExpressionModel} model
   * @param {ManualGeneExpressionScreenView} canvas
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Gene} gene
   * @constructor
   */
  function BiomoleculeToolboxNode( model, canvas, modelViewTransform, gene ) {

    var self = this;
    this.model = model; //@private
    this.canvas = canvas; //@private
    this.modelViewTransform = modelViewTransform; //@private
    this.biomoleculeCreatorNodeList = [];

    // Add the title.
    var toolboxTitleNode = new Text( biomoleculeToolboxString, {
      font: TITLE_FONT,
      maxWidth: 200
    } );

    var positiveTranscriptionFactorLabel = new RowLabel( positiveTranscriptionFactorHtmlString );
    var positiveTranscriptionFactorLabelWidth = positiveTranscriptionFactorLabel.width;
    var rnaPolymeraseLabel = new RowLabel( rnaPolymeraseString );
    var rnaPolymeraseLabelWidth = rnaPolymeraseLabel.width;
    var ribosomeLabel = new RowLabel( ribosomeString );
    var ribosomeLabelWidth = ribosomeLabel.width;
    var mrnaDestroyerLabel = new RowLabel( mrnaDestroyerString );
    var mrnaDestroyerLabelWidth = mrnaDestroyerLabel.width;
    var negativeTranscriptionFactorLabel = new RowLabel( negativeTranscriptionFactorHtmlString );
    var negativeTranscriptionFactorLabelWidth = negativeTranscriptionFactorLabel.width;

    var maxWidth = _.max( [
      positiveTranscriptionFactorLabelWidth,
      rnaPolymeraseLabelWidth,
      ribosomeLabelWidth,
      mrnaDestroyerLabelWidth,
      negativeTranscriptionFactorLabelWidth
    ] );

    // Transcription factor(s).
    var transcriptionFactors = gene.getTranscriptionFactorConfigs();
    var positiveTranscriptBoxNodes = [];
    var negativeTranscriptBoxNodes = [];
    transcriptionFactors.forEach( function( tfConfig ) {
      var creatorNode = self.addCreatorNode( new TranscriptionFactorCreatorNode( self, tfConfig ) );
      if ( tfConfig.isPositive ) {
        var positiveTranscriptionBox = new HBox( {
          children: [
            positiveTranscriptionFactorLabel,
            new Spacer( maxWidth - positiveTranscriptionFactorLabelWidth, 0 ),
            creatorNode
          ],
          spacing: 10
        } );
        positiveTranscriptBoxNodes.push( positiveTranscriptionBox );
      }
      else {
        var negativeTranscriptionBox = new HBox( {
          children: [
            negativeTranscriptionFactorLabel,
            new Spacer( maxWidth - negativeTranscriptionFactorLabelWidth, 0 ),
            creatorNode
          ],
          spacing: 10
        } );
        negativeTranscriptBoxNodes.push( negativeTranscriptionBox );
      }
    } );

    // Polymerase.
    var polymeraseBox = new HBox( {
      children: [
        rnaPolymeraseLabel,
        new Spacer( maxWidth - rnaPolymeraseLabelWidth, 0 ),
        this.addCreatorNode( new RnaPolymeraseCreatorNode( this ) ),
        this.addCreatorNode( new RnaPolymeraseCreatorNode( this ) )
      ],
      spacing: 10
    } );

    // Ribosomes.
    var ribosomeBox = new HBox( {
      children: [
        ribosomeLabel,
        new Spacer( maxWidth - ribosomeLabelWidth, 0 ),
        this.addCreatorNode( new RibosomeCreatorNode( this ) ),
        this.addCreatorNode( new RibosomeCreatorNode( this ) )
      ],
      spacing: 10
    } );

    // mRNA destroyer.
    var mRnaDestroyerBox = new HBox( {
      children: [
        mrnaDestroyerLabel,
        new Spacer( maxWidth - mrnaDestroyerLabelWidth, 0 ),
        this.addCreatorNode( new MessengerRnaDestroyerCreatorNode( this ) ),
        this.addCreatorNode( new MessengerRnaDestroyerCreatorNode( this ) )
      ],
      spacing: 10
    } );

    var childrenNodesArray = [];
    childrenNodesArray = childrenNodesArray.concat( positiveTranscriptBoxNodes );
    childrenNodesArray.push( polymeraseBox );
    childrenNodesArray.push( ribosomeBox );
    childrenNodesArray.push( mRnaDestroyerBox );
    childrenNodesArray = childrenNodesArray.concat( negativeTranscriptBoxNodes );
    // Create the content of this control panel.
    var contentNode = new Node();
    contentNode.addChild( toolboxTitleNode );
    var childrenNode = new VBox( {
      children: childrenNodesArray,
      spacing: 10,
      align: 'left'
    } );
    contentNode.addChild( childrenNode );
    childrenNode.top = toolboxTitleNode.bottom + 10;
    toolboxTitleNode.centerX = childrenNode.centerX;

    Panel.call( this, contentNode, {
      cornerRadius: GEEConstants.CORNER_RADIUS,
      xMargin: 10,
      yMargin: 10,
      fill: new Color( 250, 250, 250 ),
      lineWidth: 1,
      align: 'center',
      resize: false
    } );
  }

  geneExpressionEssentials.register( 'BiomoleculeToolboxNode', BiomoleculeToolboxNode );

  return inherit( Panel, BiomoleculeToolboxNode, {

    /**
     * @public reset the toolbox
     */
    reset: function() {
      var bioMoleculeCreatorNodeLength = this.biomoleculeCreatorNodeList.length;
      for ( var i = 0; i < bioMoleculeCreatorNodeLength; i++ ) {
        this.biomoleculeCreatorNodeList[ i ].reset();
      }
    },

    /**
     * Convenience function for making it easy to create a biomolecule creator node and add it to the content panel at
     * the same time.
     * @param {BiomoleculeCreatorNode} biomoleculeCreatorNode
     * @returns BiomoleculeCreatorNode
     * @private
     */
    addCreatorNode: function( biomoleculeCreatorNode ) {
      this.biomoleculeCreatorNodeList.push( biomoleculeCreatorNode );
      return biomoleculeCreatorNode;
    }
  } );
} );