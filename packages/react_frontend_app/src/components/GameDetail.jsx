import { Link } from 'react-router-dom';

//a game description component
function GameDetail(props) {
  const game = props.game;
  const difficulty = props.difficulty;
  return (
    <tr>
      <td><Link to="drawboard">{game}</Link></td>
      <td><Link to="drawboard">{difficulty}</Link></td>
    </tr>
  )
}

export default GameDetail;
