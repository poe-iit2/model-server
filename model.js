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
    smokeDetected = null;
    forcedDanger = null;
    forcedOccupancy = null;

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
        if (this.forcedOccupancy != null) {
            this.occupied = this.forcedOccupancy;
        }
        this.evalLedState();
        this.evalDanger();
        this.emit('deviceChanged', this);
    }

    evalDanger() {
        let danger = !!(this.temperature > 100 || this.smokeDetected);
        if (this.forcedDanger !== null) {
            danger = this.forcedDanger;
        }
        let needsUpdate = danger != this.danger;
        this.danger = danger;
        if (needsUpdate) updateGraph();
    }
}

const device_count = process.env.DEVICE_COUNT ? Number.parseInt(process.env.DEVICE_COUNT) : 4

export const model = {
    devices: Array.from({length: device_count}).map(_ => new Device()),
}

function updateGraph() {
    let danger = model.devices.find(d => d.danger) !== undefined;
    if (danger) {
        model.devices.forEach(device => device.setEvacState(EVACStates.EVAC));
    } else {
        model.devices.forEach(device => device.setEvacState(EVACStates.NORMAL));
    }
}