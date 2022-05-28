/**
 * Copyright (C) 2022 Hanyang University
 * 
 * @author Wonseo Choi
 */

import {Args, Parameter, InPort, OutPort, State, Triggers, Action, Reactor, App, TimeValue, Origin, Log, WritablePort} from "../core/internal";

Log.global.level = Log.levels.INFO;
class ActorCreator extends Reactor {

}

class ActorReactor extends Reactor {

}

class ActorCreation extends App {
    creater: ActorCreator
    areactor: ActorReactor

}