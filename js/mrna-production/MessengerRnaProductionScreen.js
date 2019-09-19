// Copyright 2015-2017, University of Colorado Boulder
/**
 * main screen view for the 'mRNA' screen
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( require => {
  'use strict';

  // modules
  const GEEConstants = require( 'GENE_EXPRESSION_ESSENTIALS/common/GEEConstants' );
  const geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MessengerRnaProductionModel = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/model/MessengerRnaProductionModel' );
  const MessengerRnaProductionScreenView = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/view/MessengerRnaProductionScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenMRnaString = require( 'string!GENE_EXPRESSION_ESSENTIALS/screen.mRna' );

  // images
  const mRnaProductionIcon = require( 'mipmap!GENE_EXPRESSION_ESSENTIALS/mrna-production-icon.png' );

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

  return inherit( Screen, MessengerRnaProductionScreen );
} );
