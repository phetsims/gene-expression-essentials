// Copyright 2015-2017, University of Colorado Boulder

/**
 * main screen view type for the 'Expression' screen
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/GEEConstants' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ManualGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ManualGeneExpressionModel' );
  const ManualGeneExpressionScreenView = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/ManualGeneExpressionScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenExpressionString = require( 'string!GENE_EXPRESSION_ESSENTIALS/screen.expression' );

  // images
  const manualGeneExpressionIcon = require( 'mipmap!GENE_EXPRESSION_ESSENTIALS/manual-gene-expression-icon.png' );

  /**
   * @constructor
   */
  function ManualGeneExpressionScreen() {

    const options = {
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
