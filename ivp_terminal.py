#!/usr/bin/env python3
import cmd
import subprocess
import sys
import os

class IVPTerminal(cmd.Cmd):
    intro = "Welcome to the IVP standalone terminal. Type help or ? to list commands."
    prompt = "(IVP) "

    def do_start_backend(self, arg):
        """Start the Flask backend"""
        if hasattr(self, 'backend') and self.backend.poll() is None:
            print("Backend is already running.")
            return
        self.backend = subprocess.Popen([sys.executable, os.path.join('backend', 'app.py')])
        print("Backend started.")

    def do_start_plugin(self, arg):
        """Start the Q&A plugin"""
        if hasattr(self, 'plugin') and self.plugin.poll() is None:
            print("Plugin is already running.")
            return
        self.plugin = subprocess.Popen(['node', os.path.join('qna_plugin', 'whisper_bot.js')])
        print("Plugin started.")

    def do_stop(self, arg):
        """Stop running processes"""
        if hasattr(self, 'backend') and self.backend.poll() is None:
            self.backend.terminate()
            self.backend.wait()
            print("Backend stopped.")
        if hasattr(self, 'plugin') and self.plugin.poll() is None:
            self.plugin.terminate()
            self.plugin.wait()
            print("Plugin stopped.")

    def do_exit(self, arg):
        """Exit the terminal"""
        self.do_stop(arg)
        print("Goodbye!")
        return True

    def do_EOF(self, arg):
        return self.do_exit(arg)

if __name__ == '__main__':
    IVPTerminal().cmdloop()
