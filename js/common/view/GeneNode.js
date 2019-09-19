// Copyright 2015-2017, University of Colorado Boulder

/**
 * Type that represents a gene in the view. Since a gene is basically a sequential collection of base pairs, this node
 * is basically something that highlights and labels the appropriate areas on the DNA strand.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/GEEConstants' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const regulatoryRegionString = require( 'string!GENE_EXPRESSION_ESSENTIALS/regulatoryRegion' );
  const transcribedRegionString = require( 'string!GENE_EXPRESSION_ESSENTIALS/transcribedRegion' );

  // constants
  var REGION_LABEL_FONT = new PhetFont( { size: 12, weight: 'bold' } );
  var GENE_LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  var BRACKET_DEPTH = 30;
  var RECT_ROUNDING = 15;

  /**
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Gene} gene
   * @param {DnaMolecule} dnaMolecule
   * @param {string} label
   * @param {boolean} showBracketLabel
   * @constructor
   */
  function GeneNode( modelViewTransform, gene, dnaMolecule, label, showBracketLabel ) {
    Node.call( this );

    var highlightHeight = -modelViewTransform.modelToViewDeltaY( GEEConstants.DNA_MOLECULE_DIAMETER * 1.5 );
    var highlightStartY = modelViewTransform.modelToViewY( dnaMolecule.getLeftEdgePosition().y ) - highlightHeight / 2;

    // Add the highlight for the regulatory region.
    var regRegionHighlightStartX = modelViewTransform.modelToViewX(
      dnaMolecule.getBasePairXOffsetByIndex( gene.getRegulatoryRegion().min )
    );
    var regRegionWidth = modelViewTransform.modelToViewX(
      dnaMolecule.getBasePairXOffsetByIndex( gene.getRegulatoryRegion().max )
    ) - regRegionHighlightStartX;
    var regRegionShape = Shape.roundRect( regRegionHighlightStartX, highlightStartY, regRegionWidth, highlightHeight,
      RECT_ROUNDING, RECT_ROUNDING );
    var regulatoryRegionNode = new Path( regRegionShape, { fill: gene.getRegulatoryRegionColor() } );
    this.addChild( regulatoryRegionNode );

    var regulatoryRegionCaption = new RichText( regulatoryRegionString, {
      font: REGION_LABEL_FONT,
      maxWidth: 100,
      align: 'center',
      centerX: regulatoryRegionNode.bounds.getCenterX(),
      top: regulatoryRegionNode.bounds.getMaxY()
    } );
    this.addChild( regulatoryRegionCaption );

    // Add the highlight for the transcribed region.
    var transcribedRegionHighlightStartX = modelViewTransform.modelToViewX(
      dnaMolecule.getBasePairXOffsetByIndex( gene.getTranscribedRegion().min )
    );
    var transcribedRegionWidth = modelViewTransform.modelToViewX(
      dnaMolecule.getBasePairXOffsetByIndex( gene.getTranscribedRegion().max )
    ) - transcribedRegionHighlightStartX;
    var transcribedRegionShape = Shape.roundRect( transcribedRegionHighlightStartX, highlightStartY,
      transcribedRegionWidth, highlightHeight, RECT_ROUNDING, RECT_ROUNDING );

    var transcribedRegionNode = new Path( transcribedRegionShape, { fill: gene.getTranscribedRegionColor() } );
    this.addChild( transcribedRegionNode );

    var transcribedRegionCaption = new RichText( transcribedRegionString, {
      font: REGION_LABEL_FONT,
      maxWidth: 100,
      align: 'center',
      centerX: transcribedRegionNode.bounds.getCenterX(),
      top: transcribedRegionNode.bounds.getMaxY()
    } );
    this.addChild( transcribedRegionCaption );

    // Add the bracket.  This is a portion (the non-textual part) of the  label for the gene.
    if ( showBracketLabel ) {
      var bracketPath = new Shape();
      bracketPath.moveTo( regulatoryRegionNode.bounds.getMinX(), regulatoryRegionCaption.bounds.getMaxY() );
      bracketPath.lineToRelative( BRACKET_DEPTH, BRACKET_DEPTH );
      bracketPath.lineTo(
        transcribedRegionNode.bounds.getMaxX() - BRACKET_DEPTH,
        transcribedRegionCaption.bounds.getMaxY() + BRACKET_DEPTH
      );
      bracketPath.lineToRelative( BRACKET_DEPTH, -BRACKET_DEPTH );
      this.addChild( new Path( bracketPath, { lineWidth: 2, stroke: Color.BLACK } ) );

      // And the textual label for the gene.
      var labelText = new Text( label, {
        font: GENE_LABEL_FONT,
        maxWidth: 150
      } );
      this.addChild( labelText );
      var bracketBounds = bracketPath.bounds;
      labelText.x = bracketBounds.getCenterX() - labelText.bounds.width / 2;
      labelText.y = bracketBounds.getMaxY() + 20;
    }
  }

  geneExpressionEssentials.register( 'GeneNode', GeneNode );

  return inherit( Node, GeneNode );
} );
