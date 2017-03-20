// Copyright 2016, University of Colorado Boulder

/**
 * @author Aadish Gupta
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MultipleCellsModel = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/model/MultipleCellsModel' );
  var MultipleCellsScreenView = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/view/MultipleCellsScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var multipleCellsString = require( 'string!GENE_EXPRESSION_ESSENTIALS/multipleCells' );

  // images
  var multipleCellsIcon = require( 'mipmap!GENE_EXPRESSION_ESSENTIALS/multiple-cells-icon.png' );

  /**
   * @constructor
   */
  function MultipleCellsScreen() {

    var options = {
      name: multipleCellsString,
      backgroundColorProperty: new Property( 'black' ),
      homeScreenIcon: new Image( multipleCellsIcon )
    };

    Screen.call( this,
      function() { return new MultipleCellsModel(); },
      function( model ) { return new MultipleCellsScreenView( model ); },
      options
    );
  }

  geneExpressionEssentials.register( 'MultipleCellsScreen', MultipleCellsScreen );

  return inherit( Screen, MultipleCellsScreen );
} );
