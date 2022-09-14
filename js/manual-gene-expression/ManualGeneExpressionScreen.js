// Copyright 2015-2022, University of Colorado Boulder

/**
 * main screen view type for the 'Expression' screen
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import manualGeneExpressionIcon_png from '../../mipmaps/manualGeneExpressionIcon_png.js';
import GEEConstants from '../common/GEEConstants.js';
import geneExpressionEssentials from '../geneExpressionEssentials.js';
import GeneExpressionEssentialsStrings from '../GeneExpressionEssentialsStrings.js';
import ManualGeneExpressionModel from './model/ManualGeneExpressionModel.js';
import ManualGeneExpressionScreenView from './view/ManualGeneExpressionScreenView.js';

class ManualGeneExpressionScreen extends Screen {

  constructor() {

    const options = {
      name: GeneExpressionEssentialsStrings.screen.expressionStringProperty,
      backgroundColorProperty: new Property( '#ABCBDB' ),
      homeScreenIcon: new ScreenIcon( new Image( manualGeneExpressionIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      maxDT: GEEConstants.MAX_DT
    };

    super(
      () => new ManualGeneExpressionModel(),
      model => new ManualGeneExpressionScreenView( model ),
      options
    );
  }
}

geneExpressionEssentials.register( 'ManualGeneExpressionScreen', ManualGeneExpressionScreen );
export default ManualGeneExpressionScreen;