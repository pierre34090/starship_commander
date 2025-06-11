
export function generateEnemy() {
  const names = ["Bandit", "Drone", "Mutant", "Raider", "Giant Crab"];
  return {
    name: names[Math.floor(Math.random() * names.length)],
    force: Math.floor(Math.random() * 10) + 1,
    hp: Math.floor(Math.random() * 20) + 10,
    maxHp: 0 // to be set later
  };
}