import { Link } from 'react-router-dom';

//a game description component
function GameDetail(props) {
  const game = props.game;
  const difficulty = props.difficulty;
  return (
    <tr>
      <td><Link to="drawgame">{game}</Link></td>
      <td><Link to="drawgame">{difficulty}</Link></td>
    </tr>
  )
}

export default GameDetail;
