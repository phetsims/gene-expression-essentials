// Copyright 2015, University of Colorado Boulder

/**
 * This class defines a node that can be used in the view to create biomolecules in the model. It is intended for use in
 * control panels. It is generalized so that the parameters allow it to create any sort of biomolecule.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   *
   * @param {Path} appearanceNode - Node that represents the appearance of this creator node, generally
   * looks like the thing being created.
   * @param canvas - Canvas upon which this node ultimately resides.  This is needed for figuring out where in
   * model space this node exists.
   * @param {ModelViewTransform2} mvt - Model view transform.
   * @param {Function<>} moleculeCreator -  Function object that knows how to create the model element and add it to the model.
   * @param {Function<>} moleculeDestroyer
   * @param enclosingToolBoxNode - Tool box in which this creator node is  contained.  This is needed in order to
   determine when the created model element is returned to the tool box.
   * @constructor
   */
  function BiomoleculeCreatorNode( appearanceNode, canvas, mvt, moleculeCreator, moleculeDestroyer, enclosingToolBoxNode ) {
    var self = this;
    Node.call( self, { cursor: 'pointer' } );
    self.canvas = canvas;
    self.mvt = mvt;
    self.appearanceNode = appearanceNode;
    self.biomolecule = null;


    // Appearance Node is a bioMolecule Node which has its own DragHandler, since the node
    // within the creator Node only serves as a icon, it shouldn't be pickable -
    // otherwise the DragHandler of the BioMolecule takes over the Input Listener of the creator Node - Ashraf

    appearanceNode.pickable = false;
    self.mouseArea = appearanceNode.bounds;
    self.touchArea = appearanceNode.bounds;


    self.addInputListener( new SimpleDragHandler( {

      // Allow moving a finger (touch) across this node to interact with it
      allowTouchSnag: true,
      start: function( event, trail ) {
        //Set the node to look faded out so that something is still
        // visible.  This acts a a legend in the tool box.
        self.pickable = false;
        self.appearanceNode.opacity = 0.3;

        // Convert the canvas position to the corresponding location in the model.
        var modelPos = self.getModelPosition( event.pointer.point );

        // Create the corresponding biomolecule and add it to the model.
        self.biomolecule = moleculeCreator( modelPos );
        self.biomolecule.userControlledProperty.set( true );

        // Add an observer to watch for this model element to be returned.
        var finalBiomolecule = self.biomolecule;
        var userControlledPropertyObserver = function( userControlled ) {
          if ( !userControlled ) {
            // The user has released this biomolecule.  If it  was dropped above the return bounds (which are
            // generally the bounds of the tool box where this creator node resides),then the model element
            // should be removed from the model.
            if ( enclosingToolBoxNode.bounds.containsPoint( mvt.modelToViewPosition( finalBiomolecule.getPosition() ) ) ) {
              moleculeDestroyer( finalBiomolecule );
              finalBiomolecule.userControlledProperty.unlink( userControlledPropertyObserver );
              self.appearanceNode.opacity = 1;
              self.pickable = true;
            }
          }
        };

        self.biomolecule.userControlledProperty.link( userControlledPropertyObserver );
      },

      translate: function( translationParams ) {
        self.biomolecule.setPosition( self.biomolecule.getPosition().plus( mvt.viewToModelDelta( translationParams.delta ) ) );
      },

      end: function( event ) {
        self.biomolecule.userControlledProperty.set( false );
        self.biomolecule = null;
      }

    } ) );

    // Add the main node with which the user will interact.
    self.addChild( appearanceNode );

  }

  geneExpressionEssentials.register( 'BiomoleculeCreatorNode', BiomoleculeCreatorNode );

  return inherit( Node, BiomoleculeCreatorNode, {

    reset: function() {
      if ( this.biomolecule !== null ) {
        this.biomolecule.userControlledProperty.unlink( this.userControlledPropertyObserver );
        this.biomolecule = null;
      }
      this.appearanceNode.opacity = 1;
      this.pickable = true;
    },

    /**
     * Needs to take care ViewPortOffset TODO
     * @param point
     * @returns {*}
     */
    getModelPosition: function( point ) {
      var canvasPosition = this.canvas.globalToLocalPoint( point );
      var adjustedCanvasPos = canvasPosition.minus( this.canvas.viewPortOffset );
      return this.mvt.viewToModelPosition( adjustedCanvasPos );
    }
  } );
} );
