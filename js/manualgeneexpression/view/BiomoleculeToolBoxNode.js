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
    MultiLineText.call( thisNode, text, { font: new PhetFont( 16 ) } );
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
    // Create the content of this control panel.
    var contentNode = new VBox();
    // Add the title.
    var toolBoxTitleNode = new Text( BIOMOLECULE_TOOLBOX, TITLE_FONT );

    // Add the biomolecule rows, each of which has a title and a set of  biomolecules that can be added to the active area.
    var positiveTranscriptionBox = new HBox();

    //  Positive transcription factor(s).
    var transcriptionFactors = gene.getTranscriptionFactorConfigs();
    var tfConfig = null;
    for ( var i = 0; i < transcriptionFactors.length; i++ ) {
      tfConfig = transcriptionFactors[ i ];
      if ( tfConfig.isPositive ) {
        positiveTranscriptionBox.children.push( new RowLabel( POSITIVE_TRANSCRIPTION_FACTOR_HTML ) );
        positiveTranscriptionBox.children.push( thisNode.addCreatorNode( new TranscriptionFactorCreatorNode( thisNode, tfConfig ) ) );
      }
    }

    // Polymerase.
    var polymeraseBox = new HBox();
    polymeraseBox.children.push( new RowLabel( RNA_POLYMERASE ) );
    polymeraseBox.children.push( thisNode.addCreatorNode( new RnaPolymeraseCreatorNode( thisNode ) ) );
    polymeraseBox.children.push( thisNode.addCreatorNode( new RnaPolymeraseCreatorNode( thisNode ) ) );

    // Ribosomes.
    var ribosomeBox = new HBox();
    polymeraseBox.children.push( new RowLabel( RIBOSOME ) );
    ribosomeBox.children.push( thisNode.addCreatorNode( new RibosomeCreatorNode( thisNode ) ) );
    ribosomeBox.children.push( thisNode.addCreatorNode( new RibosomeCreatorNode( thisNode ) ) );

    // mRNA destroyer.
    var mRnaDestroyerBox = new HBox();
    polymeraseBox.children.push( new RowLabel( MRNA_DESTROYER ) );
    mRnaDestroyerBox.children.push( thisNode.addCreatorNode( new MessengerRnaDestroyerCreatorNode( thisNode ) ) );
    mRnaDestroyerBox.children.push( thisNode.addCreatorNode( new MessengerRnaDestroyerCreatorNode( thisNode ) ) );

    // Negative transcription factor(s).
    transcriptionFactors = gene.getTranscriptionFactorConfigs();
    var negativeTranscriptionBox = new HBox();
    for ( i = 0; i < transcriptionFactors.length; i++ ) {
      tfConfig = transcriptionFactors[ i ];
      if ( !tfConfig.isPositive ) {
        negativeTranscriptionBox.children.push( new RowLabel( NEGATIVE_TRANSCRIPTION_FACTOR_HTML ) );
        negativeTranscriptionBox.children.push( thisNode.addCreatorNode( new TranscriptionFactorCreatorNode( thisNode, tfConfig ) ) );
      }
    }

    contentNode.children = [ toolBoxTitleNode, positiveTranscriptionBox, polymeraseBox, ribosomeBox, mRnaDestroyerBox, negativeTranscriptionBox ];
    contentNode.spacing = 20;

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

