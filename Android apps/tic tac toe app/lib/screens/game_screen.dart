import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../utils/app_theme.dart';
import '../providers/game_provider.dart';

class GameScreen extends StatelessWidget {
  const GameScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: Consumer<GameProvider>(
          builder: (context, game, _) => Text(
            "Stage ${game.currentStageId}",
            style: AppTheme.headingStyle,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Consumer<GameProvider>(
        builder: (context, game, child) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Turn Indicator
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.surface,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: game.isPlayerTurn
                          ? AppTheme.primary
                          : AppTheme.secondary,
                    ),
                  ),
                  child: Text(
                    game.winner.isNotEmpty
                        ? "Winner: ${game.winner}"
                        : (game.isDraw
                              ? "Draw!"
                              : (game.isPlayerTurn
                                    ? "Your Turn"
                                    : (game.gameMode == 'local2p'
                                          ? "Player 2's Turn"
                                          : "AI's Turn"))),
                    style: AppTheme.bodyStyle.copyWith(
                      color: game.winner.isNotEmpty
                          ? Colors.greenAccent
                          : Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),

                const SizedBox(height: 30),

                // Game Board
                Container(
                  width: 350,
                  height: 350,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.surface,
                    borderRadius: BorderRadius.circular(25),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.5),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: GridView.builder(
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 3,
                          crossAxisSpacing: 10,
                          mainAxisSpacing: 10,
                        ),
                    itemCount: 9,
                    itemBuilder: (context, index) {
                      return _buildCell(context, index, game);
                    },
                  ),
                ),

                const SizedBox(height: 40),

                // Game Over Controls
                if (game.winner.isNotEmpty || game.isDraw)
                  Column(
                    children: [
                      if (game.winner == game.playerEmoji)
                        _buildWinStars(game.moveCount),

                      const SizedBox(height: 20),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          ElevatedButton.icon(
                            onPressed: () {
                              game.resetGame();
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white10,
                            ),
                            icon: const Icon(Icons.refresh),
                            label: const Text("Retry"),
                          ),
                          const SizedBox(width: 20),
                          if (game.winner == game.playerEmoji ||
                              (game.currentLevelId == 3 &&
                                  game.currentStageId ==
                                      15)) // Allow continue if won or boss defeated
                            ElevatedButton.icon(
                                  onPressed: () {
                                    // Find next stage logic is inside provider, but we need to trigger state Update to load new stage
                                    // For now, we will just simulate a "Next" by checking unlock status
                                    // But simpler: Just go back to Stages Screen to select next
                                    Navigator.pop(context);
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppTheme.primary,
                                    foregroundColor:
                                        Colors.black, // Better contrast on Cyan
                                  ),
                                  icon: const Icon(Icons.arrow_forward),
                                  label: const Text("Next Stage"),
                                )
                                .animate(onPlay: (c) => c.repeat(reverse: true))
                                .scale(
                                  duration: 1.seconds,
                                  begin: const Offset(1, 1),
                                  end: const Offset(1.1, 1.1),
                                ),
                        ],
                      ),
                    ],
                  ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildCell(BuildContext context, int index, GameProvider game) {
    final value = game.board[index];
    return GestureDetector(
      onTap: () {
        if ((game.isPlayerTurn || game.gameMode == 'local2p') &&
            value.isEmpty) {
          game.makeMove(index);
        }
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          color: value.isEmpty ? Colors.white10 : Colors.white12,
          borderRadius: BorderRadius.circular(15),
        ),
        child: Center(
          child: Text(value, style: const TextStyle(fontSize: 40))
              .animate(target: value.isNotEmpty ? 1 : 0)
              .scale(duration: 200.ms, curve: Curves.elasticOut),
        ),
      ),
    );
  }

  Widget _buildWinStars(int moves) {
    int stars = 0;
    if (moves <= 3) {
      stars = 3;
    } else if (moves == 4)
      stars = 2;
    else if (moves == 5)
      stars = 1;

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(3, (index) {
        return Icon(
          Icons.star,
          size: 40,
          color: index < stars ? Colors.amber : Colors.white10,
        ).animate(delay: Duration(milliseconds: index * 200)).scale().shake();
      }),
    );
  }
}
