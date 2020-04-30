// Copyright 2015-2020, University of Colorado Boulder

/**
 * This class defines a node that can be used in the view to create biomolecules in the model. It is intended for use in
 * panels, often referred to as "toolboxes". It is generalized so that the parameters allow it to create any sort of
 * biomolecule.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import inherit from '../../../../phet-core/js/inherit.js';
import SimpleDragHandler from '../../../../scenery/js/input/SimpleDragHandler.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

/**
 * @param {Path} appearanceNode - Node that represents the appearance of this creator node, generally looks like the
 * thing being created.
 * @param canvas - Canvas upon which this node ultimately resides.  This is needed for figuring out where in model
 * space this node exists.
 * @param {ModelViewTransform2} modelViewTransform - Model view transform.
 * @param {Function<>} moleculeCreator -  Function object that knows how to create the model element and add it to the
 * model.
 * @param {Function<>} moleculeDestroyer
 * @param enclosingToolboxNode - Toolbox in which this creator node is  contained.  This is needed in order to
 * determine when the created model element is returned to the toolbox.
 * @constructor
 */
function BiomoleculeCreatorNode( appearanceNode, canvas, modelViewTransform, moleculeCreator, moleculeDestroyer, enclosingToolboxNode ) {
  const self = this;
  Node.call( self, { cursor: 'pointer' } );
  this.canvas = canvas; // @private
  this.modelViewTransform = modelViewTransform; // @private
  this.appearanceNode = appearanceNode; // @private
  this.biomolecule = null; // @private

  // Appearance Node is a bioMolecule Node which has its own DragHandler, since the node within the creator Node only
  // serves as a icon, it shouldn't be pickable - otherwise the DragHandler of the BioMolecule takes over the
  // Input Listener of the creator Node
  appearanceNode.pickable = false;

  this.mouseArea = appearanceNode.bounds.dilated( 2 );
  this.touchArea = appearanceNode.bounds.dilated( 5 );

  this.addInputListener( new SimpleDragHandler( {

    // Allow moving a finger (touch) across this node to interact with it
    allowTouchSnag: true,
    start: function( event, trail ) {
      //Set the node to look faded out so that something is still visible. This acts as a legend in the toolbox.
      self.pickable = false;
      self.appearanceNode.opacity = SunConstants.DISABLED_OPACITY;

      // Convert the canvas position to the corresponding location in the model.
      const modelPos = self.getModelPosition( event.pointer.point );

      // Create the corresponding biomolecule and add it to the model.
      self.biomolecule = moleculeCreator( modelPos );
      self.biomolecule.userControlledProperty.set( true );

      // Add an observer to watch for this model element to be returned.
      const finalBiomolecule = self.biomolecule;
      var userControlledPropertyObserver = function( userControlled ) {
        if ( !userControlled ) {
          // The user has released this biomolecule.  If it  was dropped above the return bounds (which are generally
          // the bounds of the toolbox where this creator node resides),then the model element should be removed from
          // the model.
          if ( enclosingToolboxNode.bounds.containsPoint( modelViewTransform.modelToViewPosition( finalBiomolecule.getPosition() ) ) ) {
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
      self.biomolecule.setPosition( self.biomolecule.getPosition().plus( modelViewTransform.viewToModelDelta( translationParams.delta ) ) );
    },

    end: function( event ) {
      self.biomolecule.userControlledProperty.set( false );
      self.biomolecule = null;
    }

  } ) );
  // Add the main node with which the user will interact.
  this.addChild( appearanceNode );
}

geneExpressionEssentials.register( 'BiomoleculeCreatorNode', BiomoleculeCreatorNode );

inherit( Node, BiomoleculeCreatorNode, {

  /**
   * Resets the Biomolecules as legends
   * @public
   */
  reset: function() {
    if ( this.biomolecule !== null ) {
      this.biomolecule.userControlledProperty.unlink( this.userControlledPropertyObserver );
      this.biomolecule = null;
    }
    this.appearanceNode.opacity = 1;
    this.pickable = true;
  },

  /**
   * @param {Vector2} point
   * @returns {Vector2}
   * @private
   */
  getModelPosition: function( point ) {
    const canvasPosition = this.canvas.globalToLocalPoint( point );
    const adjustedCanvasPos = canvasPosition.minus( this.canvas.viewPortOffset );
    return this.modelViewTransform.viewToModelPosition( adjustedCanvasPos );
  }
} );

export default BiomoleculeCreatorNode;