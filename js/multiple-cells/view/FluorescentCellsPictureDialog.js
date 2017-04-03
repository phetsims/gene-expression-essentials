// Copyright 2015, University of Colorado Boulder
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Dialog = require( 'JOIST/Dialog' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  // images
  var ecoliImage = require( 'mipmap!GENE_EXPRESSION_ESSENTIALS/ecoli.jpg' );

  //strings
  var imageCaptionString = require('string!GENE_EXPRESSION_ESSENTIALS/imageCaption');
  var imageCaptionNoteString = require( 'string!GENE_EXPRESSION_ESSENTIALS/imageCaptionNote' );

  function FluorescentCellsPictureDialog() {
    var self = this;

    var imageNode = new Image( ecoliImage );
    imageNode.scale( 0.75 );
    var textNode = new Node();
    var captionTextNode = new HTMLText( imageCaptionString, { maxWidth: 400 } );
    var noteTextNode = new MultiLineText( imageCaptionNoteString, { maxWidth: 800 } );
    noteTextNode.centerX = captionTextNode.centerX;
    noteTextNode.top = captionTextNode.bottom + 3;
    textNode.addChild( captionTextNode );
    textNode.addChild( noteTextNode );
    var children = [
      imageNode,
      textNode,
      new Text( 'Image Copyright Dennis Kunkel Microscopy, Inc.' )
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
    hide: function() {
      this.shownProperty.value = false;
    },
    show: function() {
      this.shownProperty.value = true;
    }
  } );
} );
