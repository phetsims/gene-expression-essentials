// Copyright 2015, University of Colorado Boulder
/**
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var MessengerRnaProductionModel = require( 'GENE_EXPRESSION_ESSENTIALS/mrnaproduction/model/MessengerRnaProductionModel' );
  var MessengerRnaProductionScreenView = require( 'GENE_EXPRESSION_ESSENTIALS/mrnaproduction/view/MessengerRnaProductionScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var geneExpressionEssentialsTitleString = require( 'string!GENE_EXPRESSION_ESSENTIALS/gene-expression-essentials.title' );

  /**
   * @constructor
   */
  function MessengerRnaProductionScreen() {

    var options = {
      name: geneExpressionEssentialsTitleString, //TODO use screen name, not sim name
      backgroundColor: '#ABCBDB'
      //TODO add homeScreenIcon
    };

    Screen.call( this,
      function() { return new MessengerRnaProductionModel(); },
      function( model ) { return new MessengerRnaProductionScreenView( model ); },
      options
    );
  }

  geneExpressionEssentials.register( 'MessengerRnaProductionScreen', MessengerRnaProductionScreen );

  return inherit( Screen, MessengerRnaProductionScreen );
} );