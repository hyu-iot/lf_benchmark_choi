/**
 * Copyright (C) 2022 Hanyang University
 * 
 * @author Wonseo Choi
 */

import {Args, Parameter, InPort, OutPort, State, Triggers, Action, Reactor, App, TimeValue, Origin, Log, WritablePort} from "../core/internal";

Log.global.level = Log.levels.INFO;
class ActorCreator extends Reactor {
    start: InPort<boolean> = new InPort(this)
    create: InPort<boolean> = new InPort(this)
    outMessage: OutPort<boolean> = new OutPort(this)
    finished: OutPort<boolean> = new OutPort(this)

    sendNextMessage: Action<number>

    createNumber: Parameter<number>
    numMessagesPerReactor: Parameter<number>

    sentMessage: State<number> = new State(0)

    constructor (parent:Reactor, createNumber: number = 1000000, numMessagesPerReactor: number = 1000) {
        super(parent)
        this.sendNextMessage = new Action<number>(this, Origin.logical)

        this.addReaction(
            new Triggers(this.sendNextMessage),
            new Args(this.writable(this.outMessage), this.schedulable(this.sendNextMessage), this.writable(this.finished), this.numMessagesPerReactor, this.sentMessage),
            function(this, outMessage, sendNextMessage, finished, numMessagesPerReactor, sentMessage) {
                let sent_message = sentMessage.get()

                outMessage.set(true)
                sentMessage.set(sent_message + 1)

                if (sent_message < numMessagesPerReactor.get()) {
                    sendNextMessage.schedule(0, null)
                } else {
                    sentMessage.set(0)
                    finished.set(true)
                }
            }
        )

        this.addMutation(
            new Triggers(this.create),
            new Args(this.createNumber),
            function(this, create, createNumber) {
                let n = new ACReactor(this.getReactor())
                
            }
        )
    }
}

function performComputation(theta: number): void {
    const sint: number = Math.sin(theta);
    
    const res: number = sint * sint;
}

class ACReactor extends Reactor {
    inMessage: InPort<boolean> = new InPort(this)

    constructor (parent:Reactor) {
        super(parent);
        this.addReaction(
            new Triggers(this.inMessage),
            new Args(this.inMessage),
            function(this, inMessage) {
                performComputation(37.2)
            }
        )
    }
}

class ActorCreation extends App {
    creater: ActorCreator
    worker: ACReactor
    constructor (name: string, timeout: TimeValue | undefined = undefined, keepAlive: boolean = false, fast: boolean = false, success?: () => void, fail?: () => void) {
        super(timeout, keepAlive, fast, success, fail);
        this.creater = new ActorCreator(this, 1000000, 1000)
        this.worker = new ACReactor(this)
        this._connectMulti([this.creater.outMessage], [this.worker.inMessage], true)
    }
}

let actorcreation = new ActorCreation('ActorCreation')
actorcreation._start();