Implementation Notes
====================

This simulation was originally written in Java, and then ported to JavaScript.  As a result, there is a fair amount of
code that looks a bit "Java-esque" and would have been done differently if the code had been written from scratch as a
JavaScript simulation.  For example, there are a lot of deep inheritance hierarchies - something which is done a lot in
Java but is not as common in JavaScript.  On a more detailed level, there are a number of getter and setter methods for
things that were private member variables in Java and are, due to the nature of the JavaScript, publicly accessible
attributes in this new implementation.

# Implementation Notes for Screens 1 and 2

Gene Expression Basics is a relatively complex simulation as PhET sims go.  The
model, in particular, is quite sophisticated due to the complexity of the domain that is
being modeled, i.e. the molecular basis for protein synthesis.  One of the
main abstractions used in the design of the model code is the “Biomolecule”.
Everything that moves on the first and second screens is a
descendant of a type called “MobileBiomolecule”.  The model code controls the
motion of these biomolecules and the interaction between them, and the
interaction between the mobile biomolecules and the DNA.  Note that, although
DNA is considered a biomolecule in real life, it does not move in this simulation
and is therefore not a "mobile biomolecule" in the code.  It is thus treated
somewhat differently from the other mobile biomolecules, such as ribosomes and
RNA polymerase.

The motion and attachment behavior of the mobile biomolecules are controlled by
a set of types that were designed to centralize as much of this code as
possible.  A "strategy pattern" was used for this, and the primary base type is
MotionStrategy.  More on these later.

The attachment behavior for each biomolecule is governed by the
AttachmentStateMachine types, and these can become fairly complex.  The
attachment state machines are responsible for determining when a biomolecule
should attach to another biomolecule, attach to the DNA, detach from a current
attachment, avoid attaching to anything, and so forth.  In designing the type
hierarchy, a generic version of the attachment state machine was created, and 
specialized behavior is added through inheritance as needed for each of the biomolecules.

At each time step, each biomolecule does the following:
- Updates its position
- Updates its "attachment state", which determine how it will move during the
  subsequent time step

At each time step, a biomolecule first moves based on its current motion
strategy.  After this, it looks at its attachment state and decides whether
to seek out any new attachments.  If it is available for attachments, it will
poll other molecules that it could potentially attach to in order to see if
there are attachment sites that are open and are close enough. It does this by
"proposing an attachment" to the other biomolecule(s).  The convention for this
is that each biomolecule has one or more methods named "considerProposalFromX",
where the "X" indicates the type of the proposer.  If a proposal is accepted, an
attachment site is returned, and the proposing biomolecule will start moving
toward that site.  If the biomolecule that is being stepped is already moving
towards an attachment, or is already attached, it generally does not seek out
any new attachments.

In general, the behavior of each mobile biomolecule can be described by a state
machine, the states and transitions for which are shown in the diagram below.
This is not quite exactly what the previously described AttachmentStateMachine
does, since the details vary for the different biomolecules.
Behavior that is unique to a given biomolecule is added through overriding
individual states or the default attachment state machine.

```

                   ----------------------------
                   | UNATTACHED_AND_AVAILABLE |
                   ----------------------------
                   ^                      |  ^
                   |                      |  |
                   |                      V  |
------------------------------          -----------------------------
| UNATTACHED_BUT_UNAVAILABLE |          | MOVING_TOWARDS_ATTACHMENT |
------------------------------          -----------------------------
                      ^                           |
                      |                           |
                       -------       -------------
                              |     |
                              |     V
                             ------------
                             | ATTACHED |
                             ------------
```

Biomolecules propose attachments to other biomolecules.  If the biomolecule
that receives the proposal has an attachment site that is close enough and is
open, it will generally accept the attachment request.  Once a proposal is
accepted, the proposing molecule starts moving toward the attachment site on
the accepting molecule.  These pending attachments can be interrupted in some
cases, such as when the user grabs one of them before the attachment occurs,
and some of the more complex code in the state machines handles such cases.

## Motion Strategies

The motion of each biomolecule is controlled by a motion strategy, which is a
type that essentially decides where the molecule should go next in model
space at each time step.  For the most part, the motion strategy is set by the
molecule's attachment state machine (more on attachment state machines below).
Once the general idea of how these are used is understood, the different motion
strategies themselves are reasonably straightforward.

## Attachment Sites

Attachment sites are another key concept in the architecture of this
simulation. Attachment sites are places where a biomolecule can attach, and
each one can only have one biomolecule attached at a time.

In each attachment that occurs, there is an attacher and an attachee.

Attachment sites do not specify the type of biomolecule that can attach to it.
It is up to the individual biomolecules to keep track of which attachment sites
are appropriate for which biomolecules.  This was done because it is possible
in some cases to have one attachment site pertain to a number of different
types of biomolecules.

## View

The view is fairly straightforward.  Each biomolecule in the model has a view
component that portrays its position, shape, and color.  The view provides
toolbox nodes that allow the user to create and remove biomolecules by
dragging them out of or in to the toolbox.

# Screen 3 - Multiple Cells Model

The 3rd screen shares very little code with the first two.  The central part of
the underlying model for the third screen is a type called
CellProteinSynthesisSimulator, which simulates the behavior of a single cell
that exhibits varying levels of protein expression based on a set of parameters
for the cell, such as transcription factor level, polymerase affinity, and so
forth.  A set of instances of this protein synthesizer type are created and
depicted for the user so that they can see the variations that occur in the
cells as time goes on, and can also experiment with the effects of changing
several of the parameters that affect protein production.

# Closing Thoughts

As previously mentioned, this sim is relatively complex.  If you are reading
this because you have been assigned to do some maintenance, and the changes
require more than a cursory understanding of the simulation, the best plan
for ramping up would be to spend some time studying and understanding the
inheritance hierarchies - especially the ones related to the attachment state
machines.  Hopefully, once that part makes sense, it should be reasonably
easy to target and change the appropriate portion of the code.