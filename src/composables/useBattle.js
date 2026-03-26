// composables/useBattle.js
import { typeChart } from '../utils/typeChart';

function getPrimaryType(pokemon) {
  return pokemon.types[0].type.name;
}

function getEffectiveness(attackerType, defenderType) {
  const mult = typeChart[attackerType]?.[defenderType];
  return mult !== undefined ? mult : 1;
}

export function comparePokemon(userPokemon, rivalPokemon) {
  const userType = getPrimaryType(userPokemon);
  const rivalType = getPrimaryType(rivalPokemon);
  const userAttack = getEffectiveness(userType, rivalType);
  const rivalAttack = getEffectiveness(rivalType, userType);

  if (userAttack > rivalAttack) return 'user';
  if (rivalAttack > userAttack) return 'rival';
  return 'draw';
}

export function getBattleResults(userTeam, rivalTeam) {
  if (userTeam.length !== 3 || rivalTeam.length !== 3) return [];

  const details = [];
  for (let i = 0; i < 3; i++) {
    const user = userTeam[i];
    const rival = rivalTeam[i];
    const outcome = comparePokemon(user, rival);
    details.push({
      userPokemon: user,
      rivalPokemon: rival,
      outcome
    });
  }
  return details;
}

export function getOverallOutcome(battleDetails) {
  let userWins = 0, rivalWins = 0;
  for (const match of battleDetails) {
    if (match.outcome === 'user') userWins++;
    else if (match.outcome === 'rival') rivalWins++;
  }
  if (userWins > rivalWins) return 'win';
  if (rivalWins > userWins) return 'loss';
  return 'draw';
}