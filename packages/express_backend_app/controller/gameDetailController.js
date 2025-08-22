exports.gameDetailGet = (req, res) => {

  const algogame1 = [
    {
      game: "Catching twin bounty targets",
      difficulty: "Easy"
    },
    {
      game: "Leopard has trapped you in a tree",
      difficulty: "Medium"
    },
    {
      game: "Searching for a key in the Heystack",
      difficulty: "Medium"
    }
  ]

  const algogame2 = [
    {
      game: "Catching twin bounty targets",
      difficulty: "Easy"
    },
    {
      game: "Finding the thief in a large population",
      difficulty: "Easy"
    },
    {
      game: "Running through a Train",
      difficulty: "Easy"
    }
  ]

  const params = req.params;

  if (params.id === '1') {
    return res.json(algogame1)
  } else {
    return res.json(algogame2)
  }


}
