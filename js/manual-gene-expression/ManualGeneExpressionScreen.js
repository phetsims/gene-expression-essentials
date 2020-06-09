// Copyright 2015-2020, University of Colorado Boulder

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
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import manualGeneExpressionIcon from '../../mipmaps/manual-gene-expression-icon_png.js';
import GEEConstants from '../common/GEEConstants.js';
import geneExpressionEssentials from '../geneExpressionEssentials.js';
import geneExpressionEssentialsStrings from '../geneExpressionEssentialsStrings.js';
import ManualGeneExpressionModel from './model/ManualGeneExpressionModel.js';
import ManualGeneExpressionScreenView from './view/ManualGeneExpressionScreenView.js';

const screenExpressionString = geneExpressionEssentialsStrings.screen.expression;


/**
 * @constructor
 */
function ManualGeneExpressionScreen() {

  const options = {
    name: screenExpressionString,
    backgroundColorProperty: new Property( '#ABCBDB' ),
    homeScreenIcon: new ScreenIcon( new Image( manualGeneExpressionIcon ), {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } ),
    maxDT: GEEConstants.MAX_DT
  };

  Screen.call( this,
    function() { return new ManualGeneExpressionModel();},
    function( model ) { return new ManualGeneExpressionScreenView( model ); },
    options
  );
}

geneExpressionEssentials.register( 'ManualGeneExpressionScreen', ManualGeneExpressionScreen );

inherit( Screen, ManualGeneExpressionScreen );
export default ManualGeneExpressionScreen;