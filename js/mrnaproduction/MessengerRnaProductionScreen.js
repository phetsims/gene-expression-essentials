// Copyright 2015, University of Colorado Boulder
/**
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var MessengerRnaProductionModel = require( 'GENE_EXPRESSION_BASICS/mrnaproduction/model/MessengerRnaProductionModel' );
  var MessengerRnaProductionScreenView = require( 'GENE_EXPRESSION_BASICS/mrnaproduction/view/MessengerRnaProductionScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var geneExpressionBasicsNameString = require( 'string!GENE_EXPRESSION_BASICS/gene-expression-basics.name' );

  /**
   * @constructor
   */
  function MessengerRnaProductionScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;
    Screen.call( this, geneExpressionBasicsNameString, icon,
      function() {
        return new MessengerRnaProductionModel();
      },
      function( model ) {
        return new MessengerRnaProductionScreenView( model );
      },
      { backgroundColor: '#ABCBDB' }
    );
  }

  return inherit( Screen, MessengerRnaProductionScreen );
} );