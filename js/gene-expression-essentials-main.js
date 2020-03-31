// Copyright 2016-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import geneExpressionEssentialsStrings from './geneExpressionEssentialsStrings.js';
import ManualGeneExpressionScreen from './manual-gene-expression/ManualGeneExpressionScreen.js';
import MessengerRnaProductionScreen from './mrna-production/MessengerRnaProductionScreen.js';
import MultipleCellsScreen from './multiple-cells/MultipleCellsScreen.js';

const geneExpressionEssentialsTitleString = geneExpressionEssentialsStrings[ 'gene-expression-essentials' ].title;

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