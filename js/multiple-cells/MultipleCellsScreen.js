// Copyright 2016-2022, University of Colorado Boulder

/**
 * main screen view class for the "Multiple Cells" screen
 *
 * @author Aadish Gupta
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import multipleCellsIcon_png from '../../mipmaps/multipleCellsIcon_png.js';
import GEEConstants from '../common/GEEConstants.js';
import geneExpressionEssentials from '../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../GeneExpressionEssentialsStrings.js';
import MultipleCellsModel from './model/MultipleCellsModel.js';
import MultipleCellsScreenView from './view/MultipleCellsScreenView.js';

class MultipleCellsScreen extends Screen {

  constructor() {

    const options = {
      name: GeneExpressionEssentialsStrings.screen.multipleCellsStringProperty,
      backgroundColorProperty: new Property( 'black' ),
      homeScreenIcon: new ScreenIcon( new Image( multipleCellsIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      maxDT: GEEConstants.MAX_DT
    };

    super(
      () => new MultipleCellsModel(),
      model => new MultipleCellsScreenView( model ),
      options
    );
  }
}

geneExpressionEssentials.register( 'MultipleCellsScreen', MultipleCellsScreen );
export default MultipleCellsScreen;