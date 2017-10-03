// Copyright 2015-2017, University of Colorado Boulder

/**
 * Shows a picture of real cells containing fluorescent protein.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Dialog = require( 'JOIST/Dialog' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // images
  var eColiImage = require( 'mipmap!GENE_EXPRESSION_ESSENTIALS/ecoli.jpg' );

  // strings
  var imageCaptionNoteString = require( 'string!GENE_EXPRESSION_ESSENTIALS/imageCaptionNote' );
  var imageCaptionString = require( 'string!GENE_EXPRESSION_ESSENTIALS/imageCaption' );

  // constants
  var TEXT_FONT = new PhetFont( 12 );

  /**
   * @constructor
   */
  function FluorescentCellsPictureDialog() {
    var self = this;

    var imageNode = new Image( eColiImage );
    imageNode.scale( 0.75 ); // scale empirically determined
    var textNode = new Node();
    var captionTextNode = new RichText( imageCaptionString, { font: TEXT_FONT, maxWidth: 800 } );
    var noteTextNode = new MultiLineText( imageCaptionNoteString, { font: TEXT_FONT, maxWidth: 800 } );
    if ( captionTextNode.bounds.isFinite() ) {
      noteTextNode.centerX = captionTextNode.centerX;
      noteTextNode.top = captionTextNode.bottom + 1;
    }
    textNode.addChild( captionTextNode );
    textNode.addChild( noteTextNode );
    var children = [
      imageNode,
      textNode,
      new Text( 'Image Copyright Dennis Kunkel Microscopy, Inc.', { font: TEXT_FONT } )
    ];

    var content = new LayoutBox( { orientation: 'vertical', align: 'center', spacing: 10, children: children } );

    Dialog.call( this, content, {
      modal: true,
      hasCloseButton: true
    } );

    // close it on a click
    this.addInputListener( new ButtonListener( {
      fire: self.hide.bind( self )
    } ) );

    this.shownProperty = new Property( false );

    this.shownProperty.lazyLink( function( shown ) {
      if ( shown ) {
        Dialog.prototype.show.call( self );
      }
      else {
        Dialog.prototype.hide.call( self );
      }
    } );
  }

  geneExpressionEssentials.register( 'FluorescentCellsPictureDialog', FluorescentCellsPictureDialog );

  return inherit( Dialog, FluorescentCellsPictureDialog, {

    /**
     * @public
     */
    hide: function() {
      this.shownProperty.value = false;
    },

    /**
     * @public
     */
    show: function() {
      this.shownProperty.value = true;
    }
  } );
} );
