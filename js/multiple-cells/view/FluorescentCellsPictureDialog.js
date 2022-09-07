// Copyright 2015-2022, University of Colorado Boulder

/**
 * Shows a picture of real cells containing fluorescent protein.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Image, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import Dialog from '../../../../sun/js/Dialog.js';
import ecoli_jpg from '../../../mipmaps/ecoli_jpg.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../../GeneExpressionEssentialsStrings.js';

// constants
const IMAGE_WIDTH = 600; // in screen coordinates, empirically determined to look good
const imageCaptionNoteString = GeneExpressionEssentialsStrings.imageCaptionNote;
const imageCaptionString = GeneExpressionEssentialsStrings.imageCaption;

// constants
const TEXT_FONT = new PhetFont( 16 );

class FluorescentCellsPictureDialog extends Dialog {

  constructor() {

    const imageNode = new Image( ecoli_jpg, {
      minWidth: IMAGE_WIDTH,
      maxWidth: IMAGE_WIDTH
    } );

    // Add the caption.  Originally the caption and the note were two separate strings that were shown on separate
    // lines, but this was changed (see https://github.com/phetsims/gene-expression-essentials/issues/121) and they are
    // now combined. The strings have been left separate in the strings files so that translations don't need to be
    // modified.
    const captionAndNoteNode = new RichText( `${imageCaptionString} <br>${imageCaptionNoteString}`, {
      font: TEXT_FONT,
      align: 'center'
    } );
    const children = [
      imageNode,
      captionAndNoteNode,
      new Text( 'Image Copyright Dennis Kunkel Microscopy, Inc.', { font: TEXT_FONT } )
    ];

    const content = new VBox( { align: 'center', spacing: 10, children: children } );

    super( content, {
      topMargin: 20,
      bottomMargin: 20
    } );
  }
}

geneExpressionEssentials.register( 'FluorescentCellsPictureDialog', FluorescentCellsPictureDialog );
export default FluorescentCellsPictureDialog;