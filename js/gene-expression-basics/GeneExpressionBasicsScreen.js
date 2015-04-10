//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var GeneExpressionBasicsModel = require( 'GENE_EXPRESSION_BASICS/gene-expression-basics/model/GeneExpressionBasicsModel' );
  var GeneExpressionBasicsScreenView = require( 'GENE_EXPRESSION_BASICS/gene-expression-basics/view/GeneExpressionBasicsScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var geneExpressionBasicsSimString = require( 'string!GENE_EXPRESSION_BASICS/gene-expression-basics.name' );

  /**
   * @constructor
   */
  function GeneExpressionBasicsScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, geneExpressionBasicsSimString, icon,
      function() { return new GeneExpressionBasicsModel(); },
      function( model ) { return new GeneExpressionBasicsScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, GeneExpressionBasicsScreen );
} );