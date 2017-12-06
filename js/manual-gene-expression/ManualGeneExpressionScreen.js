// Copyright 2015-2017, University of Colorado Boulder

/**
 * main screen view type for the 'Expression' screen
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/GEEConstants' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ManualGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ManualGeneExpressionModel' );
  var ManualGeneExpressionScreenView = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/ManualGeneExpressionScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenExpressionString = require( 'string!GENE_EXPRESSION_ESSENTIALS/screen.expression' );

  // images
  var manualGeneExpressionIcon = require( 'mipmap!GENE_EXPRESSION_ESSENTIALS/manual-gene-expression-icon.png' );

  /**
   * @constructor
   */
  function ManualGeneExpressionScreen() {

    var options = {
      name: screenExpressionString,
      backgroundColorProperty: new Property( '#ABCBDB' ),
      homeScreenIcon: new Image( manualGeneExpressionIcon ),
      maxDT: GEEConstants.MAX_DT
    };

    Screen.call( this,
      function() { return new ManualGeneExpressionModel();},
      function( model ) { return new ManualGeneExpressionScreenView( model ); },
      options
    );
  }

  geneExpressionEssentials.register( 'ManualGeneExpressionScreen', ManualGeneExpressionScreen );

  return inherit( Screen, ManualGeneExpressionScreen );
} );
