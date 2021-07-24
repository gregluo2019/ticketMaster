import { MatSnackBar } from "@angular/material/snack-bar";
import { RobotService } from "./robot.service";

describe('RobotService', () => {
    let service: RobotService;
    beforeEach(() => { service = new RobotService(null); });

    it('Can set a Toy Robot', () => {
        let commands = ["PLACE 1,2,EAST"]
        service.executeCommands(commands)
        expect(service.toyRobot.position.x).toBe(1);
        expect(service.toyRobot.position.y).toBe(2);
        expect(service.toyRobot.direction).toBe('EAST');
    });

    it('Can move the Toy Robot', () => {
        let commands = ["PLACE 1,2,EAST", "MOVE", "MOVE"]
        service.executeCommands(commands)
        expect(service.toyRobot.position.x).toBe(3);
        expect(service.toyRobot.position.y).toBe(2);
    });

    it('Can rotate the Toy Robot', () => {
        let commands = ["PLACE 1,2,EAST", "MOVE", "MOVE", "LEFT"]
        service.executeCommands(commands)
        expect(service.toyRobot.position.x).toBe(3);
        expect(service.toyRobot.position.y).toBe(2);
        expect(service.toyRobot.direction).toBe('NORTH');
    });

    it('Can report the Toy Robot', () => {
        let commands = ["PLACE 1,2,EAST"]
        service.executeCommands(commands)
        service.generateReport()
        expect(service.report).toBe('Output: 1, 2, EAST');
    });

    it('Can set, move, rotate, and report the Toy Robot', () => {
        let commands = ["PLACE 1,2,EAST", "MOVE", "MOVE", "LEFT", "MOVE", "REPORT"]
        service.executeCommands(commands)
        service.generateReport()
        expect(service.report).toBe('Output: 3, 3, NORTH');
    });

    it('The toy robot must not fall off the table at initial placement.', () => {
        let commands = ["PLACE -1,2,EAST"]
        service.executeCommands(commands)
        service.generateReport()
        expect(service.toyRobot.position.x).toBe(0);
        expect(service.toyRobot.position.y).toBe(0);
        expect(service.toyRobot.direction).toBe('NORTH');
    });

    it('The toy robot must not fall off the table during movement.', () => {
        let commands = ["PLACE 1,2,WEST", "MOVE", "MOVE", "MOVE"]
        service.executeCommands(commands)
        service.generateReport()
        expect(service.toyRobot.position.x).toBe(0);
        expect(service.toyRobot.position.y).toBe(2);
    });
});