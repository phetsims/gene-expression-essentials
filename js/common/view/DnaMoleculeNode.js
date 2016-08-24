// Copyright 2015, University of Colorado Boulder

/**
 * Class that represents the DNA molecule in the view.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Color = require( 'SCENERY/util/Color' );
  var GeneNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/GeneNode' );
  var DnaStrandSegmentNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/DnaStrandSegmentNode' );

  // constants
  var STRAND_1_COLOR = new Color( 31, 163, 223 );
  var STRAND_2_COLOR = new Color( 214, 87, 107 );

  // strings
  var geneString = require( 'string!GENE_EXPRESSION_ESSENTIALS/gene' );

  /**
   *
   * @param {DnaMolecule} dnaMolecule
   * @param {ModelViewTransform2} mvt
   * @param {number} backboneStrokeWidth
   * @param {boolean} showGeneBracketLabels
   * @constructor
   */
  function DnaMoleculeNode( dnaMolecule, mvt, backboneStrokeWidth, showGeneBracketLabels ) {
    var thisNode = this;
    Node.call( thisNode );

    // Layers for supporting the 3D look by allowing the "twist" to be depicted.
    this.dnaBackboneBackLayer = new Node();
    this.dnaBackboneFrontLayer = new Node();

    // Add the layers onto which the various nodes that represent parts of
    // the dna, the hints, etc. are placed.
    var geneBackgroundLayer = new Node();
    thisNode.addChild( geneBackgroundLayer );
    thisNode.addChild( this.dnaBackboneBackLayer );
    var basePairLayer = new Node();
    thisNode.addChild( basePairLayer );
    thisNode.addChild( this.dnaBackboneFrontLayer );

    // Put the gene backgrounds and labels behind everything.
    for ( var i = 0; i < dnaMolecule.getGenes().length; i++ ) {
      geneBackgroundLayer.addChild( new GeneNode( mvt, dnaMolecule.getGenes()[ i ], dnaMolecule,
        geneString + ( i + 1 ), showGeneBracketLabels ) );
    }

    // Add the first backbone strand.
    _.each( dnaMolecule.getStrand1Segments(), function( dnaStrandSegment ) {
      thisNode.addStrand( mvt, dnaStrandSegment, backboneStrokeWidth, STRAND_1_COLOR );
    } );

    // Add the other backbone strand.
    _.each( dnaMolecule.getStrand2Segments(), function( dnaStrandSegment ) {
      thisNode.addStrand( mvt, dnaStrandSegment, backboneStrokeWidth, STRAND_2_COLOR );
    } );

    // Add the base pairs.
    _.each( dnaMolecule.getBasePairs(), function( basePair ) {
      basePairLayer.addChild( new Path( mvt.modelToViewShape( basePair.getShape() ), { fill: Color.DARK_GRAY } ) );
    } );


  }

  return inherit( Node, DnaMoleculeNode, {

    /**
     *
     * @param {ModelViewTransform2} mvt
     * @param {DnaStrandSegment} dnaStrandSegment
     * @param {number} strandSegmentStroke
     * @param {Color} color
     */
    addStrand: function( mvt, dnaStrandSegment, strandSegmentStroke, color ) {
      var segmentNode = new DnaStrandSegmentNode( dnaStrandSegment, mvt, strandSegmentStroke, color );
      if ( dnaStrandSegment.inFront ) {
        this.dnaBackboneFrontLayer.addChild( segmentNode );
      }
      else {
        this.dnaBackboneBackLayer.addChild( segmentNode );
      }
    }

  } );

} );

