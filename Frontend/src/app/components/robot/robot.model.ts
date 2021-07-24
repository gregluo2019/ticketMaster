export const COMMAND = Object.freeze({
    PLACE: 'PLACE',
    MOVE: 'MOVE',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    REPORT: 'REPORT'
})

export const DIRECTION = Object.freeze({
    NORTH: 'NORTH',
    EAST: 'EAST',
    SOUTH: 'SOUTH',
    WEST: 'WEST'
})

export class Position {
    constructor(
        public x: number = -1,
        public y: number = -1
    ) { }
}

export class ToyBoard {
    constructor(
        public rows: number,
        public columns: number
    ) { }


}

export class ToyRobot {
    constructor(
        public direction: string,
        public position: Position
    ) { }
}
