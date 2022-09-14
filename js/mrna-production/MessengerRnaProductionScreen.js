// Copyright 2015-2022, University of Colorado Boulder
/**
 * main screen view for the 'mRNA' screen
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import mrnaProductionIcon_png from '../../mipmaps/mrnaProductionIcon_png.js';
import GEEConstants from '../common/GEEConstants.js';
import geneExpressionEssentials from '../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../GeneExpressionEssentialsStrings.js';
import MessengerRnaProductionModel from './model/MessengerRnaProductionModel.js';
import MessengerRnaProductionScreenView from './view/MessengerRnaProductionScreenView.js';

class MessengerRnaProductionScreen extends Screen {

  constructor() {

    const options = {
      name: GeneExpressionEssentialsStrings.screen.mRnaStringProperty,
      backgroundColorProperty: new Property( '#ABCBDB' ),
      homeScreenIcon: new ScreenIcon( new Image( mrnaProductionIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      maxDT: GEEConstants.MAX_DT
    };

    super(
      () => new MessengerRnaProductionModel(),
      model => new MessengerRnaProductionScreenView( model ),
      options
    );
  }
}

geneExpressionEssentials.register( 'MessengerRnaProductionScreen', MessengerRnaProductionScreen );
export default MessengerRnaProductionScreen;