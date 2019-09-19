// Copyright 2016-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const ManualGeneExpressionScreen = require( 'GENE_EXPRESSION_ESSENTIALS/manual-gene-expression/ManualGeneExpressionScreen' );
  const MessengerRnaProductionScreen = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/MessengerRnaProductionScreen' );
  const MultipleCellsScreen = require( 'GENE_EXPRESSION_ESSENTIALS/multiple-cells/MultipleCellsScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  const geneExpressionEssentialsTitleString = require( 'string!GENE_EXPRESSION_ESSENTIALS/gene-expression-essentials.title' );

  const simOptions = {
    credits: {
      leadDesign: 'Steele Dalton, John Blanco',
      softwareDevelopment: 'John Blanco, Aadish Gupta, Sharfudeen Ashraf, George Emanuel',
      team: 'John Blanco, Mike Klymkowsky, Amanda McGarry, Ariel Paul, Katherine Perkins, Tom Perkins',
      qualityAssurance: 'Steele Dalton, Kerrie Dochen, Bryce Griebenow, Ethan Johnson, Liam Mulhall, Arnab Purkayastha, Ben Roberts, Clara Wilson'
    }
  };

  // we are go for launch
  SimLauncher.launch( function() {
    const sim = new Sim( geneExpressionEssentialsTitleString,
      [
        new ManualGeneExpressionScreen(),
        new MessengerRnaProductionScreen(),
        new MultipleCellsScreen()
      ], simOptions );
    sim.start();
  } );
} );
