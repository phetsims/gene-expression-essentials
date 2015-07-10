//  Copyright 2002-2014, University of Colorado Boulder

/**
 * This class defines the box on the user interface from which the user can
 * extract various biomolecules and put them into action within the cell.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Panel = require( 'SUN/Panel' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Color = require( 'SCENERY/util/Color' );
  var TranscriptionFactorCreatorNode = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/view/TranscriptionFactorCreatorNode' );
  var RnaPolymeraseCreatorNode = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/view/RnaPolymeraseCreatorNode' );
  var RibosomeCreatorNode = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/view/RibosomeCreatorNode' );
  var MessengerRnaDestroyerCreatorNode = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/view/MessengerRnaDestroyerCreatorNode' );

  // constants
  var TITLE_FONT = new PhetFont( { size: 20, weight: 'bold' } );

  // strings
  var BIOMOLECULE_TOOLBOX = require( 'string!GENE_EXPRESSION_BASICS/biomoleculeToolbox' );
  var POSITIVE_TRANSCRIPTION_FACTOR_HTML = require( 'string!GENE_EXPRESSION_BASICS/positiveTranscriptionFactorHtml' );
  var RIBOSOME = require( 'string!GENE_EXPRESSION_BASICS/ribosome' );
  var RNA_POLYMERASE = require( 'string!GENE_EXPRESSION_BASICS/rnaPolymerase' );
  var MRNA_DESTROYER = require( 'string!GENE_EXPRESSION_BASICS/mrnaDestroyer' );
  var NEGATIVE_TRANSCRIPTION_FACTOR_HTML = require( 'string!GENE_EXPRESSION_BASICS/negativeTranscriptionFactorHtml' );



  /**
   * Convenience class for creating row labels.
   */
  function RowLabel( text ) {
    var thisNode = this;
    MultiLineText.call( thisNode, text, { font: new PhetFont( { size: 15, weight: 'bold' } ) } );
  }

  inherit( MultiLineText, RowLabel );

  /**
   *
   * @param {ManualGeneExpressionModel} model
   * @param {ManualGeneExpressionScreenView} canvas
   * @param {ModelViewTransform2} mvt
   * @param {Gene} gene
   * @constructor
   */
  function BiomoleculeToolBoxNode( model, canvas, mvt, gene ) {
    var thisNode = this;

    this.model = model;
    this.canvas = canvas;
    this.mvt = mvt;
    this.biomoleculeCreatorNodeList = [];

    // Add the title.
    var toolBoxTitleNode = new Text( BIOMOLECULE_TOOLBOX, TITLE_FONT );

    //  Positive transcription factor(s).
    var transcriptionFactors = gene.getTranscriptionFactorConfigs();
    var tfConfig = null;
    var positiveTranscriptNodes = [];
    for ( var i = 0; i < transcriptionFactors.length; i++ ) {
      tfConfig = transcriptionFactors[ i ];
      if ( tfConfig.isPositive ) {
        positiveTranscriptNodes.push( new RowLabel( POSITIVE_TRANSCRIPTION_FACTOR_HTML ) );
        positiveTranscriptNodes.push( thisNode.addCreatorNode( new TranscriptionFactorCreatorNode( thisNode, tfConfig ) ) );
      }
    }

    // Add the biomolecule rows, each of which has a title and a set of  biomolecules that can be added to the active area.
    var positiveTranscriptionBox = new HBox( {
      children: positiveTranscriptNodes,
      spacing: 10
    } );

    // Polymerase.
    var polymeraseBox = new HBox( {
      children: [ new RowLabel( RNA_POLYMERASE ),
        thisNode.addCreatorNode( new RnaPolymeraseCreatorNode( thisNode ) ),
        thisNode.addCreatorNode( new RnaPolymeraseCreatorNode( thisNode ) )
      ],
      spacing: 10
    } );

    // Ribosomes.
    var ribosomeBox = new HBox( {
      children: [ new RowLabel( RIBOSOME ), thisNode.addCreatorNode( new RibosomeCreatorNode( thisNode ) ),
        thisNode.addCreatorNode( new RibosomeCreatorNode( thisNode ) ) ],
      spacing: 10
    } );

    // mRNA destroyer.
    var mRnaDestroyerBox = new HBox( {
      children: [ new RowLabel( MRNA_DESTROYER ), thisNode.addCreatorNode( new MessengerRnaDestroyerCreatorNode( thisNode ) ),
        thisNode.addCreatorNode( new MessengerRnaDestroyerCreatorNode( thisNode ) ) ],
      spacing: 10
    } );


    // Negative transcription factor(s).
    transcriptionFactors = gene.getTranscriptionFactorConfigs();


    var negativeTranscriptorNodes = [];
    negativeTranscriptorNodes.push( new RowLabel( NEGATIVE_TRANSCRIPTION_FACTOR_HTML ) );
    for ( i = 0; i < transcriptionFactors.length; i++ ) {
      tfConfig = transcriptionFactors[ i ];
      if ( !tfConfig.isPositive ) {
        negativeTranscriptorNodes.push( thisNode.addCreatorNode( new TranscriptionFactorCreatorNode( thisNode, tfConfig ) ) );
      }
    }

    var negativeTranscriptionBox = new HBox( {
      children: negativeTranscriptorNodes,
      spacing: 10
    } );


    // Create the content of this control panel.
    var contentNode = new VBox( {
      children: [ toolBoxTitleNode, positiveTranscriptionBox, polymeraseBox, ribosomeBox, mRnaDestroyerBox, negativeTranscriptionBox ],
      spacing: 10
    } );


    Panel.call( thisNode, contentNode, {
      fill: new Color( 250, 250, 250 ),
      lineWidth: 2
    } );
  }

  return inherit( Panel, BiomoleculeToolBoxNode, {

    reset: function() {
      var bioMoleculeCreatorNodeLength = this.biomoleculeCreatorNodeList.length;
      for ( var i = 0; i < bioMoleculeCreatorNodeLength; i++ ) {
        this.biomoleculeCreatorNodeList[ i ].reset();
      }
    },

    /**
     * Convenience function for making it easy to create a biomolecule creator
     * node and add it to the content panel at the same time.
     * @param {BiomoleculeCreatorNode} biomoleculeCreatorNode
     * @returns BiomoleculeCreatorNode
     */
    addCreatorNode: function( biomoleculeCreatorNode ) {
      this.biomoleculeCreatorNodeList.push( biomoleculeCreatorNode );
      return biomoleculeCreatorNode;
    }

  } );

} );

