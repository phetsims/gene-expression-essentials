// Copyright 2015, University of Colorado Boulder

/**
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var ManualGeneExpressionModel = require( 'GENE_EXPRESSION_ESSENTIALS/manualgeneexpression/model/ManualGeneExpressionModel' );
  var ManualGeneExpressionScreenView = require( 'GENE_EXPRESSION_ESSENTIALS/manualgeneexpression/view/ManualGeneExpressionScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var geneExpressionEssentialsTitleString = require( 'string!GENE_EXPRESSION_ESSENTIALS/gene-expression-essentials.title' );

  /**
   * @constructor
   */
  function ManualGeneExpressionScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, geneExpressionEssentialsTitleString, icon,
      function() { return new ManualGeneExpressionModel();},
      function( model ) { return new ManualGeneExpressionScreenView( model ); },
      { backgroundColor: '#ABCBDB' }
    );
  }

  return inherit( Screen, ManualGeneExpressionScreen );
} );