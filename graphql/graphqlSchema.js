import { composeWithMongoose } from 'graphql-compose-mongoose/node8';
import mongoid from 'graphql-compose-mongoose/node8/types/mongoid';
import { schemaComposer } from 'graphql-compose';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';
import moment from 'moment';
moment.locale(process.env.LOCALE)
import { 
    Map,
    Role,
    Character,
    Strat,
    Player,
    Lineup,
    Match,
    Team 
} from '../models';
import { start } from 'repl';

// STEP 2: CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {}; // left it empty for simplicity, described below
const MapTC = composeWithMongoose(Map, customizationOptions);
const RoleTC = composeWithMongoose(Role, customizationOptions);
const CharacterTC = composeWithMongoose(Character, customizationOptions);
const StratTC = composeWithMongoose(Strat, customizationOptions);
const PlayerTC = composeWithMongoose(Player, customizationOptions);
const LineupTC = composeWithMongoose(Lineup, customizationOptions);
const MatchTC = composeWithMongoose(Match, customizationOptions);
const TeamTC = composeWithMongoose(Team, customizationOptions);

LineupTC.addRelation('strats', {
  resolver: () => StratTC.getResolver('findMany'),
  prepareArgs: { 
    lineup: (source) => source._id,
  },
  projection: { _id: 1 }, 
})
LineupTC.addRelation('players', {
  resolver: () => PlayerTC.getResolver('findMany'),
  prepareArgs: { 
    lineup: (source) => source._id,
  },
  projection: { _id: 1 }, 
})
LineupTC.addRelation(
  'matchHistory',
  {
    resolver: () => MatchTC.get('$findMany'), // shorthand for `UserTC.getResolver('findMany')`
    prepareArgs: { // resolver `findMany` has `filter` arg, we may provide mongoose query to it
      filter: (source) => ({
        _operators : { // Applying criteria on fields which have
                       // operators enabled for them (by default, indexed fields only)
          date: { lte: moment() }
        },
        lineup: source._id,
      }),
    },
    projection: { friendsIds: 1, gender: 1 }, // required fields from source object
  }
);
LineupTC.addRelation(
  'matchSchedule',
  {
    resolver: () => MatchTC.get('$findMany'), // shorthand for `UserTC.getResolver('findMany')`
    prepareArgs: { // resolver `findMany` has `filter` arg, we may provide mongoose query to it
      filter: (source) => ({
        _operators : { // Applying criteria on fields which have
                       // operators enabled for them (by default, indexed fields only)
          date: { gte: moment() }
        },
        lineup: source._id,
      }),
    },
    projection: { friendsIds: 1, gender: 1 }, // required fields from source object
  }
);


LineupTC.addResolver({
    name: 'updateDoodle',
    kind: 'mutation',
    type: LineupTC.getResolver('updateOne').getType(),
    args: { weekDisponibilities: ['Boolean'], lineupId: mongoid },
    resolve: async ({ source, args, context, info }) => {
        let date = moment();
        let update = {};
        let path = `planning.doodle.${date.year()}.${date.week()}.${source.user.mainBtag}`
        update[path] = args.weekDisponibilities;
        let lineup = await Lineup.findByIdAndUpdate(args.lineupId, {$set: update}).exec()
        return {
            record: lineup,
            recordId: lineup._id
        };
    }
});


StratTC.addResolver({
    name: 'addCompToMapStrat',
    kind: 'mutation',
    type: LineupTC.getResolver('updateOne').getType(),
    args: { newComp: GraphQLJSON, strat_id: mongoid },
    resolve: async ({ source, args, context, info }) => {
        let strat = await Strat.findByIdAndUpdate(args.strat_id, {$push: {comp: args.newComp}}).exec()
        return {
            records: strat
        }
    }
});

StratTC.addResolver({
    name: 'updateCompOfMapStrat',
    kind: 'mutation',
    type: LineupTC.getResolver('updateOne').getType(),
    args: { newComp: GraphQLJSON, comp_id: mongoid, strat_id: mongoid },
    resolve: async ({ source, args, context, info }) => {
        let update = {}
        update[`comp.${args.comp_id}`] = args.newComp; 
        let strat = await Strat.findByIdAndUpdate(args.strat_id, {$set: {update}}).exec()
        return {
            records: strat
        }
    }
});

StratTC.addResolver({
    name: 'deleteCompFromMapStrat',
    kind: 'mutation',
    type: LineupTC.getResolver('updateOne').getType(),
    args: { comp_id: mongoid, strat_id: mongoid },
    resolve: async ({ source, args, context, info }) => {
        let stratOld = await Start.findById(args.strat_id).exec()
        stratOld.comp.id(args.comp_id).remove();
        let strat = await stratOld.save();
        return {
            records: strat
        }
    }
});

// STEP 3: Add needed CRUD User operations to the GraphQL Schema
// via graphql-compose it will be much much easier, with less typing
schemaComposer.Query.addFields({
    //Map
    mapOne: MapTC.getResolver('findOne'),
    mapsMany: MapTC.getResolver('findMany'),
    //Role
    roleOne: RoleTC.getResolver('findOne'),
    rolesMany: RoleTC.getResolver('findMany'),
    //Character
    characterOne: CharacterTC.getResolver('findOne'),
    characterMany: CharacterTC.getResolver('findMany'),
    //Strat
    stratMany: StratTC.getResolver('findMany'),
    //Player
    playerById: PlayerTC.getResolver('findById'),
    playersByIds: PlayerTC.getResolver('findByIds'),
    //Lineup
    lineupById: LineupTC.getResolver('findById'),
    lineupsByIds: LineupTC.getResolver('findByIds'),
    //Match
    matchById: TeamTC.getResolver('findById'),
    matchMany: TeamTC.getResolver('findMany'),
    //Team
    team: TeamTC.getResolver('findOne'),
});

schemaComposer.Mutation.addFields({
    //Player
    playerCreateOne: PlayerTC.getResolver('createOne'),
    playerUpdateById: PlayerTC.getResolver('updateById'),
    playerUpdateMany: PlayerTC.getResolver('updateMany'),
    playerRemoveById: PlayerTC.getResolver('removeOne'),
    //Strat
    stratCreateOne: StratTC.getResolver('createOne'),
    stratUpdateById: StratTC.getResolver('updateById'),
    stratRemoveById: StratTC.getResolver('removeById'),
    addCompToMapStrat: StratTC.getResolver('addCompToMapStrat'),
    updateCompOfMapStrat: StratTC.getResolver('updateCompOfMapStrat'),
    deleteCompFromMapStrat: StratTC.getResolver('deleteCompFromMapStrat'),
    //Lineup
    lineupCreateOne: LineupTC.getResolver('createOne'),
    lineupUpdateById: LineupTC.getResolver('updateById'),
    lineupRemoveById: LineupTC.getResolver('removeById'),
    updateDoodle: LineupTC.getResolver('updateDoodle'),
    //Match
    matchCreateOne: MatchTC.getResolver('createOne'),
    matchUpdateById: MatchTC.getResolver('updateById'),
    matchRemoveById: MatchTC.getResolver('removeById'),
    //Team
    teamUpdateOne: TeamTC.getResolver('updateOne'),
});




const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;