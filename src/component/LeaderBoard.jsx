import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getLeaderBoard, getUsers } from "../ApiClient";

function LeaderBoard() {
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [error, setError] = useState(false);

  const refreshLeaderBoard = () => {
    getLeaderBoard()
      .then((res) => {
        const leaderBoard = res.data;
        let userIds = leaderBoard.map((row) => row.userId);

        getUsers(userIds)
          .then((res) => {
            let userMap = new Map();

            res.data.forEach((idAlias) => {
              userMap.set(idAlias.id, idAlias.alias);
            });

            //Add a property to exisiting leader board data
            leaderBoard.forEach((row) => {
              row["alias"] = userMap.get(row.userId);
            });

            setLeaderBoard(leaderBoard);
          })
          .catch((err) => {
            console.log("Error mapping user ids", err);
            setLeaderBoard(leaderBoard);
          });
      })
      .catch((err) => {
        console.log("Gamification server error", err);
        setError(true);
      });
  };

  useEffect(() => {
    const intervalId = setInterval(() => refreshLeaderBoard(), 5000);
    return () => clearInterval(intervalId);
  }, []);

    if (error) {
      return (
        <div>
          We're sorry, but we can't display game statistics at this moment
        </div>
      );
    }

    return (
      <div>
        <h3>Leaderboard</h3>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Score</th>
              <th>Badges</th>
            </tr>
          </thead>
          <tbody>
            {leaderBoard.map((row) => (
              <tr key={row.userId}>
                <td>{row.alias ? row.alias : row.userId}</td>
                <td>{row.totalScore}</td>
                <td>
                  {row.badges.map((b) => (
                    <span className="badge" key={b}>
                      {b}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default LeaderBoard;
