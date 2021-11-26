// Copyright 2016-2021, University of Colorado Boulder

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
import multipleCellsIcon from '../../mipmaps/multiple-cells-icon_png.js';
import GEEConstants from '../common/GEEConstants.js';
import geneExpressionEssentials from '../geneExpressionEssentials.js';
import geneExpressionEssentialsStrings from '../geneExpressionEssentialsStrings.js';
import MultipleCellsModel from './model/MultipleCellsModel.js';
import MultipleCellsScreenView from './view/MultipleCellsScreenView.js';

class MultipleCellsScreen extends Screen {

  constructor() {

    const options = {
      name: geneExpressionEssentialsStrings.screen.multipleCells,
      backgroundColorProperty: new Property( 'black' ),
      homeScreenIcon: new ScreenIcon( new Image( multipleCellsIcon ), {
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