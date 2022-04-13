# Tic-tac-toe game
Worked on factory functions, module patterns. Implemented minimax algorithm for AI

    if n // 10 == 0:
        s = Link(n)
        return s
    else:
        s = store_digits(n // 10)
        s.rest = Link(s.rest, Link(n % 10))
        return s
