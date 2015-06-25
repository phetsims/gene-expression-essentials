//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Class that represents a gene in the view.  Since a gene is basically a
 * sequential collection of base pairs, this node is basically something that
 * highlights and labels the appropriate areas on the DNA strand.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Color = require( 'SCENERY/util/Color' );
  var CommonConstants = require( 'GENE_EXPRESSION_BASICS/common/model/CommonConstants' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var REGULATORY_REGION = require( 'string!GENE_EXPRESSION_BASICS/regulatoryRegion' );
  var TRANSCRIBED_REGION = require( 'string!GENE_EXPRESSION_BASICS/transcribedRegion' );

  // constants
  var REGION_LABEL_FONT = new PhetFont( { size: 12, weight: 'bold' } );
  var GENE_LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  var BRACKET_DEPTH = 30;
  var RECT_ROUNDING = 15;

  /**
   *
   * @param {ModelViewTransform2} mvt
   * @param {Gene} gene
   * @param {DnaMolecule} dnaMolecule
   * @param {string} label
   * @param {boolean} showBracketLabel
   * @constructor
   */
  function GeneNode( mvt, gene, dnaMolecule, label, showBracketLabel ) {
    var thisNode = this;
    Node.call( thisNode );

    var highlightHeight = -mvt.modelToViewDeltaY( CommonConstants.DNA_MOLECULE_DIAMETER * 1.5 );
    var highlightStartY = mvt.modelToViewY( dnaMolecule.getLeftEdgePos().y ) - highlightHeight / 2;

    // Add the highlight for the regulatory region.
    var regRegionHighlightStartX = mvt.modelToViewX( dnaMolecule.getBasePairXOffsetByIndex( gene.getRegulatoryRegion().getMin() ) );
    var regRegionWidth = mvt.modelToViewX( dnaMolecule.getBasePairXOffsetByIndex( gene.getRegulatoryRegion().getMax() ) ) - regRegionHighlightStartX;
    var regRegionShape = Shape.roundRect( regRegionHighlightStartX, highlightStartY, regRegionWidth, highlightHeight,
      RECT_ROUNDING, RECT_ROUNDING );
    var regulatoryRegionNode = new Path( regRegionShape, { fill: gene.getRegulatoryRegionColor() } );
    thisNode.addChild( regulatoryRegionNode );

    var regulatoryRegionCaption = new MultiLineText( REGULATORY_REGION, { font: REGION_LABEL_FONT } );
    regulatoryRegionCaption.x = regulatoryRegionNode.bounds.getCenterX() - regulatoryRegionCaption.bounds.width / 2;
    regulatoryRegionCaption.y = regulatoryRegionNode.bounds.getMaxY();
    thisNode.addChild( regulatoryRegionCaption );

    // Add the highlight for the transcribed region.
    var transcribedRegionHighlightStartX = mvt.modelToViewX( dnaMolecule.getBasePairXOffsetByIndex( gene.getTranscribedRegion().getMin() ) );
    var transcribedRegionWidth = mvt.modelToViewX( dnaMolecule.getBasePairXOffsetByIndex( gene.getTranscribedRegion().getMax() ) ) - transcribedRegionHighlightStartX;
    var transcribedRegionShape = Shape.roundRect( transcribedRegionHighlightStartX, highlightStartY,
      transcribedRegionWidth, highlightHeight, RECT_ROUNDING, RECT_ROUNDING );

    var transcribedRegionNode = new Path( transcribedRegionShape, { fill: gene.getTranscribedRegionColor() } );
    thisNode.addChild( transcribedRegionNode );

    var transcribedRegionCaption = new MultiLineText( TRANSCRIBED_REGION, { font: REGION_LABEL_FONT } );
    transcribedRegionCaption.x = transcribedRegionNode.bounds.getCenterX() - transcribedRegionCaption.bounds.width / 2;
    transcribedRegionCaption.y = transcribedRegionNode.bounds.getMaxY();
    thisNode.addChild( transcribedRegionCaption );

    // Add the bracket.  This is a portion (the non-textual part) of the  label for the gene.
    if ( showBracketLabel ) {
      var bracketPath = new Shape();
      bracketPath.moveTo( regulatoryRegionNode.bounds.getMinX(),
        regulatoryRegionCaption.bounds.getMaxY() );
      bracketPath.lineToRelative( BRACKET_DEPTH, BRACKET_DEPTH );
      bracketPath.lineTo( transcribedRegionNode.bounds.getMaxX() - BRACKET_DEPTH,
        transcribedRegionCaption.bounds.getMaxY() + BRACKET_DEPTH );
      bracketPath.lineToRelative( BRACKET_DEPTH, -BRACKET_DEPTH );
      thisNode.addChild( new Path( bracketPath, { lineWidth: 2, stroke: Color.BLACK } ) );

      // And the textual label for the gene.
      var labelText = new Text( label, { font: GENE_LABEL_FONT } );
      thisNode.addChild( labelText );
      var bracketBounds = bracketPath.computeBounds();
      labelText.x = bracketBounds.getCenterX() - labelText.bounds.width / 2;
      labelText.y = bracketBounds.getMaxY() + 20;
    }
  }

  return inherit( Node, GeneNode );
} );
