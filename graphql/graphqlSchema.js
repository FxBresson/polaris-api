import { composeWithMongoose } from 'graphql-compose-mongoose/node8';
import mongoid from 'graphql-compose-mongoose/node8/types/mongoid';
import { schemaComposer } from 'graphql-compose';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';
import moment from 'moment';
moment.locale(process.env.LOCALE)

import {} from 'dotenv/config';
const overwatch = require('overwatch-api');

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
    filter: (source, args, context, info) => ({
      _operators : { 
        _id: { ne: context.user._id }
      },
      lineup: source._id,
      status: 'Player'
    }),
  },
  projection: { _id: 1 }, 
})
// LineupTC.addRelation('currentPlayer', {
//   resolver: () => PlayerTC.getResolver('findById'),
//   prepareArgs: { 
//     _id: (source, args, context, info) => context.user._id,
//   },
//   projection: { _id: 1 }, 
// })
LineupTC.addRelation('matchHistory', {
  resolver: () => MatchTC.get('$findMany'), // shorthand for `UserTC.getResolver('findMany')`
  prepareArgs: { // resolver `findMany` has `filter` arg, we may provide mongoose query to it
    filter: (source) => ({
      _operators : { // Applying criteria on fields which have operators enabled for them (by default, indexed fields only)
        date: { lte: moment() }
      },
      lineup: source._id,
    }),
  },
  projection: { _id: 1 }, // required fields from source object
});
LineupTC.addRelation('matchSchedule', {
  resolver: () => MatchTC.get('$findMany'),
  prepareArgs: { 
    filter: (source) => ({
      _operators : {
        date: { gte: moment() }
      },
      lineup: source._id,
    }),
  },
  projection: { _id: 1 }, 
});

CharacterTC.addRelation('role', {
  resolver: () => RoleTC.getResolver('findById'),
  prepareArgs: { 
    _id: (source) => source.role,
  },
  projection: { _id: 1 }, 
})

PlayerTC.addRelation('role', {
  resolver: () => RoleTC.getResolver('findById'),
  prepareArgs: { 
    _id: (source) => source.role,
  },
  projection: { _id: 1 }, 
})
PlayerTC.addRelation('lineup', {
  resolver: () => LineupTC.getResolver('findById'),
  prepareArgs: { 
    _id: (source) => source.lineup,
  },
  projection: { _id: 1 }, 
})
PlayerTC.addFields({
  name: { 
    type: 'String',
    description: 'Player name',
    resolve: (source, args, context, info) => {
      return source.mainBtag.split('#')[0]
    }
  },
})

const _findPlayerAndUpdate = (user) => {
  return new Promise((resolve, reject) => {
    overwatch.getProfile('pc', process.env.region, user.mainBtag.replace('#', '-'), (errP, jsonProfile) => {
      overwatch.getStats('pc', process.env.region, user.mainBtag.replace('#', '-'), (errS, jsonStats) => {
        let updates = {
          profile: {
            level: jsonProfile.level,
            portrait: jsonProfile.portrait,
            endorsement: jsonProfile.endorsement,
            rank: jsonProfile.competitive.rank,
            rank_img: jsonProfile.competitive.rank_img,
            levelFrame: jsonProfile.levelFrame,
            levelStars: jsonProfile.star
          },
          lastStats: jsonStats.stats
        }
        let options = {
          new: true
        }
        
        Player.findByIdAndUpdate(user._id, updates, options, (err, player) => {
          resolve(player)
        })
      })
    })  
  })
}

const findPlayerAndUpdate = (user) => {
  return new Promise((resolve, reject) => {
    Player.findById(user._id, (err, player) => {
      resolve(player)
    })
  })
}

PlayerTC.addResolver({
  name: 'playerLogin',
  kind: 'query',
  type: PlayerTC,
  resolve: async ({source, args, context, info}) => {
    return await findPlayerAndUpdate(context.user)
  }
})


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
      //stratMany: StratTC.getResolver('findMany'),
    //Player
    playerLogin: PlayerTC.getResolver('playerLogin'),
    playerOne: PlayerTC.getResolver('findOne'),
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
      // addCompToMapStrat: StratTC.getResolver('addCompToMapStrat'),
      // updateCompOfMapStrat: StratTC.getResolver('updateCompOfMapStrat'),
      // deleteCompFromMapStrat: StratTC.getResolver('deleteCompFromMapStrat'),
    //Lineup
    lineupUpdateById: LineupTC.getResolver('updateById'),
    //Match
    matchCreateOne: MatchTC.getResolver('createOne'),
    matchUpdateById: MatchTC.getResolver('updateById'),
    matchRemoveById: MatchTC.getResolver('removeById'),
    //Team
    teamUpdateOne: TeamTC.getResolver('updateOne'),
});


const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;