// Copyright 2015, University of Colorado Boulder

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
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  // images
  var ecoliImage = require( 'mipmap!GENE_EXPRESSION_ESSENTIALS/ecoli.jpg' );

  //strings
  var imageCaptionString = require('string!GENE_EXPRESSION_ESSENTIALS/imageCaption');

  function FluorescentCellsPictureDialog() {
    var self = this;

    var imageNode = new Image( ecoliImage );
    imageNode.scale( 0.75 );
    var children = [
      imageNode,
      new MultiLineText( imageCaptionString ),
      new Text( 'Image Copyright Dennis Kunkel Microscopy, Inc.' )
    ];

    var content = new LayoutBox( { orientation: 'vertical', align: 'center', spacing: 10, children: children } );

    Dialog.call( this, content, {
      modal: true,
      hasCloseButton: true,

      // focusable so it can be dismissed
      focusable: true

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
