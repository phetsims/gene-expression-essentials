// Copyright 2015, University of Colorado Boulder

/**
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var ManualGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/manualgeneexpression/model/ManualGeneExpressionModel' );
  var ManualGeneExpressionScreenView = require( 'GENE_EXPRESSION_ESSENTIALS/manualgeneexpression/view/ManualGeneExpressionScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var expressionString = require( 'string!GENE_EXPRESSION_ESSENTIALS/expression' );

  /**
   * @constructor
   */
  function ManualGeneExpressionScreen() {

    var options = {
      name: expressionString,
      backgroundColor: '#ABCBDB'
      //TODO add homeScreenIcon
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