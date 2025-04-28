import { EventEmitter } from 'node:events';

export const EVACStates = Object.freeze({
    NORMAL: "normal",
    EVAC: "evac"
});

export const LEDStates = Object.freeze({
    EVAC_OCCUPIED: "evac_occupied",
    EVAC_UNOCCUPIED: "evac_unoccupied",
    SAFE: "safe",
    OFF: "off"
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
        let ledState = this.evacState == EVACStates.EVAC
                       ? (this.occupied
                          ? LEDStates.EVAC_OCCUPIED
                          : LEDStates.EVAC_UNOCCUPIED)
                       : (this.occupied
                          ? LEDStates.SAFE
                          : LEDStates.OFF);
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
        model.devices[0].setEvacState(EVACStates.EVAC);
        model.devices[1].setEvacState(EVACStates.EVAC);
    } else {
        model.devices[0].setEvacState(EVACStates.NORMAL);
        model.devices[1].setEvacState(EVACStates.NORMAL);
    }
}