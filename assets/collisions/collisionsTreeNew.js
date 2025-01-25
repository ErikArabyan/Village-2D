const collisionsTreeNew = [182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 182, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 182, 182, 0, 0, 0, 0, 182, 182, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 182, 182, 182, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 182, 182, 182, 182, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 182, 182, 182, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 182, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 182, 182, 182, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 0, 0, 0, 182, 182, 0, 0, 0, 0, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 182, 182, 0, 0, 0, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 182, 182, 0, 0, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 182, 182, 0, 0, 0, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 182, 182, 0, 0, 0, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 0, 0, 182, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 182, 182, 182, 182, 0, 0, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 0, 0, 0, 182, 182, 182, 182, 182, 182, 182, 182, 182, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 182, 182, 182, 182, 0, 0, 0, 0, 182, 182, 182, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 0, 0, 0, 0, 0, 182, 182, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182];