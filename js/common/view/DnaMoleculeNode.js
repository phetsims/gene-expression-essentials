// Copyright 2015-2022, University of Colorado Boulder

/**
 * Class that represents the DNA molecule in the view.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Node } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../../GeneExpressionEssentialsStrings.js';
import DnaMoleculeCanvasNode from './DnaMoleculeCanvasNode.js';
import GeneNode from './GeneNode.js';

const geneString = GeneExpressionEssentialsStrings.gene;

class DnaMoleculeNode extends Node {

  /**
   * @param {DnaMolecule} dnaMolecule
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} backboneStrokeWidth
   * @param {boolean} showGeneBracketLabels
   */
  constructor( dnaMolecule, modelViewTransform, backboneStrokeWidth, showGeneBracketLabels ) {
    super();

    // Add the layers onto which the various nodes that represent parts of the dna, the hints, etc. are placed.
    const geneBackgroundLayer = new Node();
    this.addChild( geneBackgroundLayer );

    // Layers for supporting the 3D look by allowing the "twist" to be depicted.
    this.dnaBackboneLayer = new DnaMoleculeCanvasNode( dnaMolecule, modelViewTransform, backboneStrokeWidth, {
      canvasBounds: new Bounds2(
        dnaMolecule.getLeftEdgeXPosition(),
        dnaMolecule.getBottomEdgeYPosition() + modelViewTransform.viewToModelDeltaY( 10 ),
        dnaMolecule.getRightEdgeXPosition(),
        dnaMolecule.getTopEdgeYPosition() - modelViewTransform.viewToModelDeltaY( 10 )
      ),
      matrix: modelViewTransform.getMatrix()
    } );

    this.addChild( this.dnaBackboneLayer );

    // Put the gene backgrounds and labels behind everything.
    for ( let i = 0; i < dnaMolecule.getGenes().length; i++ ) {
      geneBackgroundLayer.addChild( new GeneNode(
        modelViewTransform,
        dnaMolecule.getGenes()[ i ],
        dnaMolecule,
        StringUtils.fillIn( geneString, { geneID: i + 1 } ),
        showGeneBracketLabels
      ) );
    }
  }

  /**
   * @public
   */
  step() {
    this.dnaBackboneLayer.step();
  }
}

geneExpressionEssentials.register( 'DnaMoleculeNode', DnaMoleculeNode );

export default DnaMoleculeNode;