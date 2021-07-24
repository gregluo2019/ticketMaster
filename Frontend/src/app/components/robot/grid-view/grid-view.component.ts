import { Component, Input, OnInit } from '@angular/core';
import { DIRECTION, ToyRobot } from '../robot.model';

@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss']
})
export class GridViewComponent implements OnInit {
  @Input() toyRobot: ToyRobot = null

  gridArray = [...Array(25).keys()]

  constructor() { }

  ngOnInit(): void {
  }

  isToyRobotPosition(gridNumber: number): boolean {
    if (!this.toyRobot) {
      return false
    }
    let x = this.toyRobot.position.x
    let y = this.toyRobot.position.y
    if (gridNumber === (20 - y * 5 + x)) {
      return true
    }
    return false
  }

  gridBkColor(gridNumber: number): string {
    return this.isToyRobotPosition(gridNumber) ? 'green' : 'lightblue'
  }
  gridBorderLeft(gridNumber: number): string {
    return this.isToyRobotPosition(gridNumber) && this.toyRobot.direction === DIRECTION.WEST ? '30px solid red' : ''
  }
  gridBorderRight(gridNumber: number): string {
    return this.isToyRobotPosition(gridNumber) && this.toyRobot.direction === DIRECTION.EAST ? '30px solid red' : ''
  }
  gridBorderTop(gridNumber: number): string {
    return this.isToyRobotPosition(gridNumber) && this.toyRobot.direction === DIRECTION.NORTH ? '30px solid red' : ''
  }
  gridBorderBottom(gridNumber: number): string {
    return this.isToyRobotPosition(gridNumber) && this.toyRobot.direction === DIRECTION.SOUTH ? '30px solid red' : ''
  }
}
