// Copyright 2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var ManualGeneExpressionScreen = require('GENE_EXPRESSION_BASICS/manualgeneexpression/ManualGeneExpressionScreen');
//  var MessengerRnaProductionScreen = require('GENE_EXPRESSION_BASICS/mrnaproduction/MessengerRnaProductionScreen'); commented to pass lint test
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var geneExpressionBasicsTitleString = require( 'string!GENE_EXPRESSION_BASICS/gene-expression-basics.title' );

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
    var sim = new Sim( geneExpressionBasicsTitleString, [ new ManualGeneExpressionScreen() ], simOptions );
    sim.start();
  } );
} );