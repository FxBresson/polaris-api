import { 
  Player,
} from '../models';

const updateDoodle = async () => {
  Player.find({}, (err, players) => {
    for (const player of players) {
      player.doodle = [...player.doodle.slice(7), ...Array(7).fill(player.defaultAvailability, 0, 7)]
      player.save()
    }
  })
}

export default updateDoodle
