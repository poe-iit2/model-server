import { EventEmitter } from 'node:events';

export const EVACStates = Object.freeze({
    NORMAL: "normal",
    LEFT: "left",
    RIGHT: "right"
});

export const LEDStates = Object.freeze({
    OFF: "off",
    ...EVACStates,
});

export class Device extends EventEmitter {
    danger = false;
    occupied = null;
    temperature = null;
    humidity = null;
    airQuality = null;
    ledState = LEDStates.OFF;
    evacState = EVACStates.NORMAL;

    setEvacState(evacState) {
        this.evacState = evacState;
        this.evalLedState();
    }

    evalLedState() {
        let ledState = this.occupied ? this.evacState : LEDStates.OFF;
        let needsUpdate = ledState != this.ledState;
        this.ledState = ledState;
        if (needsUpdate) this.ledStateChanged();
    }

    ledStateChanged() {
        this.emit('ledStateChanged', this.ledState);
    }

    deferedEval() {
        this.evalLedState();
        this.evalDanger();
        this.emit('deviceChanged', this);
    }

    evalDanger() {
        let danger = (this.temperature > 100);
        let needsUpdate = danger != this.danger;
        this.danger = danger;
        if (needsUpdate) updateGraph();
    }
}

export const model = {
    devices: [new Device(), new Device()],
}

function updateGraph() {
    let danger = model.devices[0].danger || model.devices[1].danger;
    if (danger) {
        model.devices[0].setEvacState(EVACStates.RIGHT);
        model.devices[1].setEvacState(EVACStates.LEFT);
    } else {
        model.devices[0].setEvacState(EVACStates.NORMAL);
        model.devices[1].setEvacState(EVACStates.NORMAL);
    }
}