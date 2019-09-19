// Copyright 2016-2017, University of Colorado Boulder

/**
 * main screen view class for the "Multiple Cells" screen
 *
 * @author Aadish Gupta
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/GEEConstants' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MultipleCellsModel = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/model/MultipleCellsModel' );
  const MultipleCellsScreenView = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/view/MultipleCellsScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenMultipleCellsString = require( 'string!GENE_EXPRESSION_ESSENTIALS/screen.multipleCells' );

  // images
  const multipleCellsIcon = require( 'mipmap!GENE_EXPRESSION_ESSENTIALS/multiple-cells-icon.png' );

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
