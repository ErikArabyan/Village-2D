//function rectangularCollision({ rectangle1, rectangle2 }) {  
//     return (
//  }
  // import { battleZonesData } from './assets/sprite/data/battleZones.js';
  function checkForCharacterCollision({
    characters,
    player,
    characterOffset = { x: 0, y: 0 }
  }) {
    player.interactionAsset = null
    // monitor for character collision
    for (let i = 0; i < characters.length; i++) {
      const character = characters[i]
  
      if (
        rectangularCollision({
        rectangle1: player,
          rectangle2: {
            ...character,
            position: {
              x: character.position.x + characterOffset.x,
              y: character.position.y + characterOffset.y
            }
          }
        })
      ) {
        player.interactionAsset = character
        break
      }
    }
  }

