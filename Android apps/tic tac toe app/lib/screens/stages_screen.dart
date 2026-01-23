import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../utils/app_theme.dart';
import '../providers/game_provider.dart';
import 'game_screen.dart';

class StagesScreen extends StatelessWidget {
  final int levelId;
  const StagesScreen({super.key, required this.levelId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: Text("Level $levelId Stages", style: AppTheme.headingStyle),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: Consumer<GameProvider>(
        builder: (context, game, child) {
          final stages = game.levelStages[levelId];
          if (stages == null) {
            return const Center(child: Text("Error loading stages"));
          }

          return GridView.builder(
            padding: const EdgeInsets.all(20),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 15,
              mainAxisSpacing: 15,
            ),
            itemCount: stages.length,
            itemBuilder: (context, index) {
              final stage = stages[index];
              return _buildStageCard(
                context,
                stage,
              ).animate().scale(delay: Duration(milliseconds: index * 50));
            },
          );
        },
      ),
    );
  }

  Widget _buildStageCard(BuildContext context, dynamic stage) {
    // Dynamic type used to avoid import circular issues or quick access, but better to cast
    bool isLocked = stage.isLocked;
    int stars = stage.stars;

    return GestureDetector(
      onTap: isLocked
          ? null
          : () {
              Provider.of<GameProvider>(
                context,
                listen: false,
              ).startGame(levelId, stage.id);
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const GameScreen()),
              );
            },
      child: Container(
        decoration: BoxDecoration(
          color: isLocked
              ? AppTheme.surface.withOpacity(0.5)
              : AppTheme.surface,
          borderRadius: BorderRadius.circular(15),
          border: isLocked
              ? Border.all(color: Colors.white12)
              : Border.all(color: AppTheme.secondary.withOpacity(0.5)),
          boxShadow: isLocked
              ? []
              : [
                  BoxShadow(
                    color: AppTheme.secondary.withOpacity(0.1),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (isLocked)
              const Icon(Icons.lock, color: Colors.white24)
            else
              Text(
                "${stage.stageNumber}",
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            if (!isLocked && stars > 0)
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(3, (index) {
                  return Icon(
                    Icons.star,
                    size: 12,
                    color: index < stars ? Colors.amber : Colors.white12,
                  );
                }),
              ),
          ],
        ),
      ),
    );
  }
}
