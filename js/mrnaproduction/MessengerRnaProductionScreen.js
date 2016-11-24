// Copyright 2015, University of Colorado Boulder
/**
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var MessengerRnaProductionModel = require( 'GENE_EXPRESSION_ESSENTIALS/mrnaproduction/model/MessengerRnaProductionModel' );
  var MessengerRnaProductionScreenView = require( 'GENE_EXPRESSION_ESSENTIALS/mrnaproduction/view/MessengerRnaProductionScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );

  // strings
  var mRnaString = require( 'string!GENE_EXPRESSION_ESSENTIALS/mRna' );

  /**
   * @constructor
   */
  function MessengerRnaProductionScreen() {

    var options = {
      name: mRnaString,
      backgroundColorProperty: new Property( Color.toColor( '#ABCBDB' ) )
      //TODO add homeScreenIcon
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