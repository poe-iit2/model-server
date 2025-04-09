import { GraphQLSchema, GraphQLString, GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLBoolean, GraphQLFloat, GraphQLEnumType } from 'graphql';
import { model, EVACStates, LEDStates } from './model.mjs';

const EVACStatesType = new GraphQLEnumType({
  name: "EVACStates",
  values: {
    NORMAL: { value: EVACStates.NORMAL },
    LEFT: { value: EVACStates.LEFT },
    RIGHT: { value: EVACStates.RIGHT },
  }
})

const LEDStatesType = new GraphQLEnumType({
  name: "LEDStates",
  values: {
    OFF: { value: LEDStates.OFF },
    NORMAL: { value: LEDStates.NORMAL },
    LEFT: { value: LEDStates.LEFT },
    RIGHT: { value: LEDStates.RIGHT },
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


const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      },
      model: {
        type: new GraphQLNonNull(ModelType),
        resolve: () => model
      }
    }
  }),
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      greetings: {
        type: GraphQLString,
        subscribe: async function* () {
          for (const hi of ['Hi', 'Bonjour', 'Hola', 'Ciao', 'Zdravo']) {
            yield { greetings: hi };
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        },
      },
    },
  }),
});

export default schema;