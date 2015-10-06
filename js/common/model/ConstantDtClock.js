// Copyright 2002-2015, University of Colorado Boulder
/**
 * The clock for this simulation.
 * The simulation time change (dt) on each clock tick is constant,
 *
 * @author Sharfudeen Ashraf
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var EventTimer = require( 'PHET_CORE/EventTimer' );

  /**
   *
   * @param {number} framesPerSecond
   * @param eventCallBack // a single argument function receiving "elapsed time"
   * @constructor
   */
  function ConstantDtClock( framesPerSecond, eventCallBack ) {

    var thisClock = this;
    thisClock.simulationTimeChange = 1 / framesPerSecond;
    thisClock.lastSimulationTime = 0.0;
    thisClock.simulationTime = 0.0;
    thisClock.eventCallBack = eventCallBack;
    // The clock for this simulation.
    // The simulation time change (dt) on each clock tick is constant,
    var constantEventModel = new EventTimer.ConstantEventModel( framesPerSecond );
    this.eventTimer = new EventTimer( constantEventModel, function( timeElapsed ) {
      thisClock.constantStep( timeElapsed );
    } );

  }

  return inherit( PropertySet, ConstantDtClock, {
    //called from AbstractSugarAndSaltSolutionsModel
    step: function( dt ) {
      // step one frame, assuming 60fps
      this.eventTimer.step( 1 / 60 );
    },

    constantStep: function( timeElapsed ) {
      this.tick( this.simulationTimeChange );

    },
    reset: function() {
      this.lastSimulationTime = 0.0;
      this.simulationTime = 0.0;
      this.speed = 1;
      PropertySet.prototype.reset.call( this );

      //fire reset event callback
      for ( var i = 0; i < this.resetCallBacks.length; i++ ) {
        this.resetCallBacks[i]();
      }
      this.model.reset();
    },

    /**
     * Update the clock, updating the wall time and possibly simulation time.
     */
    tick: function( simulationTimeChange ) {
      this.setSimulationTimeNoUpdate( this.simulationTime + simulationTimeChange );
      //fire step event callback
      this.eventCallBack( this.getSimulationTimeChange() );
    },
    /**
     * Gets the constant simulation time change (dt) between ticks.
     * @return dt
     */
    getDt: function() {
      this.getSimulationTimeChange();
    },
    getSimulationTimeChange: function() {
      return this.simulationTime - this.lastSimulationTime;
    },

    /**
     * Determine how much simulation time should pass if the clock is paused, and the user presses 'frame advance'
     * @return the simulation time.
     */
    getSimulationTimeChangeForPausedClock: function() {
      return this.simulationTimeChange;
    },
    setSimulationTimeNoUpdate: function( simulationTime ) {
      this.lastSimulationTime = this.simulationTime;
      this.simulationTime = simulationTime;
    }


  } );

} );