// Copyright 2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var ManualGeneExpressionScreen = require('GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/ManualGeneExpressionScreen');
  var MessengerRnaProductionScreen = require('GENE_EXPRESSION_ESSENTIALS/mrna-production/MessengerRnaProductionScreen');
  var MultipleCellsScreen = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/MultipleCellsScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var geneExpressionEssentialsTitleString = require( 'string!GENE_EXPRESSION_ESSENTIALS/gene-expression-essentials.title' );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
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