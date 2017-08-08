// Copyright 2015, University of Colorado Boulder
/**
 * main screen view for the 'mRNA' screen
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MessengerRnaProductionModel = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/model/MessengerRnaProductionModel' );
  var MessengerRnaProductionScreenView = require( 'GENE_EXPRESSION_ESSENTIALS/mrna-production/view/MessengerRnaProductionScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenMRnaString = require( 'string!GENE_EXPRESSION_ESSENTIALS/screen.mRna' );

  // images
  var mRnaProductionIcon = require( 'mipmap!GENE_EXPRESSION_ESSENTIALS/mrna-production-icon.png' );

  /**
   * @constructor
   */
  function MessengerRnaProductionScreen() {

    var options = {
      name: screenMRnaString,
      backgroundColorProperty: new Property( '#ABCBDB' ),
      homeScreenIcon: new Image( mRnaProductionIcon )
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
