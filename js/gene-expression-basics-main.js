//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  //var ManualGeneExpressionScreen = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/ManualGeneExpressionScreen' );
  var MessengerRnaProductionScreen = require('GENE_EXPRESSION_BASICS/mrnaproduction/MessengerRnaProductionScreen');
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!GENE_EXPRESSION_BASICS/gene-expression-basics.name' );

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
    var sim = new Sim(simTitle, [new MessengerRnaProductionScreen()], simOptions);
    sim.start();
  } );
} );