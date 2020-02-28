// Copyright 2015-2020, University of Colorado Boulder
/**
 * main screen view for the 'mRNA' screen
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import mRnaProductionIcon from '../../mipmaps/mrna-production-icon_png.js';
import GEEConstants from '../common/GEEConstants.js';
import geneExpressionEssentialsStrings from '../gene-expression-essentials-strings.js';
import geneExpressionEssentials from '../geneExpressionEssentials.js';
import MessengerRnaProductionModel from './model/MessengerRnaProductionModel.js';
import MessengerRnaProductionScreenView from './view/MessengerRnaProductionScreenView.js';

const screenMRnaString = geneExpressionEssentialsStrings.screen.mRna;


/**
 * @constructor
 */
function MessengerRnaProductionScreen() {

  const options = {
    name: screenMRnaString,
    backgroundColorProperty: new Property( '#ABCBDB' ),
    homeScreenIcon: new Image( mRnaProductionIcon ),
    maxDT: GEEConstants.MAX_DT
  };

  Screen.call( this,
    function() { return new MessengerRnaProductionModel(); },
    function( model ) { return new MessengerRnaProductionScreenView( model ); },
    options
  );
}

geneExpressionEssentials.register( 'MessengerRnaProductionScreen', MessengerRnaProductionScreen );

inherit( Screen, MessengerRnaProductionScreen );
export default MessengerRnaProductionScreen;