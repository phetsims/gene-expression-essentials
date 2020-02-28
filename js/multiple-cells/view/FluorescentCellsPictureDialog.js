// Copyright 2015-2020, University of Colorado Boulder

/**
 * Shows a picture of real cells containing fluorescent protein.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */

import inherit from '../../../../phet-core/js/inherit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import LayoutBox from '../../../../scenery/js/nodes/LayoutBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import eColiImage from '../../../mipmaps/ecoli_jpg.js';
import geneExpressionEssentialsStrings from '../../gene-expression-essentials-strings.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

// constants
const IMAGE_WIDTH = 380; // in screen coordinates, empirically determined to look good


const imageCaptionNoteString = geneExpressionEssentialsStrings.imageCaptionNote;
const imageCaptionString = geneExpressionEssentialsStrings.imageCaption;

// constants
const TEXT_FONT = new PhetFont( 12 );

/**
 * @constructor
 */
function FluorescentCellsPictureDialog() {

  const imageNode = new Image( eColiImage, {
    minWidth: IMAGE_WIDTH,
    maxWidth: IMAGE_WIDTH
  } );

  // Add the caption.  Originally the caption and the note were two separate strings that were shown on separate
  // lines, but this was changed (see https://github.com/phetsims/gene-expression-essentials/issues/121) and they are
  // now combined. The strings have been left separate in the strings files so that translations don't need to be
  // modified.
  const captionAndNoteNode = new RichText( imageCaptionString + '  ' + imageCaptionNoteString, {
    font: TEXT_FONT,
    lineWrap: IMAGE_WIDTH,
    centerX: imageNode.centerX,
    top: imageNode.bottom + 10,
    align: 'left'
  } );
  const children = [
    imageNode,
    captionAndNoteNode,
    new Text( 'Image Copyright Dennis Kunkel Microscopy, Inc.', { font: TEXT_FONT } )
  ];

  const content = new LayoutBox( { orientation: 'vertical', align: 'center', spacing: 10, children: children } );

  Dialog.call( this, content, {
    topMargin: 20,
    bottomMargin: 20
  } );
}

geneExpressionEssentials.register( 'FluorescentCellsPictureDialog', FluorescentCellsPictureDialog );

inherit( Dialog, FluorescentCellsPictureDialog );
export default FluorescentCellsPictureDialog;