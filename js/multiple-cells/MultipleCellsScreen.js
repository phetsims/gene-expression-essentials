// Copyright 2016-2020, University of Colorado Boulder

/**
 * main screen view class for the "Multiple Cells" screen
 *
 * @author Aadish Gupta
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import multipleCellsIcon from '../../mipmaps/multiple-cells-icon_png.js';
import GEEConstants from '../common/GEEConstants.js';
import geneExpressionEssentialsStrings from '../geneExpressionEssentialsStrings.js';
import geneExpressionEssentials from '../geneExpressionEssentials.js';
import MultipleCellsModel from './model/MultipleCellsModel.js';
import MultipleCellsScreenView from './view/MultipleCellsScreenView.js';

const screenMultipleCellsString = geneExpressionEssentialsStrings.screen.multipleCells;


/**
 * @constructor
 */
function MultipleCellsScreen() {

  const options = {
    name: screenMultipleCellsString,
    backgroundColorProperty: new Property( 'black' ),
    homeScreenIcon: new Image( multipleCellsIcon ),
    maxDT: GEEConstants.MAX_DT
  };

  Screen.call( this,
    function() { return new MultipleCellsModel(); },
    function( model ) { return new MultipleCellsScreenView( model ); },
    options
  );
}

geneExpressionEssentials.register( 'MultipleCellsScreen', MultipleCellsScreen );

inherit( Screen, MultipleCellsScreen );
export default MultipleCellsScreen;