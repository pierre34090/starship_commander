export default function ShipPanel({ force, hp, maxHp }) {
  return (
    <div>
      <h2>Ship Status</h2>
      <p><strong>Combat Power:</strong> {force}</p>
      <p><strong>Hull Integrity:</strong> {hp} / {maxHp}</p>
    </div>
  );
}