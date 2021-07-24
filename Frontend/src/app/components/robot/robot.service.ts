

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';

import { COMMAND, DIRECTION, Position, ToyBoard, ToyRobot } from './robot.model';

@Injectable({ providedIn: 'root' })
export class RobotService {
    rows = 5
    columns = 5

    toyRobot: ToyRobot = null
    toyRobotSubject = new Subject()
    toyRobot$ = this.toyRobotSubject.asObservable()

    errorMessage: string = null
    errorMessageSubject = new Subject()

    report: string = null
    reportSubject = new Subject();

    constructor(public snackBar: MatSnackBar) {
        this.toyRobot = new ToyRobot(DIRECTION.NORTH, new Position())
    }

    public executeCommands(commands: string[]): void {
        commands.forEach((command: string) => {
            let commandArray = command.toUpperCase().split(' ')
            let commandText = commandArray[0].trim()
            if (!commandText) { return }
            switch (commandText) {
                case COMMAND.PLACE:
                    this.setToyRobot(commandArray)
                    break
                case COMMAND.MOVE:
                    this.moveToyRobot()
                    break
                case COMMAND.LEFT:
                    this.turnToLeft()
                    break
                case COMMAND.RIGHT:
                    this.turnToRight()
                    break
                case COMMAND.REPORT:
                    this.generateReport()
                    break
                default:
                    this.setErrorMessage(`Wrong command(${command})`)
            }
        });
    }

    public setToyRobot(commandArray: string[]): void {
        if (commandArray.length > 1) {
            let placeParameters = commandArray[1].split(',')
            if (placeParameters.length === 3) {
                let direction = placeParameters[2]
                if (Object.values(DIRECTION).includes(direction)) {
                    if (isNaN(+placeParameters[0]) || isNaN(+placeParameters[1])) {
                        this.setErrorMessage(`The position of the PLACE command(${commandArray.join(' ')})  is wrong`)
                    } else {
                        let newPosition = new Position(+ placeParameters[0], + placeParameters[1])
                        if (this.isValidPosition(newPosition)) {
                            this.toyRobot.direction = direction
                            this.toyRobot.position = newPosition
                            this.toyRobotSubject.next(this.toyRobot)
                        } else {
                            this.setErrorMessage(`The position of the PLACE command(${commandArray.join(' ')})  is wrong`)
                        }
                    }
                } else {
                    this.setErrorMessage(`The direction of the PLACE command(${commandArray.join(' ')})  is wrong`)
                }
            } else {
                this.setErrorMessage(`The parameters of PLACE command(${commandArray.join(' ')}) is wrong. The parameters like: X,Y,F`)
            }
        } else {
            this.setErrorMessage(`The PLACE command(${commandArray.join(' ')}) is wrong. The format likes: PLACE X,Y,F`)
        }
    }

    public moveToyRobot(): void {
        if (!this.isToyRobotOnTable()) { return }

        let newPosition = { ... this.toyRobot.position }
        switch (this.toyRobot.direction) {
            case DIRECTION.NORTH:
                newPosition.y += 1
                break;
            case DIRECTION.EAST:
                newPosition.x += 1
                break;
            case DIRECTION.SOUTH:
                newPosition.y -= 1
                break;
            case DIRECTION.WEST:
                newPosition.x -= 1;
                break;
        }
        if (this.isValidPosition(newPosition)) {
            this.toyRobot.position = newPosition
            this.toyRobotSubject.next(this.toyRobot)
        } else {
            this.setErrorMessage(`Cannot move the toy robot out of the table`)
        }
    }

    public turnToLeft(): void {
        if (!this.isToyRobotOnTable()) { return }

        switch (this.toyRobot.direction) {
            case DIRECTION.NORTH:
                this.toyRobot.direction = DIRECTION.WEST;
                break;
            case DIRECTION.EAST:
                this.toyRobot.direction = DIRECTION.NORTH;
                break;
            case DIRECTION.SOUTH:
                this.toyRobot.direction = DIRECTION.EAST;
                break;
            case DIRECTION.WEST:
                this.toyRobot.direction = DIRECTION.SOUTH;
                break;
        }

        this.toyRobotSubject.next(this.toyRobot)
    }

    public turnToRight(): void {
        if (!this.isToyRobotOnTable()) { return }

        switch (this.toyRobot.direction) {
            case DIRECTION.NORTH:
                this.toyRobot.direction = DIRECTION.EAST;
                break;
            case DIRECTION.EAST:
                this.toyRobot.direction = DIRECTION.SOUTH;
                break;
            case DIRECTION.SOUTH:
                this.toyRobot.direction = DIRECTION.WEST;
                break;
            case DIRECTION.WEST:
                this.toyRobot.direction = DIRECTION.NORTH;
                break;
        }

        this.toyRobotSubject.next(this.toyRobot)
    }

    public isValidPosition(position: Position): boolean {
        return position.x < this.columns && position.x >= 0 &&
            position.y < this.rows && position.y >= 0;
    }

    public setErrorMessage(errorMessage: string): void {
        this.errorMessage = errorMessage
        this.errorMessageSubject.next(errorMessage)
        if (this.snackBar) {
            this.snackBar.open(errorMessage, '', {
                duration: 3000,
                panelClass: ['mat-toolbar', 'mat-accent'],
                horizontalPosition: 'center',
                verticalPosition: 'top',
            });
        }
    }

    public generateReport(): void {
        if (!this.isToyRobotOnTable()) { return }

        this.report = `Output: ${this.toyRobot.position.x}, ${this.toyRobot.position.y}, ${this.toyRobot.direction}`
        this.reportSubject.next(this.report)
    }

    private isToyRobotOnTable(): boolean {
        return this.isValidPosition(this.toyRobot.position)
    }
}