// Copyright 2015, University of Colorado Boulder

/**
 * This class defines the box on the user interface from which the user can extract various biomolecules and put them
 * into action within the cell.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MessengerRnaDestroyerCreatorNode = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/MessengerRnaDestroyerCreatorNode' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RibosomeCreatorNode = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/RibosomeCreatorNode' );
  var RnaPolymeraseCreatorNode = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/RnaPolymeraseCreatorNode' );
  var Spacer = require( 'SCENERY/nodes/Spacer' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TranscriptionFactorCreatorNode = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/TranscriptionFactorCreatorNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var TITLE_FONT = new PhetFont( { size: 20, weight: 'bold' } );

  // strings
  var biomoleculeToolboxString = require( 'string!GENE_EXPRESSION_ESSENTIALS/biomoleculeToolbox' );
  var positiveTranscriptionFactorHtmlString = require( 'string!GENE_EXPRESSION_ESSENTIALS/positiveTranscriptionFactorHtml' );
  var ribosomeString = require( 'string!GENE_EXPRESSION_ESSENTIALS/ribosome' );
  var rnaPolymeraseString = require( 'string!GENE_EXPRESSION_ESSENTIALS/rnaPolymerase' );
  var mrnaDestroyerString = require( 'string!GENE_EXPRESSION_ESSENTIALS/mrnaDestroyer' );
  var negativeTranscriptionFactorHtmlString = require( 'string!GENE_EXPRESSION_ESSENTIALS/negativeTranscriptionFactorHtml' );

  /**
   * Convenience class for creating row labels.
   */
  function RowLabel( text ) {
    return new MultiLineText( text, {
      font: new PhetFont( { size: 15 } ),
      maxWidth: 150
    } );
  }

  /**
   *
   * @param {ManualGeneExpressionModel} model
   * @param {ManualGeneExpressionScreenView} canvas
   * @param {ModelViewTransform2} mvt
   * @param {Gene} gene
   * @constructor
   */
  function BiomoleculeToolBoxNode( model, canvas, mvt, gene ) {
    var self = this;

    self.model = model;
    self.canvas = canvas;
    self.mvt = mvt;
    self.biomoleculeCreatorNodeList = [];

    // Add the title.
    var toolBoxTitleNode = new Text( biomoleculeToolboxString, {
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

    //  Positive transcription factor(s).
    var transcriptionFactors = gene.getTranscriptionFactorConfigs();
    var tfConfig = null;
    var positiveTranscriptBoxNodes = [];
    for ( var i = 0; i < transcriptionFactors.length; i++ ) {
      tfConfig = transcriptionFactors[ i ];
      if ( tfConfig.isPositive ) {
        var positiveTranscriptionBox = new HBox( {
          children: [
            positiveTranscriptionFactorLabel,
            new Spacer( maxWidth - positiveTranscriptionFactorLabelWidth, 0 ),
            self.addCreatorNode( new TranscriptionFactorCreatorNode( self, tfConfig ) )
          ],
          spacing: 10
        } );
        positiveTranscriptBoxNodes.push( positiveTranscriptionBox );
      }
    }

    // Polymerase.
    var polymeraseBox = new HBox( {
      children: [
        rnaPolymeraseLabel,
        new Spacer( maxWidth - rnaPolymeraseLabelWidth, 0 ),
        self.addCreatorNode( new RnaPolymeraseCreatorNode( self ) ),
        self.addCreatorNode( new RnaPolymeraseCreatorNode( self ) )
      ],
      spacing: 10
    } );

    // Ribosomes.
    var ribosomeBox = new HBox( {
      children: [
        ribosomeLabel,
        new Spacer( maxWidth - ribosomeLabelWidth, 0 ),
        self.addCreatorNode( new RibosomeCreatorNode( self ) ),
        self.addCreatorNode( new RibosomeCreatorNode( self ) )
      ],
      spacing: 10
    } );

    // mRNA destroyer.
    var mRnaDestroyerBox = new HBox( {
      children: [
        mrnaDestroyerLabel,
        new Spacer( maxWidth - mrnaDestroyerLabelWidth, 0 ),
        self.addCreatorNode( new MessengerRnaDestroyerCreatorNode( self ) ),
        self.addCreatorNode( new MessengerRnaDestroyerCreatorNode( self ) )
      ],
      spacing: 10
    } );


    // Negative transcription factor(s).
    transcriptionFactors = gene.getTranscriptionFactorConfigs();


    var negativeTranscriptBoxNodes = [];
    for ( i = 0; i < transcriptionFactors.length; i++ ) {
      tfConfig = transcriptionFactors[ i ];
      if ( !tfConfig.isPositive ) {
        var negativeTranscriptionBox = new HBox( {
          children: [
            negativeTranscriptionFactorLabel,
            new Spacer( maxWidth - negativeTranscriptionFactorLabelWidth, 0 ),
            self.addCreatorNode( new TranscriptionFactorCreatorNode( self, tfConfig ) )
          ],
          spacing: 10
        } );
        negativeTranscriptBoxNodes.push( positiveTranscriptionBox );
      }
    }

    var childrenNodesArray = [ ];
    childrenNodesArray = childrenNodesArray.concat( positiveTranscriptBoxNodes );
    childrenNodesArray.push( polymeraseBox );
    childrenNodesArray.push( ribosomeBox );
    childrenNodesArray.push( mRnaDestroyerBox );
    childrenNodesArray = childrenNodesArray.concat( negativeTranscriptionBox );
    // Create the content of this control panel.
    var contentNode = new Node();
    contentNode.addChild( toolBoxTitleNode );
    var childrenNode = new VBox( {
      children: childrenNodesArray,
      spacing: 10,
      align: 'left'
    } );
    contentNode.addChild( childrenNode );
    childrenNode.top = toolBoxTitleNode.bottom + 10;
    toolBoxTitleNode.centerX = childrenNode.centerX;


    Panel.call( self, contentNode, {
      xMargin: 10,
      yMargin: 10,
      fill: new Color( 250, 250, 250 ),
      lineWidth: 1,
      align: 'center',
      resize: false
    } );
  }

  geneExpressionEssentials.register( 'BiomoleculeToolBoxNode', BiomoleculeToolBoxNode );

  return inherit( Panel, BiomoleculeToolBoxNode, {

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
     */
    addCreatorNode: function( biomoleculeCreatorNode ) {
      this.biomoleculeCreatorNodeList.push( biomoleculeCreatorNode );
      return biomoleculeCreatorNode;
    }
  } );
} );