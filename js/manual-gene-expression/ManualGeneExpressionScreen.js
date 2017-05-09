// Copyright 2015, University of Colorado Boulder

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
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ManualGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/model/ManualGeneExpressionModel' );
  var ManualGeneExpressionScreenView = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/view/ManualGeneExpressionScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var expressionString = require( 'string!GENE_EXPRESSION_ESSENTIALS/expression' );

  // images
  var manualGeneExpressionIcon = require( 'mipmap!GENE_EXPRESSION_ESSENTIALS/manual-gene-expression-icon.png' );

  /**
   * @constructor
   */
  function ManualGeneExpressionScreen() {

    var options = {
      name: expressionString,
      backgroundColorProperty: new Property( '#ABCBDB' ),
      homeScreenIcon: new Image( manualGeneExpressionIcon )
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
