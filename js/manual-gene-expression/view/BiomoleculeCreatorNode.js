// Copyright 2015-2022, University of Colorado Boulder

/**
 * This class defines a node that can be used in the view to create biomolecules in the model. It is intended for use in
 * panels, often referred to as "toolboxes". It is generalized so that the parameters allow it to create any sort of
 * biomolecule.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Aadish Gupta
 */

import { DragListener, Node, SceneryConstants } from '../../../../scenery/js/imports.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';

class BiomoleculeCreatorNode extends Node {

  /**
   * @param {Path} appearanceNode - Node that represents the appearance of this creator node, generally looks like the
   * thing being created.
   * @param {ManualGeneExpressionScreenView} screenView - Screen view upon which this node ultimately resides.  This is
   * needed for figuring out where in model space this node exists and obtaining the node that represent the biomolecule
   * in the view.
   * @param {ModelViewTransform2} modelViewTransform - Model view transform.
   * @param {Function} moleculeCreator -  Function object that knows how to create the model element and add it to the
   * model.
   * @param {Function} moleculeDestroyer
   * @param enclosingToolboxNode - Toolbox in which this creator node is  contained.  This is needed in order to
   * determine when the created model element is returned to the toolbox.
   */
  constructor( appearanceNode, screenView, modelViewTransform, moleculeCreator, moleculeDestroyer, enclosingToolboxNode ) {
    super( { cursor: 'pointer' } );

    // @private - values used in methods
    this.screenView = screenView;
    this.modelViewTransform = modelViewTransform;
    this.appearanceNode = appearanceNode;
    this.biomolecule = null;

    // Appearance Node is a bioMolecule Node which has its own DragHandler, since the node within the creator Node only
    // serves as a icon, it shouldn't be pickable - otherwise the DragHandler of the BioMolecule takes over the
    // Input Listener of the creator Node
    appearanceNode.pickable = false;

    this.mouseArea = appearanceNode.bounds.dilated( 2 );
    this.touchArea = appearanceNode.bounds.dilated( 5 );

    // Add a listener that will create a biomolecule, then forward drag events to created node in the view.
    this.addInputListener( DragListener.createForwardingListener( event => {

      // Set the node to look faded out so that something is still visible. This acts as a legend in the toolbox.
      this.pickable = false;
      appearanceNode.opacity = SceneryConstants.DISABLED_OPACITY;

      // Convert the screenView position to the corresponding position in the model.
      const modelPosition = this.getModelPosition( event.pointer.point );

      // Create a biomolecule and add it to the model.
      this.biomolecule = moleculeCreator( modelPosition );
      this.biomolecule.userControlledProperty.set( true );

      // Add an observer to watch for this model element to be returned.
      this.userControlledListener = userControlled => {
        if ( !userControlled ) {

          // The user has released this biomolecule.  If it was dropped above the return bounds (which are generally
          // the bounds of the toolbox where this creator node resides), then the model element should be removed from
          // the model.  Otherwise the model will handle this change.
          const inBox = enclosingToolboxNode.bounds.containsPoint(
            modelViewTransform.modelToViewPosition( this.biomolecule.getPosition() )
          );
          if ( inBox ) {
            moleculeDestroyer( this.biomolecule );
            this.biomolecule.userControlledProperty.unlink( this.userControlledListener );

            // Update this node to reflect that it's in a state where it can create a new biomolecule.
            this.appearanceNode.opacity = 1;
            this.pickable = true;

            // Update internal state.
            this.biomolecule = null;
          }
        }
      };

      this.biomolecule.userControlledProperty.link( this.userControlledListener );

      // Get the node that was added to the view for this biomolecule.
      const biomoleculeNode = screenView.mobileBiomoleculeToNodeMap.get( this.biomolecule );

      // Forward the event to the view node's drag handler.
      biomoleculeNode.dragHandler.press( event, biomoleculeNode );
    } ) );

    // Add the main node with which the user will interact.
    this.addChild( appearanceNode );
  }

  /**
   * Resets the Biomolecules as legends
   * @public
   */
  reset() {
    if ( this.biomolecule !== null ) {

      // Since there was an active biomolecule when reset was invoked, there should also be a listener on the user
      // controlled property.  Make sure that there is.
      assert && assert(
        this.biomolecule.userControlledProperty.hasListener( this.userControlledListener ),
        'the creator node should never be in a state where it has a biomolecule without a user-controlled listener'
      );

      this.biomolecule.userControlledProperty.unlink( this.userControlledListener );
      this.userControlledListener = null;
      this.biomolecule = null;
    }
    this.appearanceNode.opacity = 1;
    this.pickable = true;
  }

  /**
   * @param {Vector2} point
   * @returns {Vector2}
   * @private
   */
  getModelPosition( point ) {
    const screenViewPosition = this.screenView.globalToLocalPoint( point );
    const adjustedCanvasPos = screenViewPosition.minus( this.screenView.viewPortOffset );
    return this.modelViewTransform.viewToModelPosition( adjustedCanvasPos );
  }
}

geneExpressionEssentials.register( 'BiomoleculeCreatorNode', BiomoleculeCreatorNode );

export default BiomoleculeCreatorNode;
