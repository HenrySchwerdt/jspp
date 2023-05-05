import { Position } from "../parser/token";

export interface Visitable {

}

export abstract class Node implements Visitable {
    public readonly position: Position;

    constructor(position: Position) {
        this.position = position
    }
}

export abstract class Statement extends Node {
    constructor(position: Position) {
        super(position)
    }
}