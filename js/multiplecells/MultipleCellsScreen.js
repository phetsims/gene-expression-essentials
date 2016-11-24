// Copyright 2016, University of Colorado Boulder

/**
 * @author Aadish Gupta
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var MultipleCellsModel = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/model/MultipleCellsModel' );
  var MultipleCellsScreenView = require( 'GENE_EXPRESSION_ESSENTIALS/multiplecells/view/MultipleCellsScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );

  // strings
  var multipleCellsString = require( 'string!GENE_EXPRESSION_ESSENTIALS/multipleCells' );

  /**
   * @constructor
   */
  function MultipleCellsScreen() {

    var options = {
      name: multipleCellsString,
      backgroundColorProperty: new Property( Color.toColor( 'black' ) )
      //TODO add homeScreenIcon
    };

    Screen.call( this,
      function() { return new MultipleCellsModel(); },
      function( model ) { return new MultipleCellsScreenView( model ); },
      options
    );
  }

  geneExpressionEssentials.register( 'MultipleCellsScreen', MultipleCellsScreen );

  return inherit( Screen, MultipleCellsScreen );
} );