// Copyright 2016-2017, University of Colorado Boulder

/**
 * main screen view class for the "Multiple Cells" screen
 *
 * @author Aadish Gupta
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/GEEConstants' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MultipleCellsModel = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/model/MultipleCellsModel' );
  var MultipleCellsScreenView = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/view/MultipleCellsScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenMultipleCellsString = require( 'string!GENE_EXPRESSION_ESSENTIALS/screen.multipleCells' );

  // images
  var multipleCellsIcon = require( 'mipmap!GENE_EXPRESSION_ESSENTIALS/multiple-cells-icon.png' );

  /**
   * @constructor
   */
  function MultipleCellsScreen() {

    var options = {
      name: screenMultipleCellsString,
      backgroundColorProperty: new Property( 'black' ),
      homeScreenIcon: new Image( multipleCellsIcon ),
      maxDT: GEEConstants.MAX_DT
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
