// Copyright 2016-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var ManualGeneExpressionScreen = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/ManualGeneExpressionScreen' );
  var MessengerRnaProductionScreen = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/MessengerRnaProductionScreen' );
  var MultipleCellsScreen = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/MultipleCellsScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var geneExpressionEssentialsTitleString = require( 'string!GENE_EXPRESSION_ESSENTIALS/gene-expression-essentials.title' );

  var simOptions = {
    credits: {
      softwareDevelopment: 'Sharfudeen Ashraf, John Blanco, George Emanuel, Aadish Gupta',
      team: 'John Blanco, Steele Dalton, Mike Klymkowsky, Amanda McGarry, Ariel Paul, Katherine Perkins, Tom Perkins',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow',
      graphicArts: '',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( geneExpressionEssentialsTitleString,
      [
        new ManualGeneExpressionScreen(),
        new MessengerRnaProductionScreen(),
        new MultipleCellsScreen()
      ], simOptions );
    sim.start();
  } );
} );