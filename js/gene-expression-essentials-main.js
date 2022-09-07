// Copyright 2016-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import GeneExpressionEssentialsStrings from './GeneExpressionEssentialsStrings.js';
import ManualGeneExpressionScreen from './manual-gene-expression/ManualGeneExpressionScreen.js';
import MessengerRnaProductionScreen from './mrna-production/MessengerRnaProductionScreen.js';
import MultipleCellsScreen from './multiple-cells/MultipleCellsScreen.js';

const geneExpressionEssentialsTitleStringProperty = GeneExpressionEssentialsStrings[ 'gene-expression-essentials' ].titleStringProperty;

const simOptions = {
  credits: {
    leadDesign: 'Steele Dalton, John Blanco',
    softwareDevelopment: 'John Blanco, Aadish Gupta, Sharfudeen Ashraf, George Emanuel',
    team: 'John Blanco, Mike Klymkowsky, Amanda McGarry, Ariel Paul, Katherine Perkins, Tom Perkins',
    qualityAssurance: 'Steele Dalton, Kerrie Dochen, Bryce Griebenow, Ethan Johnson, Liam Mulhall, Arnab Purkayastha, Ben Roberts, Clara Wilson'
  }
};

// we are go for launch
simLauncher.launch( () => {
  const sim = new Sim( geneExpressionEssentialsTitleStringProperty,
    [
      new ManualGeneExpressionScreen(),
      new MessengerRnaProductionScreen(),
      new MultipleCellsScreen()
    ], simOptions );
  sim.start();
} );