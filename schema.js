import { GraphQLSchema, GraphQLString, GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLBoolean, GraphQLFloat, GraphQLEnumType, GraphQLInputObjectType } from 'graphql';
import { model, EVACStates, LEDStates } from './model.js';
import { PubSub } from 'graphql-subscriptions';

const EVACStatesType = new GraphQLEnumType({
  name: "EVACStates",
  values: {
    NORMAL: { value: EVACStates.NORMAL },
    EVAC: { value: EVACStates.EVAC },
  }
})

const LEDStatesType = new GraphQLEnumType({
  name: "LEDStates",
  values: {
    OFF: { value: LEDStates.OFF },
    SAFE: { value: LEDStates.SAFE },
    EVAC_OCCUPIED: { value: LEDStates.EVAC_OCCUPIED },
    EVAC_UNOCCUPIED: { value: LEDStates.EVAC_UNOCCUPIED },
  }
})

const DeviceType = new GraphQLObjectType({
  name: 'Device',
  fields: {
    danger: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    occupied: {
      type: GraphQLBoolean,
    },
    temperature: {
      type: GraphQLFloat,
    },
    humidity: {
      type: GraphQLFloat,
    },
    airQuality: {
      type: GraphQLFloat,
    },
    ledState: {
      type: new GraphQLNonNull(LEDStatesType),
    },
    evacState: {
      type: new GraphQLNonNull(EVACStatesType),
    },
    smokeDetected: {
      type: GraphQLBoolean,
    }
  }
});

const DeviceSensorsType = new GraphQLInputObjectType({
  name: 'DeviceSensors',
  fields: {
    occupied: {
      type: GraphQLBoolean,
    },
    temperature: {
      type: GraphQLFloat,
    },
    humidity: {
      type: GraphQLFloat,
    },
    airQuality: {
      type: GraphQLFloat,
    },
    smokeDetected: {
      type: GraphQLBoolean,
    }
  }
});

const ModelType = new GraphQLObjectType({
  name: 'Model',
  fields: {
    getDevice: {
      type: DeviceType,
      args: {id: {type: new GraphQLNonNull(GraphQLInt)}},
      resolve: (obj, {id}) => {
        if (0 <= id && id < obj.devices.length) {
          return obj.devices[id];
        }
      }
    }
  }
});

const MutationReturnType = new GraphQLObjectType({
  name: 'MutationReturn',
  fields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: obj => {
        return obj.success;
      }
    }
  }
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      model: {
        type: new GraphQLNonNull(ModelType),
        resolve: () => model,
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      updateSensors: {
        type: MutationReturnType,
        args: {id: { type: new GraphQLNonNull(GraphQLInt) }, sensors: { type: new GraphQLNonNull(DeviceSensorsType) }},
        resolve: (_, {id, sensors}) => {
          if (0 <= id && id < model.devices.length) {
            let device = model.devices[id];
            device.occupied = sensors.occupied;
            device.temperature = sensors.temperature;
            device.humidity = sensors.humidity;
            device.airQuality = sensors.airQuality;
            device.smokeDetected = sensors.smokeDetected;
            device.deferedEval();
            return {success: true};
          }
          return {success: false};
        }
      }
    }
  }),
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      greetings: {
        type: GraphQLString,
        description: "greetings is for example purposes only.",
        subscribe: async function* () {
          for (const hi of ['Hi', 'Bonjour', 'Hola', 'Ciao', 'Zdravo']) {
            yield { greetings: hi };
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        },
      },
      deviceChanged: {
        type: DeviceType,
        args: { id: { type: new GraphQLNonNull(GraphQLInt) }},
        resolve: obj => obj,
        subscribe: (_, {id}) => {
          if (0 <= id && id < model.devices.length) {
            let pubsub = new PubSub({eventEmitter: model.devices[id]});
            return pubsub.asyncIterableIterator("deviceChanged");
          }
        }
      },
      ledStateChanged: {
        type: LEDStatesType,
        args: { id: { type: new GraphQLNonNull(GraphQLInt) }},
        resolve: obj => obj,
        subscribe: (_, {id}) => {
          if (0 <= id && id < model.devices.length) {
            let pubsub = new PubSub({eventEmitter: model.devices[id]});
            return pubsub.asyncIterableIterator("ledStateChanged");
          }
        }
      }
    },
  }),
});

export default schema;