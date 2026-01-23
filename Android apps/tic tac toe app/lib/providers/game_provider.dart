import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/level_model.dart';
import '../services/ai_service.dart';

class GameProvider extends ChangeNotifier {
  String playerEmoji = '😎';
  String opponentEmoji = '🤖';

  List<Level> levels = [];
  Map<int, List<Stage>> levelStages = {};

  // Game State
  List<String> board = List.filled(9, '');
  bool isPlayerTurn = true;
  String winner = '';
  bool isDraw = false;
  int moveCount = 0;

  // Current Context
  int currentLevelId = 1;
  int currentStageId = 1;

  // Game Mode: 'ai' or 'local2p'
  String gameMode = 'ai';

  GameProvider() {
    _initializeLevels();
  }

  void _initializeLevels() {
    // Level 1: Easy
    levels.add(
      Level(
        id: 1,
        name: "Easy Peasy",
        description: "Warm up!",
        totalStages: 15,
        difficulty: 'easy',
        isLocked: false,
      ),
    );
    levelStages[1] = List.generate(
      15,
      (index) => Stage(
        id: index + 1,
        levelId: 1,
        stageNumber: index + 1,
        isLocked: index == 0 ? false : true,
      ),
    );

    // Level 2: Normal
    levels.add(
      Level(
        id: 2,
        name: "Getting Serious",
        description: "Think twice.",
        totalStages: 15,
        difficulty: 'normal',
        isLocked: true,
      ),
    );
    levelStages[2] = List.generate(
      15,
      (index) => Stage(
        id: index + 1,
        levelId: 2,
        stageNumber: index + 1,
        isLocked: true,
      ),
    );

    // Level 3: Impossible
    levels.add(
      Level(
        id: 3,
        name: "Mission Impossible",
        description: "Good luck.",
        totalStages: 15,
        difficulty: 'impossible',
        isLocked: true,
      ),
    );
    levelStages[3] = List.generate(
      15,
      (index) => Stage(
        id: index + 1,
        levelId: 3,
        stageNumber: index + 1,
        isLocked: true,
      ),
    );

    _loadProgress();
  }

  Future<void> _loadProgress() async {
    final prefs = await SharedPreferences.getInstance();
    // Load unlocked status for levels and stages
    for (var lvl in levels) {
      if (lvl.id == 1) continue; // Level 1 always unlocked
      bool unlocked = prefs.getBool('level_${lvl.id}_unlocked') ?? false;
      // You can implement logic to unlock level objects here
      // For simplicity, we are regenerating the list, but effectively we should update the 'isLocked' property
      if (unlocked) {
        int index = levels.indexWhere((l) => l.id == lvl.id);
        if (index != -1) {
          levels[index] = Level(
            id: lvl.id,
            name: lvl.name,
            description: lvl.description,
            totalStages: lvl.totalStages,
            difficulty: lvl.difficulty,
            isLocked: false,
          );
        }
      }
    }

    for (var lvlId in levelStages.keys) {
      var stages = levelStages[lvlId]!;
      for (int i = 0; i < stages.length; i++) {
        if (lvlId == 1 && i == 0) continue; // First stage always unlocked
        bool unlocked =
            prefs.getBool('level_${lvlId}_stage_${stages[i].id}_unlocked') ??
            false;
        int stars =
            prefs.getInt('level_${lvlId}_stage_${stages[i].id}_stars') ?? 0;
        if (unlocked) {
          stages[i] = stages[i].copyWith(isLocked: false, stars: stars);
        }
      }
    }
    notifyListeners();
  }

  void setEmojis(String player, String opponent) {
    playerEmoji = player;
    opponentEmoji = opponent;
    notifyListeners();
  }

  void setGameMode(String mode) {
    gameMode = mode;
    notifyListeners();
  }

  void startGame(int levelId, int stageId) {
    currentLevelId = levelId;
    currentStageId = stageId;
    resetGame();
  }

  void resetGame() {
    board = List.filled(9, '');
    isPlayerTurn = true; // Player always starts first in this logic, or random
    winner = '';
    isDraw = false;
    moveCount = 0;
    notifyListeners();
  }

  Future<void> makeMove(int index) async {
    if (board[index] != '' || winner != '') return;

    // In local 2P mode, alternate between player emojis
    if (gameMode == 'local2p') {
      board[index] = isPlayerTurn ? playerEmoji : opponentEmoji;
      moveCount++;

      String currentPlayerEmoji = isPlayerTurn ? playerEmoji : opponentEmoji;

      if (_checkWin(currentPlayerEmoji)) {
        winner = currentPlayerEmoji;
      } else if (!board.contains('')) {
        isDraw = true;
      } else {
        // Switch turn
        isPlayerTurn = !isPlayerTurn;
      }
      notifyListeners();
      return;
    }

    // AI mode (original logic)
    board[index] = playerEmoji;
    moveCount++;
    if (_checkWin(playerEmoji)) {
      winner = playerEmoji;
      await _handleWin();
    } else if (!board.contains('')) {
      isDraw = true;
      // For Impossible Stage 15, Draw is acceptable/success? "Stage 15 is unwinnable, forced loss or tie."
      // If it's stage 15, we allow them to proceed on Tie?
      // Requirement: "Stage 15 is unwinnable, forced loss or tie." (So they can't win).
      // Does a tie count as "beating" the stage? Usually yes in "Unwinnable" scenarios if the goal is survival.
      // However, typically you proceed by "Winning".
      // Standard logic: "Next Stage button should only unlock after beating current stage."
      // If Stage 15 is unwinnable, maybe the objective is just to Play it?
      // Or maybe Tie = Win for Stage 15?
      // Let's assume Tie count as Win for Level 3 Stage 15 ONLY.
      if (currentLevelId == 3 && currentStageId == 15) {
        await _handleWin(); // Treat tie as win for the final boss to "finish" the game?
        // Or maybe just show "Game Over - You Survived"?
      }
    } else {
      isPlayerTurn = false;
      notifyListeners();

      // Delay for AI
      await Future.delayed(const Duration(milliseconds: 500));
      _aiMove();
    }
    notifyListeners();
  }

  void _aiMove() {
    if (winner != '' || isDraw) return;

    String difficulty = levels
        .firstWhere((l) => l.id == currentLevelId)
        .difficulty;

    // Level 3 Stage 15 Override: Impossible/Perfect
    if (currentLevelId == 3 && currentStageId == 15) {
      difficulty = 'impossible';
    }

    int moveIndex = AIService.getBestMove(
      board,
      difficulty,
      opponentEmoji,
      playerEmoji,
    );

    if (moveIndex != -1) {
      board[moveIndex] = opponentEmoji;
      if (_checkWin(opponentEmoji)) {
        winner = opponentEmoji;
      } else if (!board.contains('')) {
        isDraw = true;
        // Same check for Stage 15 tie
        if (currentLevelId == 3 && currentStageId == 15) {
          _handleWin();
        }
      }
    }
    isPlayerTurn = true;
    notifyListeners();
  }

  bool _checkWin(String player) {
    return AIService.checkWin(board, player);
  }

  Future<void> _handleWin() async {
    // Calculate stars
    int stars = 0;
    if (moveCount <= 3) {
      stars = 3;
    } else if (moveCount == 4)
      stars = 2;
    else if (moveCount == 5)
      stars = 1;
    else
      stars = 0;

    // Save stars for current stage
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(
      'level_${currentLevelId}_stage_${currentStageId}_stars',
      stars,
    );

    // Unlock next stage
    _unlockNextStage(prefs);
    notifyListeners();
  }

  Future<void> _unlockNextStage(SharedPreferences prefs) async {
    // Unlock next stage in current level
    List<Stage> stages = levelStages[currentLevelId]!;
    int nextStageIndex = stages.indexWhere((s) => s.id == currentStageId) + 1;

    if (nextStageIndex < stages.length) {
      Stage nextStage = stages[nextStageIndex];
      levelStages[currentLevelId]![nextStageIndex] = nextStage.copyWith(
        isLocked: false,
      );
      await prefs.setBool(
        'level_${currentLevelId}_stage_${nextStage.id}_unlocked',
        true,
      );
    } else {
      // Level Complete! Unlock next level
      int nextLevelId = currentLevelId + 1;
      if (nextLevelId <= 3) {
        int lvlIndex = levels.indexWhere((l) => l.id == nextLevelId);
        if (lvlIndex != -1) {
          levels[lvlIndex] = Level(
            id: levels[lvlIndex].id,
            name: levels[lvlIndex].name,
            description: levels[lvlIndex].description,
            totalStages: 15,
            difficulty: levels[lvlIndex].difficulty,
            isLocked: false,
          );
          await prefs.setBool('level_${nextLevelId}_unlocked', true);

          // Also ensure first stage of next level is unlocked (it is by default in init, but good to be sure)
          await prefs.setBool('level_${nextLevelId}_stage_1_unlocked', true);
        }
      }
    }
  }
}
