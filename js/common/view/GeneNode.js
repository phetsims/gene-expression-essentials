// Copyright 2015-2022, University of Colorado Boulder

/**
 * Type that represents a gene in the view. Since a gene is basically a sequential collection of base pairs, this node
 * is basically something that highlights and labels the appropriate areas on the DNA strand.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import { Shape } from '../../../../kite/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Node, Path, RichText, Text } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../../GeneExpressionEssentialsStrings.js';
import GEEConstants from '../GEEConstants.js';

const regulatoryRegionString = GeneExpressionEssentialsStrings.regulatoryRegion;
const transcribedRegionString = GeneExpressionEssentialsStrings.transcribedRegion;

// constants
const REGION_LABEL_FONT = new PhetFont( { size: 12, weight: 'bold' } );
const GENE_LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );
const BRACKET_DEPTH = 30;
const RECT_ROUNDING = 15;

class GeneNode extends Node {

  /**
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Gene} gene
   * @param {DnaMolecule} dnaMolecule
   * @param {string} label
   * @param {boolean} showBracketLabel
   */
  constructor( modelViewTransform, gene, dnaMolecule, label, showBracketLabel ) {
    super();

    const highlightHeight = -modelViewTransform.modelToViewDeltaY( GEEConstants.DNA_MOLECULE_DIAMETER * 1.5 );
    const highlightStartY = modelViewTransform.modelToViewY( dnaMolecule.getLeftEdgePosition().y ) - highlightHeight / 2;

    // Add the highlight for the regulatory region.
    const regRegionHighlightStartX = modelViewTransform.modelToViewX(
      dnaMolecule.getBasePairXOffsetByIndex( gene.getRegulatoryRegion().min )
    );
    const regRegionWidth = modelViewTransform.modelToViewX(
      dnaMolecule.getBasePairXOffsetByIndex( gene.getRegulatoryRegion().max )
    ) - regRegionHighlightStartX;
    const regRegionShape = Shape.roundRect( regRegionHighlightStartX, highlightStartY, regRegionWidth, highlightHeight,
      RECT_ROUNDING, RECT_ROUNDING );
    const regulatoryRegionNode = new Path( regRegionShape, { fill: gene.getRegulatoryRegionColor() } );
    this.addChild( regulatoryRegionNode );

    const regulatoryRegionCaption = new RichText( regulatoryRegionString, {
      font: REGION_LABEL_FONT,
      maxWidth: 100,
      align: 'center',
      centerX: regulatoryRegionNode.bounds.getCenterX(),
      top: regulatoryRegionNode.bounds.getMaxY()
    } );
    this.addChild( regulatoryRegionCaption );

    // Add the highlight for the transcribed region.
    const transcribedRegionHighlightStartX = modelViewTransform.modelToViewX(
      dnaMolecule.getBasePairXOffsetByIndex( gene.getTranscribedRegion().min )
    );
    const transcribedRegionWidth = modelViewTransform.modelToViewX(
      dnaMolecule.getBasePairXOffsetByIndex( gene.getTranscribedRegion().max )
    ) - transcribedRegionHighlightStartX;
    const transcribedRegionShape = Shape.roundRect( transcribedRegionHighlightStartX, highlightStartY,
      transcribedRegionWidth, highlightHeight, RECT_ROUNDING, RECT_ROUNDING );

    const transcribedRegionNode = new Path( transcribedRegionShape, { fill: gene.getTranscribedRegionColor() } );
    this.addChild( transcribedRegionNode );

    const transcribedRegionCaption = new RichText( transcribedRegionString, {
      font: REGION_LABEL_FONT,
      maxWidth: 100,
      align: 'center',
      centerX: transcribedRegionNode.bounds.getCenterX(),
      top: transcribedRegionNode.bounds.getMaxY()
    } );
    this.addChild( transcribedRegionCaption );

    // Add the bracket.  This is a portion (the non-textual part) of the  label for the gene.
    if ( showBracketLabel ) {
      const bracketPath = new Shape();
      bracketPath.moveTo( regulatoryRegionNode.bounds.getMinX(), regulatoryRegionCaption.bounds.getMaxY() );
      bracketPath.lineToRelative( BRACKET_DEPTH, BRACKET_DEPTH );
      bracketPath.lineTo(
        transcribedRegionNode.bounds.getMaxX() - BRACKET_DEPTH,
        transcribedRegionCaption.bounds.getMaxY() + BRACKET_DEPTH
      );
      bracketPath.lineToRelative( BRACKET_DEPTH, -BRACKET_DEPTH );
      this.addChild( new Path( bracketPath, { lineWidth: 2, stroke: Color.BLACK } ) );

      // And the textual label for the gene.
      const labelText = new Text( label, {
        font: GENE_LABEL_FONT,
        maxWidth: 150
      } );
      this.addChild( labelText );
      const bracketBounds = bracketPath.bounds;
      labelText.x = bracketBounds.getCenterX() - labelText.bounds.width / 2;
      labelText.y = bracketBounds.getMaxY() + 20;
    }
  }
}

geneExpressionEssentials.register( 'GeneNode', GeneNode );

export default GeneNode;