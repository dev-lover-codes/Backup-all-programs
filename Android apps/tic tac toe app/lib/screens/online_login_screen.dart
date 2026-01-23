import 'package:flutter/material.dart';
import '../utils/app_theme.dart';
import '../services/supabase_service.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'online_match_screen.dart';

class OnlineLoginScreen extends StatefulWidget {
  const OnlineLoginScreen({super.key});

  @override
  State<OnlineLoginScreen> createState() => _OnlineLoginScreenState();
}

class _OnlineLoginScreenState extends State<OnlineLoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  Future<void> _signIn() async {
    setState(() => _isLoading = true);
    try {
      await SupabaseService().signIn(
        _emailController.text,
        _passwordController.text,
      );
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const OnlineMatchScreen()),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error: $e")));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _signUp() async {
    setState(() => _isLoading = true);
    try {
      await SupabaseService().signUp(
        _emailController.text,
        _passwordController.text,
      );
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Sign up successful! Please log in.")),
      );
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error: $e")));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text("Online Login"),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Stack(
        children: [
          // 1. Background Gradient
          Container(
            decoration: const BoxDecoration(gradient: AppTheme.primaryGradient),
          ),

          // 2. Ambient Blobs (Decorative)
          Positioned(
            top: -100,
            right: -100,
            child:
                Container(
                      width: 300,
                      height: 300,
                      decoration: BoxDecoration(
                        color: AppTheme.secondary.withOpacity(0.5),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.secondary.withOpacity(0.5),
                            blurRadius: 100,
                            spreadRadius: 20,
                          ),
                        ],
                      ),
                    )
                    .animate(onPlay: (c) => c.repeat(reverse: true))
                    .scale(
                      duration: 4.seconds,
                      begin: const Offset(1, 1),
                      end: const Offset(1.2, 1.2),
                    ),
          ),
          Positioned(
            bottom: -50,
            left: -50,
            child:
                Container(
                      width: 250,
                      height: 250,
                      decoration: BoxDecoration(
                        color: AppTheme.accent.withOpacity(0.5),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.accent.withOpacity(0.5),
                            blurRadius: 100,
                            spreadRadius: 20,
                          ),
                        ],
                      ),
                    )
                    .animate(onPlay: (c) => c.repeat(reverse: true))
                    .moveY(duration: 5.seconds, begin: 0, end: 50),
          ),

          // 3. Glassmorphism Form Card
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 400),
                child: Container(
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(30),
                    border: Border.all(color: Colors.white.withOpacity(0.2)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.account_circle,
                        size: 80,
                        color: Colors.white,
                      ),
                      const SizedBox(height: 20),
                      Text(
                        "Welcome Back",
                        style: AppTheme.titleStyle.copyWith(fontSize: 28),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        "Sign in to play online",
                        style: TextStyle(color: Colors.white70),
                      ),
                      const SizedBox(height: 30),

                      // Email Field
                      TextField(
                        controller: _emailController,
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: Colors.black.withOpacity(0.3),
                          prefixIcon: const Icon(
                            Icons.email,
                            color: AppTheme.primary,
                          ),
                          labelText: "Email",
                          labelStyle: const TextStyle(color: Colors.white70),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: BorderSide.none,
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: const BorderSide(
                              color: AppTheme.primary,
                            ),
                          ),
                        ),
                        style: const TextStyle(color: Colors.white),
                      ).animate().slideX(duration: 400.ms, begin: -0.1, end: 0),

                      const SizedBox(height: 15),

                      // Password Field
                      TextField(
                        controller: _passwordController,
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: Colors.black.withOpacity(0.3),
                          prefixIcon: const Icon(
                            Icons.lock,
                            color: AppTheme.secondary,
                          ),
                          labelText: "Password",
                          labelStyle: const TextStyle(color: Colors.white70),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: BorderSide.none,
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: const BorderSide(
                              color: AppTheme.secondary,
                            ),
                          ),
                        ),
                        obscureText: true,
                        style: const TextStyle(color: Colors.white),
                      ).animate().slideX(
                        duration: 400.ms,
                        begin: 0.1,
                        end: 0,
                        delay: 100.ms,
                      ),

                      const SizedBox(height: 30),

                      if (_isLoading)
                        const CircularProgressIndicator(color: AppTheme.primary)
                      else
                        Column(
                          children: [
                            SizedBox(
                              width: double.infinity,
                              height: 50,
                              child: ElevatedButton(
                                onPressed: _signIn,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppTheme.primary,
                                  shadowColor: AppTheme.primary.withOpacity(
                                    0.5,
                                  ),
                                  elevation: 5,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(15),
                                  ),
                                ),
                                child: Text(
                                  "LOGIN",
                                  style: AppTheme.buttonTextStyle,
                                ),
                              ),
                            ).animate().scale(delay: 200.ms),

                            const SizedBox(height: 15),

                            SizedBox(
                              width: double.infinity,
                              height: 50,
                              child: OutlinedButton(
                                onPressed: _signUp,
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: Colors.white,
                                  side: const BorderSide(color: Colors.white54),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(15),
                                  ),
                                ),
                                child: const Text(
                                  "Create Account",
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                              ),
                            ).animate().scale(delay: 300.ms),
                          ],
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
