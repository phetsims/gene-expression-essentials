// Copyright 2015-2023, University of Colorado Boulder

/**
 * Class that represents the collection area, where several different types of protein can be collected.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import { LineStyles } from '../../../../kite/js/imports.js';
import { HBox, Node } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import ProteinA from '../model/ProteinA.js';
import ProteinB from '../model/ProteinB.js';
import ProteinC from '../model/ProteinC.js';
import ProteinCaptureNode from './ProteinCaptureNode.js';

class ProteinCollectionArea extends Node {

  /**
   * @param {ManualGeneExpressionModel} model
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( model, modelViewTransform ) {
    super();

    // Get a transform that performs only the scaling portion of the modelViewTransform.
    const scaleVector = modelViewTransform.getMatrix().getScaleVector();
    const scale = modelViewTransform.getMatrix().scaleVector.x;

    // The getScaleVector method of Matrix3 always returns positive value for the scales, even though
    // the modelViewTransform uses inverted scaling for Y, so changing the assertion statement to check for absolute values
    // see issue #7
    assert && assert( scale === Math.abs( scaleVector.y ) ); // This only handles symmetric transform case.
    const transform = Matrix3.scaling( scale, -scale );

    // Figure out the max dimensions of the various protein types so that the capture nodes can be properly laid out.
    const captureNodeBackgroundSize = new Dimension2( 0, 0 );

    const proteinTypes = [ ProteinA, ProteinB, ProteinC ];
    for ( let i = 0; i < proteinTypes.length; i++ ) {
      const protein = new proteinTypes[ i ]();
      const proteinShapeBounds = protein.getFullyGrownShape()
        .transformed( transform )
        .getStrokedBounds( new LineStyles( { lineWidth: 1 } ) );
      captureNodeBackgroundSize.width = ( Math.max(
        proteinShapeBounds.width * ProteinCaptureNode.SCALE_FOR_FLASH_NODE,
        captureNodeBackgroundSize.width
      ) );
      captureNodeBackgroundSize.height = ( Math.max(
          proteinShapeBounds.height * ProteinCaptureNode.SCALE_FOR_FLASH_NODE,
          captureNodeBackgroundSize.height )
      );
    }

    // Add the collection area, which is a set of collection nodes.
    this.addChild( new HBox( {
      children: [
        new ProteinCaptureNode( model, 'ProteinA', transform, captureNodeBackgroundSize ),
        new ProteinCaptureNode( model, 'ProteinB', transform, captureNodeBackgroundSize ),
        new ProteinCaptureNode( model, 'ProteinC', transform, captureNodeBackgroundSize )
      ],
      spacing: 0
    } ) );
  }
}

geneExpressionEssentials.register( 'ProteinCollectionArea', ProteinCollectionArea );

export default ProteinCollectionArea;